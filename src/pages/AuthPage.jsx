import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, login, register, loginWithGoogle } = useAuth();

  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleMsg, setGoogleMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/online/lobby" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/online/lobby");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleMsg("");
    try {
      await loginWithGoogle();
    } catch (err) {
      setGoogleMsg(err.message);
    }
  };

  return (
    <div className="auth-page">
      <button className="back-btn auth-back-btn" onClick={() => navigate("/")}>
        <LuArrowLeft size={16} /> Back
      </button>

      <div className="auth-hero">
        <div className="header-badge">Online Mode</div>
        <h1 className="header-title">Holiday Group</h1>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === "login" ? " active" : ""}`}
            onClick={() => { setTab("login"); setError(""); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab${tab === "register" ? " active" : ""}`}
            onClick={() => { setTab("register"); setError(""); }}
          >
            Register
          </button>
        </div>

        <button className="google-btn" onClick={handleGoogle}>
          <FaGoogle size={16} color="#4285F4" />
          Continue with Google
        </button>
        {googleMsg && <p className="auth-google-msg">{googleMsg}</p>}

        <div className="auth-divider">or</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {tab === "register" && (
            <div>
              <label className="form-label">Your name</label>
              <input
                type="text"
                placeholder="Alice"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%" }}
                required
              />
            </div>
          )}
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="alice@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn btn-primary auth-submit-btn" type="submit" disabled={loading}>
            {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>

      <p className="lobby-note">
        Authentication is mocked locally for now. Supabase backend coming soon.
      </p>
    </div>
  );
}
