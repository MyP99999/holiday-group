import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  LuHandCoins,
  LuLayoutDashboard,
  LuReceiptText,
  LuCalendarDays,
  LuMessageCircle,
  LuHouse,
  LuVote,
} from "react-icons/lu";
import { AppProvider } from "../context/AppContext";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSelect from "../components/LanguageSelect";
import BrandButton from "../components/BrandButton";
import { unreadBadge, unreadMessages } from "../utils/chatNotifications";
import { sharedRoomInviteUrl } from "../utils/roomAccess";
import { publicWebOrigin } from "../lib/nativeApp";

const navItems = [
  { to: "people", labelKey: "overview", icon: LuLayoutDashboard, mobile: true, mobileOrder: 5 },
  { to: "expenses", labelKey: "expenses", icon: LuReceiptText, mobile: true, mobileOrder: 1 },
  { to: "settle", labelKey: "settle_up", mobileKey: "settle", icon: LuHandCoins, mobile: true, mobileOrder: 2 },
  { to: "plan", labelKey: "trip_logistics", mobileKey: "plan", icon: LuCalendarDays, mobile: true, mobileOrder: 3 },
  { to: "decisions", labelKey: "group_decisions", mobileKey: "decisions", icon: LuVote, mobile: true, mobileOrder: 4 },
  { to: "chat", labelKey: "group_chat", mobileKey: "chat", icon: LuMessageCircle },
];

export default function AppLayout({ driver, currentMemberId, roomCode, sessionName, notificationKey, backTo = "/", ownerMode = false }) {
  return (
    <AppProvider driver={driver} currentMemberId={currentMemberId} ownerMode={ownerMode}>
      <AppLayoutContent roomCode={roomCode} sessionName={sessionName} notificationKey={notificationKey} backTo={backTo} />
    </AppProvider>
  );
}

function AppLayoutContent({ roomCode, sessionName, notificationKey, backTo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { tripName, chatMessages, currentMemberId, isSyncing, syncError } = useApp();
  const [copied, setCopied] = useState(false);
  const displayedTripName = tripName || sessionName || t("untitled_trip");
  const chatReadKey = `hg:chat-read:${notificationKey || roomCode || displayedTripName}:${currentMemberId || "device"}`;
  const [lastReadMessageId, setLastReadMessageId] = useState(() => localStorage.getItem(chatReadKey) || "");
  const isChatPage = location.pathname.endsWith("/chat");
  const unreadCount = isChatPage ? 0 : unreadMessages(chatMessages, lastReadMessageId, currentMemberId).length;
  const unreadLabel = unreadBadge(unreadCount);

  useEffect(() => {
    setLastReadMessageId(localStorage.getItem(chatReadKey) || "");
  }, [chatReadKey]);

  useEffect(() => {
    if (!isChatPage) return;
    const latestMessageId = chatMessages[chatMessages.length - 1]?.id;
    if (!latestMessageId || String(latestMessageId) === String(lastReadMessageId)) return;
    localStorage.setItem(chatReadKey, String(latestMessageId));
    setLastReadMessageId(String(latestMessageId));
  }, [chatMessages, chatReadKey, isChatPage, lastReadMessageId]);

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
      await navigator.clipboard.writeText(sharedRoomInviteUrl(publicWebOrigin(), roomCode));
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
                {to === "chat" && unreadCount > 0 && <span className="side-nav-chat-badge" aria-label={t("unread_messages", { count: unreadLabel })}>{unreadLabel}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-status">
            <LanguageSelect />
            {isSyncing && <span className="sync-status">Saving changesâ€¦</span>}
            {syncError && <span className="sync-status sync-error" title={syncError}>Sync needs attention</span>}
            {roomCode ? (
              <>
                <span>{t("shared_room")} · {roomCode}</span>
                <button onClick={copyCode}>{copied ? t("invite_copied") : t("copy_invite")}</button>
              </>
            ) : (
              <>
                <span>{t("saved_device")}</span>
                <button onClick={() => navigate(backTo)}>{t("all_trips")}</button>
              </>
            )}
            <button className="quiet-link" onClick={() => navigate("/")}>{t("go_to_landing_page")}</button>
          </div>
        </aside>

        <div className="mobile-app-header">
          <BrandButton className="mobile-brand" onClick={() => navigate("people")} />
          <button className="mobile-trip" onClick={() => navigate("people")}>{displayedTripName}</button>
          <div className="mobile-header-actions">
            <button className="mobile-home-button" onClick={() => navigate("/")} aria-label={t("go_to_landing_page")} title={t("go_to_landing_page")}><LuHouse aria-hidden="true" /></button>
            {roomCode && <button className="mobile-invite-button" onClick={copyCode}>{copied ? t("copied") : t("invite_friend")}</button>}
            <LanguageSelect compact />
          </div>
        </div>

        <main className="page-content">
          <Outlet />
        </main>

        <nav className="bottom-nav" aria-label="Primary navigation">
          {navItems.filter((item) => item.mobile).sort((a, b) => a.mobileOrder - b.mobileOrder).map(({ to, labelKey, mobileKey, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}>
              <Icon aria-hidden="true" />
              <span>{t(mobileKey || labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="chat"
          className={`floating-chat-button${isChatPage ? " is-current" : ""}${unreadCount ? " has-unread" : ""}`}
          aria-label={unreadCount ? t("open_chat_unread", { count: unreadLabel }) : t("open_group_chat")}
          aria-current={isChatPage ? "page" : undefined}
        >
          <LuMessageCircle aria-hidden="true" />
          {unreadCount > 0 && <span className="floating-chat-badge" aria-hidden="true">{unreadLabel}</span>}
        </NavLink>
      </div>
  );
}
