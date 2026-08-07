import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import {
  LuReceiptText,
  LuScanLine,
  LuUtensils,
  LuCalendarDays,
  LuMessageCircle,
} from "react-icons/lu";
import { AppProvider } from "../context/AppContext";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelect from "../components/LanguageSelect";
import BrandButton from "../components/BrandButton";

const navItems = [
  { to: "people", labelKey: "overview", desktop: true },
  { to: "expenses", labelKey: "expenses", icon: LuReceiptText, mobile: true },
  { to: "scan", labelKey: "scan_receipt", mobileKey: "scan", icon: LuScanLine, mobile: true },
  { to: "restaurant", labelKey: "restaurant_split", mobileKey: "split", icon: LuUtensils, mobile: true },
  { to: "settle", labelKey: "settle_up", desktop: true },
  { to: "plan", labelKey: "trip_logistics", mobileKey: "plan", icon: LuCalendarDays, mobile: true },
  { to: "chat", labelKey: "group_chat", mobileKey: "chat", icon: LuMessageCircle, mobile: true },
];

export default function AppLayout({ driver, currentMemberId, roomCode, sessionName, backTo = "/", guest = false, ownerMode = false }) {
  return (
    <AppProvider driver={driver} currentMemberId={currentMemberId} ownerMode={ownerMode}>
      <AppLayoutContent roomCode={roomCode} sessionName={sessionName} backTo={backTo} guest={guest} />
    </AppProvider>
  );
}

function AppLayoutContent({ roomCode, sessionName, backTo, guest }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { tripName, isSyncing, syncError } = useApp();
  const [copied, setCopied] = useState(false);
  const displayedTripName = tripName || sessionName || t("untitled_trip");

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  const copyCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
      <div className="app-shell">
        <aside className="app-sidebar">
          <BrandButton className="brand-button" onClick={() => navigate("people")} />
          <div className="trip-switcher">
            <span>{t("current_trip")}</span>
            <strong>{displayedTripName}</strong>
          </div>

          <nav className="side-nav" aria-label="Trip navigation">
            {navItems.map(({ to, labelKey }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `side-nav-link${isActive ? " active" : ""}`}>
                <span>{t(labelKey)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-status">
            <LanguageSelect />
            {isSyncing && <span className="sync-status">Saving changesâ€¦</span>}
            {syncError && <span className="sync-status sync-error" title={syncError}>Sync needs attention</span>}
            {roomCode ? (
              <>
                <span>{guest ? t("guest_room") : t("shared_room")} · {roomCode}</span>
                <button onClick={copyCode}>{copied ? t("invite_copied") : t("copy_invite")}</button>
              </>
            ) : (
              <>
                <span>{t("saved_device")}</span>
                <button onClick={() => navigate(backTo)}>{t("all_trips")}</button>
              </>
            )}
            <button className="quiet-link" onClick={() => navigate(backTo)}>{t("leave_trip")}</button>
          </div>
        </aside>

        <div className="mobile-app-header">
          <BrandButton className="mobile-brand" onClick={() => navigate("people")} />
          <button className="mobile-trip" onClick={() => navigate("people")}>{displayedTripName}</button>
          <LanguageSelect compact />
        </div>

        <main className="page-content">
          <Outlet />
        </main>

        <nav className="bottom-nav" aria-label="Primary navigation">
          {navItems.filter((item) => item.mobile).map(({ to, labelKey, mobileKey, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}>
              <Icon aria-hidden="true" />
              <span>{t(mobileKey || labelKey)}</span>
            </NavLink>
          ))}
        </nav>
      </div>
  );
}
