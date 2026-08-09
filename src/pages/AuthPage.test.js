import { act } from "react";
import { createRoot } from "react-dom/client";
import AuthPage from "./AuthPage";
import { LanguageProvider } from "../context/LanguageContext";

jest.mock("react-router-dom", () => ({
  Navigate: () => null,
  useNavigate: () => jest.fn(),
  useSearchParams: () => [new URLSearchParams("room=null")],
}), { virtual: true });

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    loginWithGoogle: jest.fn(),
    requestPasswordReset: jest.fn(),
  }),
}));

jest.mock("../lib/supabase", () => ({ googleAuthEnabled: false }));

describe("sign-in room code", () => {
  let container;
  let root;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  test("does not show a room gate for a serialized null code", () => {
    act(() => {
      root.render(
        <LanguageProvider><AuthPage /></LanguageProvider>
      );
    });

    expect(container.querySelector(".auth-room-gate")).toBeNull();
    expect(container.textContent).not.toContain("Room NULL");
  });
});
