import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSession, deleteSession, getSessions } from "../storage/sessionsStore";
import BrandButton from "../components/BrandButton";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function OfflineSessionsPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(getSessions);
  const [tripName, setTripName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const createTrip = () => {
    if (!tripName.trim()) return;
    const session = createSession(tripName.trim());
    navigate(`/offline/${session.id}/people`);
  };

  const removeTrip = (id) => {
    if (!window.confirm("Delete this local trip and its expenses?")) return;
    deleteSession(id);
    setSessions(getSessions());
  };

  return (
    <div className="entry-page local-trips-page">
      <div className="entry-topbar"><BrandButton className="wordmark" onClick={() => navigate("/")} /><button className="text-link" onClick={() => navigate("/")}>Back home</button></div>
      <main className="trips-layout">
        <header className="trips-header">
          <div><h1>Your local trips</h1><p>Private to this device. No account, no setup.</p></div>
          <button className="button primary" onClick={() => setShowCreate(true)}>New trip</button>
        </header>

        {showCreate && (
          <section className="new-trip-panel">
            <label className="field-group"><span className="field-label">Trip name</span><input autoFocus value={tripName} onChange={(event) => setTripName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && createTrip()} placeholder="Summer in Greece" /></label>
            <button className="button primary" onClick={createTrip}>Create trip</button>
            <button className="text-link" onClick={() => { setShowCreate(false); setTripName(""); }}>Cancel</button>
          </section>
        )}

        <section className="trip-list">
          {sessions.length ? [...sessions].reverse().map((session) => (
            <article className="trip-row" key={session.id}>
              <button className="trip-row-main" onClick={() => navigate(`/offline/${session.id}/people`)}><strong>{session.name}</strong><span>Created {formatDate(session.createdAt)}</span></button>
              <button className="row-action" onClick={() => removeTrip(session.id)}>Delete</button>
            </article>
          )) : <div className="empty-copy large-empty"><h2>Your first trip starts here.</h2><p>Create one and add the people you are travelling with.</p><button className="button secondary" onClick={() => setShowCreate(true)}>Create a local trip</button></div>}
        </section>
      </main>
    </div>
  );
}
