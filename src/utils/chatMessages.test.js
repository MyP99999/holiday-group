import { chronologicalChatMessages } from "./chatMessages";

describe("chat message ordering", () => {
  test("orders messages from oldest to newest by their own timestamp", () => {
    const messages = [
      { id: "newest", createdAt: "2026-08-18T12:30:00.000Z" },
      { id: "oldest", createdAt: "2026-08-17T08:00:00.000Z" },
      { id: "middle", createdAt: "2026-08-18T09:15:00.000Z" },
    ];

    expect(chronologicalChatMessages(messages).map((message) => message.id))
      .toEqual(["oldest", "middle", "newest"]);
    expect(messages.map((message) => message.id)).toEqual(["newest", "oldest", "middle"]);
  });

  test("preserves source order for legacy messages without usable timestamps", () => {
    const messages = [{ id: "first" }, { id: "second", createdAt: "invalid" }];
    expect(chronologicalChatMessages(messages)).toEqual(messages);
  });
});
