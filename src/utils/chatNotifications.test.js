import { unreadBadge, unreadMessages } from "./chatNotifications";

const messages = [
  { id: "m1", authorId: "alice" },
  { id: "m2", authorId: "bob" },
  { id: "m3", authorId: "alice" },
  { id: "m4", authorId: "bob" },
];

describe("chat notifications", () => {
  test("counts messages after the last read marker", () => {
    expect(unreadMessages(messages, "m2", "alice").map((message) => message.id)).toEqual(["m4"]);
  });

  test("does not notify a member about their own messages", () => {
    expect(unreadMessages(messages, "", "alice").map((message) => message.id)).toEqual(["m2", "m4"]);
  });

  test("uses chronological order when the stored array is shuffled", () => {
    const shuffled = [
      { id: "m3", authorId: "bob", createdAt: "2026-08-11T12:00:00.000Z" },
      { id: "m1", authorId: "bob", createdAt: "2026-08-11T08:00:00.000Z" },
      { id: "m2", authorId: "alice", createdAt: "2026-08-11T10:00:00.000Z" },
    ];

    expect(unreadMessages(shuffled, "m2", "alice").map((message) => message.id)).toEqual(["m3"]);
  });

  test("shows 9+ for double-digit unread counts", () => {
    expect(unreadBadge(9)).toBe("9");
    expect(unreadBadge(10)).toBe("9+");
  });
});
