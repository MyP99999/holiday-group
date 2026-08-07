import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

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

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
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

  const register = async (name, email, password) => {
    if (!name.trim() || !email.trim() || password.length < 6) {
      throw new Error("Please fill all fields (password min 6 chars)");
    }
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/online/lobby`,
      },
    });
    if (error) throw error;
    return { ...data, needsEmailConfirmation: !data.session };
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/online/lobby` },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
