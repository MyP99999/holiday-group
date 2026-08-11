jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }), { virtual: true });

import { chatDayKey } from "./ChatPanel";

test("groups chat messages by the sender's local calendar day", () => {
  expect(chatDayKey("2026-08-11T08:30:00")).toBe("2026-08-11");
  expect(chatDayKey("not-a-date")).toBe("");
});
