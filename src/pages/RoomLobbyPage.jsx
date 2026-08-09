import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PersonAvatar from "../components/PersonAvatar";
import BrandButton from "../components/BrandButton";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  claimOnlineRoomMember,
  createOnlineRoom,
  joinOnlineRoom,
  listOnlineRooms,
  previewOnlineRoom,
} from "../storage/supabaseDriver";
import { normalizeRoomCode } from "../utils/roomAccess";
import { isMemberClaimed, isRoomPersonSelectable } from "../utils/memberClaims";

export default function RoomLobbyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const requestedRoomCode = normalizeRoomCode(searchParams.get("room"));
  const autoOpenedRoom = useRef("");
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [tripName, setTripName] = useState("");
  const [joinCode, setJoinCode] = useState(requestedRoomCode);
  const [joinName, setJoinName] = useState(user?.name || "");
  const [roomPreview, setRoomPreview] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    let active = true;
    listOnlineRooms()
      .then((data) => { if (active) setRooms(data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setRoomsLoading(false); });
    return () => { active = false; };
  }, []);

  const availablePeople = roomPreview?.availablePeople || [];
  const selectedPerson = availablePeople.find((person) => String(person.id) === String(selectedPersonId) && isRoomPersonSelectable(person));

  const createRoom = async () => {
    setError("");
    setBusy("create");
    try {
      const room = await createOnlineRoom(tripName.trim() || "New shared trip", user?.name || "Trip owner");
      navigate(`/online/room/${room.code}/people`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const findRoom = useCallback(async (requestedCode) => {
    const code = normalizeRoomCode(typeof requestedCode === "string" ? requestedCode : joinCode);
    if (code.length !== 6) {
      setError("Enter the full 6-character room code.");
      return;
    }
    setError("");
    setBusy("find");
    try {
      const preview = await previewOnlineRoom(code);
      if (!preview) throw new Error("Room not found. Check the code and try again.");
      setRoomPreview({ ...preview, code });
      const matchingPerson = (preview.availablePeople || []).find(
        (person) => isRoomPersonSelectable(person) && person.name.toLowerCase() === (user?.name || "").toLowerCase()
      );
      setSelectedPersonId(matchingPerson?.id || "");
    } catch (err) {
      setRoomPreview(null);
      setError(err.message);
    } finally {
      setBusy("");
    }
  }, [joinCode, user?.name]);

  useEffect(() => {
    if (requestedRoomCode.length !== 6 || autoOpenedRoom.current === requestedRoomCode) return;
    autoOpenedRoom.current = requestedRoomCode;
    findRoom(requestedRoomCode);
  }, [findRoom, requestedRoomCode]);

  const claimPerson = async () => {
    if (!selectedPerson || !isRoomPersonSelectable(selectedPerson)) return;
    setError("");
    setBusy("claim");
    try {
      await claimOnlineRoomMember(roomPreview.code, selectedPerson.id);
      navigate(`/online/room/${roomPreview.code}/people`);
    } catch (err) {
      setError(err.message);
      await findRoom();
    } finally {
      setBusy("");
    }
  };

  const joinAsAccount = async () => {
    if (!roomPreview) {
      await findRoom();
      return;
    }
    if (!joinName.trim()) {
      setError("Add the name you want the group to see.");
      return;
    }
    setError("");
    setBusy("join");
    try {
      await joinOnlineRoom(roomPreview.code, joinName.trim());
      navigate(`/online/room/${roomPreview.code}/people`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  const signOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="entry-page">
      <div className="entry-topbar">
        <BrandButton className="wordmark" onClick={() => navigate("/")} />
        <div className="signed-in-as">
          <button className="lobby-profile-link" onClick={() => navigate("/profile")}>
            <span aria-hidden="true">{user?.name?.slice(0, 2).toUpperCase()}</span>
            <b>{user?.name}</b>
          </button>
          <button className="text-link" onClick={signOut}>Sign out</button>
        </div>
      </div>

      <main className="lobby-layout account-lobby-layout">
        <section className="lobby-intro">
          <h1>Your shared rooms.</h1>
          <p>Create a trip or reopen one from any device. Changes are protected by trip membership and sync live with the rest of your group.</p>
          <div className="privacy-note"><strong>Connected securely</strong><span>Your account identifies you in every trip. Each room still has its own members and admins.</span></div>

          <div className="online-room-list">
            <div className="online-room-list-heading"><h2>Your trips</h2><span>{rooms.length}</span></div>
            {roomsLoading ? (
              <p className="online-room-empty">Loading your tripsâ€¦</p>
            ) : rooms.length ? rooms.map((room) => (
              <button className="online-room-card" key={room.tripId} onClick={() => navigate(`/online/room/${room.code}/people`)}>
                <span><strong>{room.name}</strong><small>{room.role === "admin" ? "Admin" : "Member"}</small></span>
                <code>{room.code}</code>
              </button>
            )) : (
              <p className="online-room-empty">No online trips yet. Create your first one here.</p>
            )}
          </div>
        </section>

        <section className="lobby-panel">
          {!roomPreview && (
            <>
              <div className="lobby-block">
                <h2>Create a room</h2>
                <label className="field-label" htmlFor="account-trip-name">Trip name</label>
                <input id="account-trip-name" value={tripName} onChange={(event) => setTripName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && createRoom()} placeholder="Lake Como weekend" />
                <button className="button primary wide" onClick={createRoom} disabled={Boolean(busy)}>{busy === "create" ? "Creatingâ€¦" : "Create room"}</button>
              </div>
              <div className="lobby-divider"><span>or join one</span></div>
            </>
          )}

          <div className="lobby-block">
            {roomPreview && <h2>Join this room</h2>}
            <label className="field-label" htmlFor="account-room-code">Room code</label>
            <div className="inline-control">
              <input id="account-room-code" className="code-input" maxLength={6} value={joinCode} onChange={(event) => { setJoinCode(event.target.value.toUpperCase()); setRoomPreview(null); setSelectedPersonId(""); setError(""); }} onKeyDown={(event) => event.key === "Enter" && findRoom()} placeholder="K7M4Q2" />
              <button className="button secondary" onClick={findRoom} disabled={Boolean(busy)}>{busy === "find" ? "Findingâ€¦" : "Find"}</button>
            </div>

            {roomPreview && (
              <div className="join-room-preview">
                <div className="room-found-banner"><span>Room found</span><strong>{roomPreview.tripName}</strong></div>

                {availablePeople.length > 0 && (
                  <>
                    <div className="join-choice-heading"><h3>Are you already listed?</h3><p>Choose your existing person so expenses and balances stay connected to you.</p></div>
                    <div className="claim-person-grid" role="radiogroup" aria-label="People available to claim">
                      {availablePeople.map((person, index) => {
                        const claimed = isMemberClaimed(person);
                        const selected = String(selectedPersonId) === String(person.id);
                        return (
                          <button type="button" role="radio" aria-checked={selected && !claimed} aria-disabled={claimed} className={`claim-person-option${selected && !claimed ? " selected" : ""}${claimed ? " is-taken" : ""}`} key={person.id} onClick={() => { if (claimed) return; setSelectedPersonId(person.id); setError(""); }}>
                            <PersonAvatar person={person} people={availablePeople} index={index} inControl />
                            <span><strong>{person.name}</strong><small>{claimed ? `${person.role === "admin" ? "Admin" : "Member"} · ${t("taken")}` : `${person.role === "admin" ? "Admin" : "Member"} · ${t("available")}`}</small></span>
                          </button>
                        );
                      })}
                    </div>
                    <button className="button primary wide claim-person-button" onClick={claimPerson} disabled={!selectedPerson || Boolean(busy)}>
                      {busy === "claim" ? "Joiningâ€¦" : selectedPerson ? `Continue as ${selectedPerson.name}` : "Choose your name"}
                    </button>
                    <div className="join-choice-divider"><span>or join as a new person</span></div>
                  </>
                )}

                <label className="field-label" htmlFor="account-join-name">Name shown in this trip</label>
                <input id="account-join-name" value={joinName} onChange={(event) => { setJoinName(event.target.value); setError(""); }} onKeyDown={(event) => event.key === "Enter" && joinAsAccount()} placeholder="Sofia" />
                <button className="button secondary wide join-new-button" onClick={joinAsAccount} disabled={Boolean(busy)}>{busy === "join" ? "Joiningâ€¦" : "Join as a new person"}</button>
              </div>
            )}
            {error && <p className="form-error" role="alert">{error}</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
