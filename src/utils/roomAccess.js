export function normalizeRoomCode(value = "") {
  const candidate = String(value ?? "").trim();
  if (!candidate || /^(null|undefined)$/i.test(candidate)) return "";

  return candidate
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

export function sharedRoomAuthPath(roomCode = "", { register = true } = {}) {
  const code = normalizeRoomCode(roomCode);
  const params = new URLSearchParams();
  if (register) params.set("mode", "register");
  if (code) params.set("room", code);
  const query = params.toString();
  return `/online${query ? `?${query}` : ""}`;
}

export function sharedRoomLobbyPath(roomCode = "") {
  const code = normalizeRoomCode(roomCode);
  return `/online/lobby${code ? `?room=${encodeURIComponent(code)}` : ""}`;
}

export function sharedRoomInviteUrl(origin, roomCode) {
  return `${String(origin).replace(/\/$/, "")}${sharedRoomAuthPath(roomCode)}`;
}
