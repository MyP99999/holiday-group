import { useNavigate } from "react-router-dom";
import { LuPlaneTakeoff, LuSmartphone, LuGlobe, LuArrowRight } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="landing-logo-icon">
          <LuPlaneTakeoff size={44} color="var(--coral)" />
        </div>
        <h1 className="header-title">Holiday Group</h1>
        <p className="landing-tagline">Split costs, track expenses, settle up — together</p>
      </div>

      <div className="mode-cards">
        <button className="mode-card mode-card-offline" onClick={() => navigate("/offline")}>
          <div className="mode-card-icon">
            <LuSmartphone size={32} color="var(--coral)" />
          </div>
          <div className="mode-card-title">Offline</div>
          <div className="mode-card-desc">
            No account needed. All data saved on this device. Manage multiple trips.
          </div>
          <div className="mode-card-cta">
            Open on this device <LuArrowRight size={13} />
          </div>
        </button>

        <button
          className="mode-card mode-card-online"
          onClick={() => navigate(user ? "/online/lobby" : "/online")}
        >
          <div className="mode-card-icon">
            <LuGlobe size={32} color="var(--sky)" />
          </div>
          <div className="mode-card-title">Online</div>
          <div className="mode-card-desc">
            Sign in and share a room with friends. Everyone can edit in real time.
          </div>
          <div className="mode-card-cta">
            {user ? `Continue as ${user.name}` : "Sign in / Register"}{" "}
            <LuArrowRight size={13} />
          </div>
        </button>
      </div>
    </div>
  );
}
