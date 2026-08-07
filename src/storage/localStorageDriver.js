import { createDefaultTripState, createId, nextPersonColor, normalizeTripState } from "./tripState";

const PREFIX = "hg:room:";
const IDENTITY_PREFIX = "hg:identity:";

export function localStorageDriver(roomId) {
  const key = `${PREFIX}${roomId}`;

  return {
    read() {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const state = normalizeTripState(JSON.parse(raw));
        const currentIdentity = getRoomIdentity(roomId);
        if (!currentIdentity) return state;
        return {
          ...state,
          people: state.people.map((person) => String(person.id) === String(currentIdentity) && !person.claimedAt
            ? { ...person, claimedAt: person.joinedAt || "legacy-claim" }
            : person),
        };
      } catch {
        return null;
      }
    },

    write(state) {
      localStorage.setItem(key, JSON.stringify(state));
    },

    // Fires when another tab writes to the same room
    subscribe(cb) {
      const handler = (e) => {
        if (e.key === key && e.newValue) {
          try { cb(JSON.parse(e.newValue)); } catch {}
        }
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },

    exists() {
      return localStorage.getItem(key) !== null;
    },
  };
}

export function createRoom(roomId, tripName, creatorName = "") {
  const key = `${PREFIX}${roomId}`;
  const state = createDefaultTripState(tripName, creatorName);
  localStorage.setItem(key, JSON.stringify(state));
  if (state.people[0]) setRoomIdentity(roomId, state.people[0].id);
  return state.people[0] || null;
}

export function joinRoom(roomId, nickname) {
  const driver = localStorageDriver(roomId);
  const state = driver.read();
  if (!state) return null;
  const trimmed = nickname.trim();
  if (!trimmed) return null;

  const existing = state.people.find((person) => person.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing.claimedAt ? null : claimRoomPerson(roomId, existing.id);

  const claimedAt = new Date().toISOString();
  const person = {
    id: createId("person"),
    name: trimmed,
    role: state.people.length ? "member" : "admin",
    color: nextPersonColor(state.people, trimmed),
    joinedAt: claimedAt,
    claimedAt,
  };
  driver.write({ ...state, people: [...state.people, person] });
  setRoomIdentity(roomId, person.id);
  return person;
}

export function claimRoomPerson(roomId, personId) {
  const driver = localStorageDriver(roomId);
  const state = driver.read();
  if (!state) return null;
  const target = state.people.find((person) => String(person.id) === String(personId));
  if (!target || target.claimedAt) return null;

  const claimedAt = new Date().toISOString();
  const person = { ...target, joinedAt: target.joinedAt || claimedAt, claimedAt };
  driver.write({
    ...state,
    people: state.people.map((candidate) => String(candidate.id) === String(personId) ? person : candidate),
  });
  setRoomIdentity(roomId, person.id);
  return person;
}

export function setRoomIdentity(roomId, personId) {
  localStorage.setItem(`${IDENTITY_PREFIX}${roomId}`, String(personId));
}

export function getRoomIdentity(roomId) {
  return localStorage.getItem(`${IDENTITY_PREFIX}${roomId}`) || "";
}

export function generateRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
