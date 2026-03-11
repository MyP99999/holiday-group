import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem("hg:auth")) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const login = async (email, password) => {
    if (!email || password.length < 6) throw new Error("Invalid credentials");
    // TODO: replace with Supabase auth
    const u = { email, name: email.split("@")[0] };
    localStorage.setItem("hg:auth", JSON.stringify(u));
    setUser(u);
  };

  const register = async (name, email, password) => {
    if (!name || !email || password.length < 6)
      throw new Error("Please fill all fields (password min 6 chars)");
    // TODO: replace with Supabase auth
    const u = { email, name };
    localStorage.setItem("hg:auth", JSON.stringify(u));
    setUser(u);
  };

  const loginWithGoogle = async () => {
    // TODO: replace with Supabase OAuth (supabase.auth.signInWithOAuth({ provider: 'google' }))
    throw new Error("Google sign-in requires the Supabase backend — coming soon!");
  };

  const logout = () => {
    localStorage.removeItem("hg:auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
