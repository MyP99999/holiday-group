import {
  normalizeRoomCode,
  sharedRoomAuthPath,
  sharedRoomInviteUrl,
  sharedRoomLobbyPath,
} from "./roomAccess";

describe("authenticated shared-room entry", () => {
  test("normalizes a room code for links and lookup", () => {
    expect(normalizeRoomCode(" ab-c12 3 ")).toBe("ABC123");
  });

  test("preserves the room code through account creation and the lobby", () => {
    expect(sharedRoomAuthPath("abc123")).toBe("/online?mode=register&room=ABC123");
    expect(sharedRoomLobbyPath("abc123")).toBe("/online/lobby?room=ABC123");
  });

  test("creates a full account-required invitation URL", () => {
    expect(sharedRoomInviteUrl("https://holidaysplits.com/", "abc123"))
      .toBe("https://holidaysplits.com/online?mode=register&room=ABC123");
  });
});
