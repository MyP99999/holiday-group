import { isMemberClaimed, isRoomPersonSelectable } from "./memberClaims";

describe("member claim status", () => {
  test("treats joined members as claimed", () => {
    expect(isMemberClaimed({ claimedAt: "2026-08-09T10:00:00Z" })).toBe(true);
    expect(isMemberClaimed({ isClaimed: true })).toBe(true);
  });

  test("keeps placeholders selectable", () => {
    const placeholder = { id: "person-1", claimedAt: null, isClaimed: false };
    expect(isMemberClaimed(placeholder)).toBe(false);
    expect(isRoomPersonSelectable(placeholder)).toBe(true);
  });

  test("does not allow a claimed room person to be selected", () => {
    expect(isRoomPersonSelectable({ id: "person-1", isClaimed: true })).toBe(false);
  });
});
