import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LuUsers,
  LuCreditCard,
  LuScale,
  LuMap,
  LuArrowLeft,
  LuCopy,
  LuCheck,
  LuLogOut,
  LuSmartphone,
} from "react-icons/lu";
import { AppProvider } from "../context/AppContext";

export default function AppLayout({ driver, roomCode, sessionName, backTo = "/" }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AppProvider driver={driver}>
      <div className="app-shell">

        <header className="top-header">
          <button className="back-btn" onClick={() => navigate(backTo)}>
            <LuArrowLeft size={16} />
            Back
          </button>
          <div className="header-center">
            <div className="header-badge">Plan Together</div>
            <h1 className="header-title">Holiday Group</h1>
          </div>
        </header>

        {roomCode && (
          <div className="app-banner app-banner-room">
            <span className="banner-label">Room code</span>
            <span className="room-code">{roomCode}</span>
            <button className="banner-action-btn" onClick={copyCode}>
              {copied ? <LuCheck size={13} /> : <LuCopy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button className="banner-action-btn" onClick={() => navigate(backTo)}>
              <LuLogOut size={13} />
              Leave
            </button>
          </div>
        )}

        {sessionName && (
          <div className="app-banner app-banner-session">
            <LuSmartphone size={14} />
            <span className="banner-label">Offline</span>
            <span className="session-banner-name">{sessionName}</span>
          </div>
        )}

        <main className="page-content">
          <Outlet />
        </main>

        <nav className="bottom-nav">
          <NavLink to="people" className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}>
            <LuUsers size={22} />
            <span className="nav-label">People</span>
          </NavLink>
          <NavLink to="expenses" className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}>
            <LuCreditCard size={22} />
            <span className="nav-label">Expenses</span>
          </NavLink>
          <NavLink to="settle" className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}>
            <LuScale size={22} />
            <span className="nav-label">Settle Up</span>
          </NavLink>
          <NavLink to="plan" className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}>
            <LuMap size={22} />
            <span className="nav-label">Plan</span>
          </NavLink>
        </nav>

      </div>
    </AppProvider>
  );
}
