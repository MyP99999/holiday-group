import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { claimRoomPerson, createRoom, generateRoomCode, joinRoom, localStorageDriver } from "../storage/localStorageDriver";
import LanguageSelect from "../components/LanguageSelect";
import PersonAvatar from "../components/PersonAvatar";
import { useLanguage } from "../context/LanguageContext";

export default function GuestLobbyPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tripName, setTripName] = useState("");
  const [creatorNickname, setCreatorNickname] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [roomPreview, setRoomPreview] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [createError, setCreateError] = useState("");
  const [joinError, setJoinError] = useState("");

  const availablePeople = roomPreview?.people?.filter((person) => !person.claimedAt) || [];
  const selectedPerson = availablePeople.find((person) => String(person.id) === String(selectedPersonId));

  const createGuestRoom = () => {
    if (!creatorNickname.trim()) { setCreateError(t("nickname_required")); return; }
    const code = generateRoomCode();
    createRoom(code, tripName.trim() || "New group trip", creatorNickname);
    navigate(`/guest/room/${code}/people`);
  };

  const findGuestRoom = () => {
    const code = joinCode.trim().toUpperCase();
    const driver = localStorageDriver(code);
    if (!code || !driver.exists()) {
      setRoomPreview(null);
      setJoinError(t("room_not_found"));
      return;
    }
    const room = driver.read();
    if (!room) {
      setRoomPreview(null);
      setJoinError(t("room_not_found"));
      return;
    }
    setRoomPreview({ ...room, code });
    setSelectedPersonId("");
    setJoinError("");
  };

  const claimExistingPerson = () => {
    if (!roomPreview || !selectedPersonId) {
      setJoinError(t("choose_existing_person"));
      return;
    }
    const person = claimRoomPerson(roomPreview.code, selectedPersonId);
    if (!person) {
      setRoomPreview({ ...localStorageDriver(roomPreview.code).read(), code: roomPreview.code });
      setSelectedPersonId("");
      setJoinError(t("person_already_claimed"));
      return;
    }
    navigate(`/guest/room/${roomPreview.code}/people`);
  };

  const joinAsNewPerson = () => {
    if (!roomPreview) { findGuestRoom(); return; }
    if (!newNickname.trim()) { setJoinError(t("nickname_required")); return; }
    const person = joinRoom(roomPreview.code, newNickname);
    if (!person) {
      setRoomPreview({ ...localStorageDriver(roomPreview.code).read(), code: roomPreview.code });
      setJoinError(t("person_already_claimed"));
      return;
    }
    navigate(`/guest/room/${roomPreview.code}/people`);
  };

  return (
    <div className="entry-page">
      <div className="entry-topbar">
        <button className="wordmark" onClick={() => navigate("/")}>Holiday Group</button>
        <div className="entry-actions"><LanguageSelect /><button className="text-link" onClick={() => navigate("/")}>{t("back_home")}</button></div>
      </div>
      <main className="lobby-layout">
        <section className="lobby-intro">
          <h1>{t("share_room_title")}</h1>
          <p>{t("guest_intro")}</p>
          <div className="privacy-note"><strong>{t("no_signup")}</strong><span>{t("guest_storage")}</span></div>
        </section>
        <section className="lobby-panel">
          {!roomPreview && (
            <>
              <div className="lobby-block">
                <h2>{t("create_guest_room")}</h2>
                <label className="field-label" htmlFor="guest-nickname">{t("nickname")}</label>
                <input id="guest-nickname" value={creatorNickname} onChange={(e) => { setCreatorNickname(e.target.value); setCreateError(""); }} placeholder="Maya" />
                <span className="field-hint">{t("nickname_hint")}</span>
                <label className="field-label lobby-next-label" htmlFor="guest-trip-name">{t("trip_name")}</label>
                <input id="guest-trip-name" value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="Lake Como weekend" />
                <button className="button primary wide" onClick={createGuestRoom}>{t("create_room")}</button>
                {createError && <p className="form-error">{createError}</p>}
              </div>
              <div className="lobby-divider"><span>{t("or_join")}</span></div>
            </>
          )}
          <div className="lobby-block">
            {roomPreview && <h2>{t("join_guest_room")}</h2>}
            <label className="field-label" htmlFor="guest-room-code">{t("room_code")}</label>
            <div className="inline-control">
              <input id="guest-room-code" className="code-input" value={joinCode} maxLength={6} onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setRoomPreview(null); setSelectedPersonId(""); setJoinError(""); }} onKeyDown={(event) => event.key === "Enter" && findGuestRoom()} placeholder="K7M4Q2" />
              <button className="button secondary" onClick={findGuestRoom}>{t("find_room")}</button>
            </div>

            {roomPreview && (
              <div className="join-room-preview">
                <div className="room-found-banner"><span>{t("room_found")}</span><strong>{roomPreview.tripName}</strong></div>

                {availablePeople.length > 0 ? (
                  <>
                    <div className="join-choice-heading"><h3>{t("already_listed")}</h3><p>{t("claim_existing_help")}</p></div>
                    <div className="claim-person-grid" role="radiogroup" aria-label={t("already_listed")}>
                      {availablePeople.map((person, index) => {
                        const selected = String(selectedPersonId) === String(person.id);
                        return (
                          <button type="button" role="radio" aria-checked={selected} className={`claim-person-option${selected ? " selected" : ""}`} key={person.id} onClick={() => { setSelectedPersonId(person.id); setJoinError(""); }}>
                            <PersonAvatar person={person} people={roomPreview.people} index={index} inControl />
                            <span><strong>{person.name}</strong><small>{person.role === "admin" ? t("admin") : t("member")}</small></span>
                          </button>
                        );
                      })}
                    </div>
                    <button className="button primary wide claim-person-button" onClick={claimExistingPerson} disabled={!selectedPerson}>{selectedPerson ? t("join_as", { name: selectedPerson.name }) : t("choose_your_name")}</button>
                    <div className="join-choice-divider"><span>{t("or_new_nickname")}</span></div>
                  </>
                ) : (
                  <p className="no-claim-options">{t("no_names_available")}</p>
                )}

                <label className="field-label" htmlFor="new-guest-nickname">{t("new_nickname")}</label>
                <input id="new-guest-nickname" value={newNickname} onChange={(event) => { setNewNickname(event.target.value); setJoinError(""); }} onKeyDown={(event) => event.key === "Enter" && joinAsNewPerson()} placeholder="Sofia" />
                <span className="field-hint">{t("new_nickname_hint")}</span>
                <button className="button secondary wide join-new-button" onClick={joinAsNewPerson}>{t("join_as_new")}</button>
              </div>
            )}
            {joinError && <p className="form-error">{joinError}</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
