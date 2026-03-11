import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft, LuTrash2, LuMapPin, LuPlus, LuX } from "react-icons/lu";
import { getSessions, createSession, deleteSession } from "../storage/sessionsStore";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OfflineSessionsPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(getSessions);
  const [newName, setNewName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const session = createSession(name);
    setSessions(getSessions());
    setNewName("");
    setShowForm(false);
    navigate(`/offline/${session.id}/people`);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this trip? This cannot be undone.")) return;
    deleteSession(id);
    setSessions(getSessions());
  };

  return (
    <div className="lobby-page">
      <button className="back-btn" onClick={() => navigate("/")}>
        <LuArrowLeft size={15} /> Back
      </button>

      <div className="lobby-hero">
        <div className="header-badge">Offline Mode</div>
        <h1 className="header-title">My Trips</h1>
        <p className="landing-tagline">All data saved on this device</p>
      </div>

      <div className="card">
        {showForm ? (
          <>
            <div className="section-header">
              <div className="section-icon" style={{ background: "linear-gradient(135deg, #6BCB77, #90E0A0)" }}>
                <LuMapPin size={20} color="white" />
              </div>
              <div>
                <div className="section-title">Name your trip</div>
                <div className="section-subtitle">Give it a memorable name</div>
              </div>
            </div>
            <input
              placeholder="e.g. Summer in Greece 2025"
              value={newName}
              autoFocus
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              style={{ width: "100%", marginBottom: 10 }}
            />
            <div className="input-row">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate}>
                Create Trip
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => { setShowForm(false); setNewName(""); }}
              >
                <LuX size={15} /> Cancel
              </button>
            </div>
          </>
        ) : (
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setShowForm(true)}>
            <LuPlus size={16} /> New Trip
          </button>
        )}
      </div>

      {sessions.length > 0 ? (
        <div className="card">
          <div className="session-list">
            {[...sessions].reverse().map((s) => (
              <div
                key={s.id}
                className="session-item"
                onClick={() => navigate(`/offline/${s.id}/people`)}
              >
                <div className="session-icon-wrap">
                  <LuMapPin size={18} color="var(--coral)" />
                </div>
                <div className="session-info">
                  <div className="session-name">{s.name}</div>
                  <div className="session-date">{formatDate(s.createdAt)}</div>
                </div>
                <button
                  className="btn btn-danger"
                  title="Delete"
                  onClick={(e) => handleDelete(s.id, e)}
                >
                  <LuTrash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !showForm && (
          <div className="empty-state">
            <div className="empty-icon">
              <LuMapPin size={40} color="#ddd" />
            </div>
            <div>No trips yet — create your first one!</div>
          </div>
        )
      )}
    </div>
  );
}
