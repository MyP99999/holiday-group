const LIST_KEY = "hg:sessions";
const DATA_PREFIX = "hg:session:";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(LIST_KEY)) || [];
  } catch {
    return [];
  }
}

export function createSession(name) {
  const session = {
    id: generateId(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  const sessions = [...getSessions(), session];
  localStorage.setItem(LIST_KEY, JSON.stringify(sessions));
  localStorage.setItem(DATA_PREFIX + session.id, JSON.stringify({ people: [], expenses: [] }));
  return session;
}

export function deleteSession(id) {
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(LIST_KEY, JSON.stringify(sessions));
  localStorage.removeItem(DATA_PREFIX + id);
}

export function getSession(id) {
  return getSessions().find((s) => s.id === id) || null;
}

// Storage driver for an offline session — same interface as localStorageDriver
export function sessionDriver(sessionId) {
  const key = DATA_PREFIX + sessionId;
  return {
    read() {
      try {
        return JSON.parse(localStorage.getItem(key)) || { people: [], expenses: [] };
      } catch {
        return { people: [], expenses: [] };
      }
    },
    write(state) {
      localStorage.setItem(key, JSON.stringify(state));
    },
    // No cross-tab sync needed for offline sessions
    subscribe: () => () => {},
  };
}
