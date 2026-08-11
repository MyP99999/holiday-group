import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BrandButton from "../components/BrandButton";
import LanguageSelect from "../components/LanguageSelect";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const {
    user,
    recoveryMode,
    logout,
    requestPasswordReset,
    updatePassword,
    updateProfile,
    deleteAccount,
  } = useAuth();
  const recovering = recoveryMode || searchParams.get("mode") === "recovery";
  const deletionNeedsPassword = user?.usesPassword !== false;

  const [displayName, setDisplayName] = useState(user?.name || "");
  const [profileState, setProfileState] = useState({ busy: false, error: "", message: "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [passwordState, setPasswordState] = useState({ busy: false, error: "", message: "" });
  const [resetState, setResetState] = useState({ busy: false, error: "", message: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteState, setDeleteState] = useState({ busy: false, error: "" });
  const deletePasswordRef = useRef(null);

  useEffect(() => {
    setDisplayName(user?.name || "");
  }, [user?.name]);

  useEffect(() => {
    if (!deleteOpen) return undefined;
    deletePasswordRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && !deleteState.busy) setDeleteOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [deleteOpen, deleteState.busy]);

  const clearProfileFeedback = () => setProfileState((current) => ({ ...current, error: "", message: "" }));

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileState({ busy: true, error: "", message: "" });
    try {
      await updateProfile(displayName);
      setProfileState({ busy: false, error: "", message: t("profile_saved") });
    } catch (error) {
      setProfileState({ busy: false, error: error.message, message: "" });
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (passwords.next !== passwords.confirm) {
      setPasswordState({ busy: false, error: t("password_mismatch"), message: "" });
      return;
    }
    if (passwords.next.length < 8) {
      setPasswordState({ busy: false, error: t("password_minimum"), message: "" });
      return;
    }

    setPasswordState({ busy: true, error: "", message: "" });
    try {
      await updatePassword(passwords.current, passwords.next, { recovery: recovering });
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordState({ busy: false, error: "", message: t("password_updated") });
      if (recovering) navigate("/profile", { replace: true });
    } catch (error) {
      setPasswordState({ busy: false, error: error.message, message: "" });
    }
  };

  const sendResetLink = async () => {
    setResetState({ busy: true, error: "", message: "" });
    try {
      await requestPasswordReset(user?.email);
      setResetState({ busy: false, error: "", message: t("reset_link_sent") });
    } catch (error) {
      setResetState({ busy: false, error: error.message, message: "" });
    }
  };

  const signOut = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const openDeleteDialog = () => {
    setDeletePassword("");
    setDeleteState({ busy: false, error: "" });
    setDeleteOpen(true);
  };

  const confirmDelete = async (event) => {
    event.preventDefault();
    setDeleteState({ busy: true, error: "" });
    try {
      await deleteAccount(deletePassword);
      navigate("/", { replace: true });
    } catch (error) {
      setDeleteState({ busy: false, error: error.message });
    }
  };

  return (
    <div className="entry-page profile-page">
      <header className="entry-topbar profile-topbar">
        <BrandButton className="wordmark" onClick={() => navigate("/")} />
        <div className="profile-topbar-actions">
          <LanguageSelect compact />
          <button className="text-link" onClick={() => navigate("/online/lobby")}>{t("my_trips")}</button>
          <button className="text-link" onClick={signOut}>{t("sign_out")}</button>
        </div>
      </header>

      <main className="profile-layout">
        <aside className="profile-intro">
          <div className="profile-avatar" aria-hidden="true">{user?.name?.slice(0, 2).toUpperCase()}</div>
          <h1>{t("your_profile")}</h1>
          <p>{t("profile_desc")}</p>
          <dl>
            <div><dt>{t("signed_in_as")}</dt><dd>{user?.email}</dd></div>
          </dl>
        </aside>

        <div className="profile-sections">
          {recovering && (
            <section className="recovery-banner" aria-live="polite">
              <strong>{t("recovery_title")}</strong>
              <p>{t("recovery_desc")}</p>
            </section>
          )}

          <section className="profile-section">
            <div className="profile-section-heading">
              <div><h2>{t("personal_details")}</h2><p>{t("personal_details_desc")}</p></div>
            </div>
            <form className="profile-form" onSubmit={saveProfile}>
              <label htmlFor="profile-display-name">{t("display_name")}</label>
              <input
                id="profile-display-name"
                value={displayName}
                onChange={(event) => { setDisplayName(event.target.value); clearProfileFeedback(); }}
                autoComplete="name"
                maxLength={80}
                required
              />
              <label htmlFor="profile-email">{t("email_address")}</label>
              <input id="profile-email" value={user?.email || ""} readOnly disabled />
              {profileState.error && <p className="form-error" role="alert">{profileState.error}</p>}
              {profileState.message && <p className="form-success" role="status">{profileState.message}</p>}
              <div className="profile-form-actions">
                <button className="button primary" type="submit" disabled={profileState.busy || displayName.trim() === user?.name}>
                  {profileState.busy ? t("saving") : t("save_profile")}
                </button>
              </div>
            </form>
          </section>

          <section className="profile-section">
            <div className="profile-section-heading password-heading">
              <div><h2>{t("password_security")}</h2><p>{recovering ? t("recovery_desc") : t("password_security_desc")}</p></div>
              {!recovering && <button className="text-link" type="button" onClick={sendResetLink} disabled={resetState.busy}>{resetState.busy ? t("sending") : t("email_reset_link")}</button>}
            </div>
            {resetState.error && <p className="form-error" role="alert">{resetState.error}</p>}
            {resetState.message && <p className="form-success" role="status">{resetState.message}</p>}
            <form className="profile-form password-form" onSubmit={changePassword}>
              {!recovering && (
                <>
                  <label htmlFor="current-password">{t("current_password")}</label>
                  <input id="current-password" type="password" autoComplete="current-password" value={passwords.current} onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))} required />
                </>
              )}
              <div className="profile-password-grid">
                <div>
                  <label htmlFor="new-password">{t("new_password")}</label>
                  <input id="new-password" type="password" autoComplete="new-password" minLength={8} value={passwords.next} onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))} required />
                </div>
                <div>
                  <label htmlFor="confirm-password">{t("confirm_new_password")}</label>
                  <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} value={passwords.confirm} onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))} required />
                </div>
              </div>
              <span className="field-hint profile-password-hint">{t("password_minimum")}</span>
              {passwordState.error && <p className="form-error" role="alert">{passwordState.error}</p>}
              {passwordState.message && <p className="form-success" role="status">{passwordState.message}</p>}
              <div className="profile-form-actions">
                <button className="button primary" type="submit" disabled={passwordState.busy}>
                  {passwordState.busy ? t("updating") : recovering ? t("set_new_password") : t("change_password")}
                </button>
              </div>
            </form>
          </section>

          <section className="profile-section danger-section">
            <div className="profile-section-heading">
              <div><h2>{t("danger_zone")}</h2><p>{t("delete_account_desc")}</p></div>
              <button className="button danger-outline" type="button" onClick={openDeleteDialog}>{t("delete_account")}</button>
            </div>
            <p className="profile-deletion-help">Unable to delete here? Read the <button className="text-link" type="button" onClick={() => navigate("/delete-account")}>account deletion instructions</button>.</p>
          </section>
        </div>
      </main>

      {deleteOpen && (
        <div className="confirm-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !deleteState.busy) setDeleteOpen(false);
        }}>
          <div className="confirm-dialog delete-account-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
            <div className="delete-warning-mark" aria-hidden="true">!</div>
            <h2 id="delete-account-title">{t("delete_account_confirm_title")}</h2>
            <p>{t("delete_account_confirm_desc")}</p>
            <form onSubmit={confirmDelete}>
              {deletionNeedsPassword ? (
                <>
                  <label htmlFor="delete-account-password">{t("confirm_with_password")}</label>
                  <input
                    ref={deletePasswordRef}
                    id="delete-account-password"
                    type="password"
                    autoComplete="current-password"
                    value={deletePassword}
                    onChange={(event) => { setDeletePassword(event.target.value); setDeleteState((current) => ({ ...current, error: "" })); }}
                    placeholder={t("enter_password_to_delete")}
                    required
                  />
                </>
              ) : (
                <p className="oauth-delete-note">Your active Google sign-in will be used to verify this permanent deletion.</p>
              )}
              {deleteState.error && <p className="form-error" role="alert">{deleteState.error}</p>}
              <div className="confirm-actions">
                <button className="button secondary" type="button" onClick={() => setDeleteOpen(false)} disabled={deleteState.busy}>{t("cancel")}</button>
                <button className="button danger" type="submit" disabled={deleteState.busy || (deletionNeedsPassword && !deletePassword)}>
                  {deleteState.busy ? t("deleting") : t("delete_forever")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
