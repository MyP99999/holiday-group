import { act } from "react";
import { createRoot } from "react-dom/client";

let mockChatMessages = [];

jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }), { virtual: true });
jest.mock("../context/AppContext", () => ({
  useApp: () => ({
    people: [{ id: "person-1", name: "Maya" }],
    chatMessages: mockChatMessages,
    setChatMessages: jest.fn(),
    currentMemberId: "person-1",
  }),
}));
jest.mock("../context/LanguageContext", () => ({
  useLanguage: () => ({ t: (key) => key, locale: "en-US" }),
}));
jest.mock("./PersonAvatar", () => () => null);

import ChatPanel, { CHAT_PAGE_SIZE, chatDayKey, initialChatStart, previousChatStart } from "./ChatPanel";

global.IS_REACT_ACT_ENVIRONMENT = true;

test("groups chat messages by the sender's local calendar day", () => {
  expect(chatDayKey("2026-08-11T08:30:00")).toBe("2026-08-11");
  expect(chatDayKey("not-a-date")).toBe("");
});

test("shows the newest 15 chat messages first", () => {
  expect(CHAT_PAGE_SIZE).toBe(15);
  expect(initialChatStart(38)).toBe(23);
  expect(initialChatStart(9)).toBe(0);
});

test("loads older chat messages in 15-message pages", () => {
  expect(previousChatStart(23)).toBe(8);
  expect(previousChatStart(8)).toBe(0);
});

test("renders 15 recent messages and reveals 15 more when scrolled to the top", () => {
  mockChatMessages = Array.from({ length: 40 }, (_, index) => ({
    id: `message-${index + 1}`,
    authorId: "person-1",
    text: `Message ${index + 1}`,
    createdAt: `2026-08-11T${String(index % 24).padStart(2, "0")}:00:00.000Z`,
  }));
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => root.render(<ChatPanel />));
  expect(container.querySelectorAll(".chat-message")).toHaveLength(15);
  expect(container.querySelector(".chat-message span")?.textContent).toBe("Message 26");

  const stream = container.querySelector(".chat-stream");
  Object.defineProperties(stream, {
    scrollHeight: { configurable: true, value: 600 },
    clientHeight: { configurable: true, value: 300 },
    scrollTop: { configurable: true, value: 0, writable: true },
  });
  act(() => stream.dispatchEvent(new Event("scroll", { bubbles: true })));

  expect(container.querySelectorAll(".chat-message")).toHaveLength(30);
  expect(container.querySelector(".chat-message span")?.textContent).toBe("Message 11");

  act(() => root.unmount());
  container.remove();
  mockChatMessages = [];
});
