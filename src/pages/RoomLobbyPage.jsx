import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createRoom, generateRoomCode, joinRoom, localStorageDriver } from "../storage/localStorageDriver";

export default function RoomLobbyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tripName, setTripName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  const createSharedRoom = () => {
    const code = generateRoomCode();
    createRoom(code, tripName.trim() || "New shared trip", user?.name || "Trip owner");
    navigate(`/online/room/${code}/people`);
  };

  const joinRoom = () => {
    const code = joinCode.trim().toUpperCase();
    if (!localStorageDriver(code).exists()) { setError("Room not found in this prototype browser."); return; }
    joinRoom(code, user?.name || "Member");
    navigate(`/online/room/${code}/people`);
  };

  return (
    <div className="entry-page">
      <div className="entry-topbar"><button className="wordmark" onClick={() => navigate("/")}>Holiday Group</button><div className="signed-in-as"><span>{user?.name}</span><button className="text-link" onClick={() => { logout(); navigate("/"); }}>Sign out</button></div></div>
      <main className="lobby-layout">
        <section className="lobby-intro"><h1>Your shared rooms.</h1><p>Create a room now. Supabase will later replace the local driver with realtime sync while keeping this exact room workflow.</p><div className="privacy-note"><strong>Prototype account</strong><span>Authentication and rooms are currently mocked in this browser.</span></div></section>
        <section className="lobby-panel">
          <div className="lobby-block"><h2>Create a room</h2><label className="field-label" htmlFor="account-trip-name">Trip name</label><input id="account-trip-name" value={tripName} onChange={(event) => setTripName(event.target.value)} placeholder="Lake Como weekend" /><button className="button primary wide" onClick={createSharedRoom}>Create room</button></div>
          <div className="lobby-divider"><span>or join one</span></div>
          <div className="lobby-block"><label className="field-label" htmlFor="account-room-code">Room code</label><div className="inline-control"><input id="account-room-code" className="code-input" maxLength={6} value={joinCode} onChange={(event) => { setJoinCode(event.target.value.toUpperCase()); setError(""); }} placeholder="K7M4Q2" /><button className="button secondary" onClick={joinRoom}>Join</button></div>{error && <p className="form-error">{error}</p>}</div>
        </section>
      </main>
    </div>
  );
}
