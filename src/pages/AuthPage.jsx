import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { googleAuthEnabled } from "../lib/supabase";
import BrandButton from "../components/BrandButton";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, login, register, loginWithGoogle } = useAuth();

  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) return <div className="app-loading"><span />Checking your sessionâ€¦</div>;
  if (user) return <Navigate to="/online/lobby" replace />;

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
        navigate("/online/lobby");
      } else {
        const result = await register(name, email, password);
        if (result.needsEmailConfirmation) {
          setMessage("Check your inbox to confirm your email, then sign in.");
          setTab("login");
        } else {
          navigate("/online/lobby");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setMessage("");
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <button className="back-btn auth-back-btn" onClick={() => navigate("/")}>
        <LuArrowLeft size={16} /> Back
      </button>

      <div className="auth-hero">
        <div className="header-badge">Online Mode</div>
        <BrandButton className="auth-brand" onClick={() => navigate("/")} />
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => changeTab("login")}>
            Sign In
          </button>
          <button className={`auth-tab${tab === "register" ? " active" : ""}`} onClick={() => changeTab("register")}>
            Register
          </button>
        </div>

        {googleAuthEnabled && (
          <>
            <button className="google-btn" onClick={handleGoogle} disabled={loading}>
              <FaGoogle size={16} color="#4285F4" />
              Continue with Google
            </button>
            <div className="auth-divider">or</div>
          </>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {tab === "register" && (
            <div>
              <label className="form-label" htmlFor="auth-name">Your name</label>
              <input id="auth-name" type="text" placeholder="Alice" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
          )}
          <div>
            <label className="form-label" htmlFor="auth-email">Email</label>
            <input id="auth-email" type="email" autoComplete="email" placeholder="alice@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <label className="form-label" htmlFor="auth-password">Password</label>
            <input id="auth-password" type="password" autoComplete={tab === "login" ? "current-password" : "new-password"} minLength={6} placeholder="Min. 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p className="form-success" role="status">{message}</p>}

          <button className="btn btn-primary auth-submit-btn" type="submit" disabled={loading}>
            {loading ? "Please waitâ€¦" : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>

      <p className="lobby-note">Secure account mode syncs your shared rooms across devices.</p>
    </div>
  );
}
