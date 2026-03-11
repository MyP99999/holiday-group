const PREFIX = "hg:room:";

function defaultState() {
  return { people: [], expenses: [] };
}

export function localStorageDriver(roomId) {
  const key = `${PREFIX}${roomId}`;

  return {
    read() {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
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

export function createRoom(roomId) {
  const key = `${PREFIX}${roomId}`;
  localStorage.setItem(key, JSON.stringify(defaultState()));
}

export function generateRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
