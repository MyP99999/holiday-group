import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuDoorOpen, LuArrowLeft, LuLogOut, LuUser } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import { createRoom, generateRoomCode, localStorageDriver } from "../storage/localStorageDriver";

export default function RoomLobbyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    const code = generateRoomCode();
    createRoom(code);
    navigate(`/online/room/${code}/people`);
  };

  const handleJoin = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) return;
    if (!localStorageDriver(code).exists()) {
      setError("Room not found. Check the code and try again.");
      return;
    }
    navigate(`/online/room/${code}/people`);
  };

  return (
    <div className="lobby-page">
      <div className="lobby-topbar">
        <button className="back-btn" onClick={() => navigate("/")}>
          <LuArrowLeft size={15} /> Home
        </button>
        <div className="lobby-user">
          <LuUser size={14} />
          <span className="lobby-user-name">{user?.name}</span>
          <button className="lobby-logout-btn" onClick={() => { logout(); navigate("/"); }}>
            <LuLogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      <div className="lobby-hero">
        <div className="header-badge">Online Mode</div>
        <h1 className="header-title">Your Rooms</h1>
        <p className="landing-tagline">Create a room or join one with a code</p>
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-icon" style={{ background: "linear-gradient(135deg, #FF6B6B, #FFA07A)" }}>
            <LuSparkles size={20} color="white" />
          </div>
          <div>
            <div className="section-title">Create a new room</div>
            <div className="section-subtitle">
              A unique code will be generated — share it with your friends
            </div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleCreate}>
          Create Room
        </button>
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-icon" style={{ background: "linear-gradient(135deg, #4D96FF, #80B4FF)" }}>
            <LuDoorOpen size={20} color="white" />
          </div>
          <div>
            <div className="section-title">Join an existing room</div>
            <div className="section-subtitle">Enter the code your friend shared with you</div>
          </div>
        </div>
        <div className="input-row">
          <input
            placeholder="XXXXXX"
            value={joinCode}
            maxLength={6}
            onChange={(e) => { setJoinCode(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            className="room-code-input"
          />
          <button className="btn btn-primary" onClick={handleJoin}>Join</button>
        </div>
        {error && <p className="lobby-error">{error}</p>}
      </div>

      <p className="lobby-note">
        Room data is stored in your browser for now. Cross-device sync with Supabase coming soon.
      </p>
    </div>
  );
}
