import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Browser } from "@capacitor/browser";
import { supabase } from "../lib/supabase";
import { authRedirectFor, isNativeApp, nativeAuthResult } from "../lib/nativeApp";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function userFromSession(session, profile) {
  const authUser = session?.user;
  if (!authUser) return null;
  return {
    id: authUser.id,
    email: authUser.email,
    name: profile?.display_name
      || authUser.user_metadata?.full_name
      || authUser.user_metadata?.name
      || authUser.email?.split("@")[0]
      || "Member",
    avatarUrl: profile?.avatar_url || authUser.user_metadata?.avatar_url || "",
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
      if (event === "SIGNED_OUT") setRecoveryMode(false);
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    const userId = session?.user?.id;
    if (!userId) {
      setProfile(null);
      return () => { active = false; };
    }

    setProfile(null);

    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setProfile(data || null);
      });

    return () => { active = false; };
  }, [session?.user?.id]);

  const user = useMemo(() => userFromSession(session, profile), [session, profile]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    return data;
  };

  const register = async (name, email, password, { redirectTo, returnPath = "/online/lobby" } = {}) => {
    if (!name.trim() || !email.trim() || password.length < 6) {
      throw new Error("Please fill all fields (password min 6 chars)");
    }
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: isNativeApp()
          ? authRedirectFor(returnPath, "signup")
          : redirectTo || `${window.location.origin}/online/lobby`,
      },
    });
    if (error) throw error;
    return { ...data, needsEmailConfirmation: !data.session };
  };

  const loginWithGoogle = async ({ redirectTo, returnPath = "/online/lobby" } = {}) => {
    const native = isNativeApp();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: native
          ? authRedirectFor(returnPath, "oauth")
          : redirectTo || `${window.location.origin}/online/lobby`,
        skipBrowserRedirect: native,
      },
    });
    if (error) throw error;
    if (native) {
      if (!data?.url) throw new Error("Google sign-in did not return an authorization URL.");
      await Browser.open({ url: data.url });
    }
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const requestPasswordReset = async (email) => {
    const cleanEmail = email?.trim();
    if (!cleanEmail) throw new Error("Add your email address first.");
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: authRedirectFor("/profile?mode=recovery", "recovery"),
    });
    if (error) throw error;
  };

  const updatePassword = async (currentPassword, newPassword, { recovery = false } = {}) => {
    if (!newPassword || newPassword.length < 8) {
      throw new Error("Use at least 8 characters for your new password.");
    }
    const passwordUpdate = recovery
      ? { password: newPassword }
      : { password: newPassword, current_password: currentPassword };
    const { data, error } = await supabase.auth.updateUser(passwordUpdate);
    if (error) throw error;
    setRecoveryMode(false);
    return data;
  };

  const updateProfile = async (displayName) => {
    const cleanName = displayName?.trim();
    if (!cleanName) throw new Error("Add the name you want the group to see.");

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ display_name: cleanName, updated_at: new Date().toISOString() })
      .eq("id", session?.user?.id);
    if (profileError) throw profileError;

    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: cleanName },
    });
    if (authError) throw authError;
    setProfile((current) => ({ ...(current || {}), display_name: cleanName }));
  };

  const deleteAccount = async (password) => {
    const email = session?.user?.email;
    if (!email || !password) throw new Error("Enter your password to continue.");

    const { data: reauthenticated, error: passwordError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (passwordError) throw new Error("That password is not correct.");

    const accessToken = reauthenticated.session?.access_token;
    const { data, error } = await supabase.functions.invoke("delete-account", {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    if (error) {
      let message = error.message;
      try {
        const response = await error.context.json();
        message = response?.error || message;
      } catch (_) {
        // The function client already provides a useful fallback message.
      }
      throw new Error(message);
    }

    await supabase.auth.signOut({ scope: "local" });
    setSession(null);
    setProfile(null);
    setRecoveryMode(false);
    return data;
  };

  const completeNativeAuthUrl = useCallback(async (url) => {
    const result = nativeAuthResult(url);
    if (result.error) throw new Error(result.error);

    if (result.code) {
      const { error } = await supabase.auth.exchangeCodeForSession(result.code);
      if (error) throw error;
    } else if (result.accessToken && result.refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
      });
      if (error) throw error;
    } else {
      throw new Error("The sign-in link did not include a valid session.");
    }

    if (result.mode === "recovery") setRecoveryMode(true);
    return result.returnPath;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      recoveryMode,
      login,
      register,
      loginWithGoogle,
      logout,
      requestPasswordReset,
      updatePassword,
      updateProfile,
      deleteAccount,
      completeNativeAuthUrl,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
