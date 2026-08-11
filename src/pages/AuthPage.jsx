import { useState } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { normalizeRoomCode, sharedRoomLobbyPath } from "../utils/roomAccess";
import { googleAuthEnabled } from "../lib/supabase";
import { NATIVE_AUTH_ERROR_KEY } from "../lib/nativeApp";
import BrandButton from "../components/BrandButton";
import LanguageSelect from "../components/LanguageSelect";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { user, loading: authLoading, login, register, loginWithGoogle, requestPasswordReset } = useAuth();
  const roomCode = normalizeRoomCode(searchParams.get("room"));
  const destination = sharedRoomLobbyPath(roomCode);
  const authRedirectUrl = `${window.location.origin}${destination}`;

  const [tab, setTab] = useState(searchParams.get("mode") === "register" ? "register" : "login");
  const [recovery, setRecovery] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(() => {
    const nativeError = sessionStorage.getItem(NATIVE_AUTH_ERROR_KEY) || "";
    sessionStorage.removeItem(NATIVE_AUTH_ERROR_KEY);
    return nativeError;
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) return <div className="app-loading"><span />{t("checking_session")}</div>;
  if (user) return <Navigate to={destination} replace />;

  const resetFeedback = () => {
    setError("");
    setMessage("");
  };

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setRecovery(false);
    resetFeedback();
  };

  const showRecovery = () => {
    setRecovery(true);
    resetFeedback();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetFeedback();
    setLoading(true);
    try {
      if (recovery) {
        await requestPasswordReset(email);
        setMessage(t("reset_link_sent_generic"));
      } else if (tab === "login") {
        await login(email, password);
        navigate(destination);
      } else {
        const result = await register(name, email, password, {
          redirectTo: authRedirectUrl,
          returnPath: destination,
        });
        if (result.needsEmailConfirmation) {
          setMessage(t("confirm_email_message"));
          setTab("login");
        } else {
          navigate(destination);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    resetFeedback();
    try {
      await loginWithGoogle({ redirectTo: authRedirectUrl, returnPath: destination });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-utilities">
        <button className="back-btn auth-back-btn" onClick={() => navigate("/")}>
          <LuArrowLeft size={16} /> {t("back_home")}
        </button>
        <LanguageSelect compact />
      </div>

      <div className="auth-hero">
        <div className="header-badge">{t("online_mode")}</div>
        <BrandButton className="auth-brand" onClick={() => navigate("/")} />
      </div>

      <div className="auth-card">
        {roomCode && (
          <div className="auth-room-gate" role="status">
            <strong>{t("account_required_for_room")}</strong>
            <span>{t("room_ready_after_sign_in", { code: roomCode })}</span>
            <label className="auth-room-code-preview">
              <span>{t("room_code")}</span>
              <input value={roomCode} readOnly aria-label={t("room_code")} />
            </label>
          </div>
        )}
        {recovery ? (
          <div className="auth-recovery-heading">
            <h1>{t("forgot_password")}</h1>
            <p>{t("forgot_password_desc")}</p>
          </div>
        ) : (
          <div className="auth-tabs">
            <button className={`auth-tab${tab === "login" ? " active" : ""}`} onClick={() => changeTab("login")}>
              {t("sign_in")}
            </button>
            <button className={`auth-tab${tab === "register" ? " active" : ""}`} onClick={() => changeTab("register")}>
              {t("register")}
            </button>
          </div>
        )}

        {!recovery && googleAuthEnabled && (
          <>
            <button className="google-btn" onClick={handleGoogle} disabled={loading}>
              <FaGoogle size={16} color="#4285F4" />
              {t("continue_google")}
            </button>
            <div className="auth-divider">{t("or")}</div>
          </>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!recovery && tab === "register" && (
            <div>
              <label className="form-label" htmlFor="auth-name">{t("your_name")}</label>
              <input id="auth-name" type="text" placeholder="Alice" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
          )}
          <div>
            <label className="form-label" htmlFor="auth-email">{t("email_address")}</label>
            <input id="auth-email" type="email" autoComplete="email" placeholder="alice@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          {!recovery && (
            <div>
              <div className="auth-password-label">
                <label className="form-label" htmlFor="auth-password">{t("password")}</label>
                {tab === "login" && <button type="button" className="text-link" onClick={showRecovery}>{t("forgot_password")}</button>}
              </div>
              <input id="auth-password" type="password" autoComplete={tab === "login" ? "current-password" : "new-password"} minLength={6} placeholder={t("password_placeholder")} value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
          )}

          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p className="form-success" role="status">{message}</p>}

          <button className="btn btn-primary auth-submit-btn" type="submit" disabled={loading}>
            {loading ? t("please_wait") : recovery ? t("send_reset_link") : tab === "login" ? t("sign_in") : t("create_account")}
          </button>
          {recovery && <button className="text-link auth-return-link" type="button" onClick={() => { setRecovery(false); resetFeedback(); }}>{t("back_to_sign_in")}</button>}
        </form>
      </div>

      <p className="lobby-note">{t("account_sync_note")}</p>
    </div>
  );
}
