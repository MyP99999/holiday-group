import { act } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "../context/LanguageContext";
import AppLayout from "./AppLayout";

jest.mock("react-router-dom", () => ({
  NavLink: ({ children, className = "", ...props }) => (
    <a {...props} className={typeof className === "function" ? className({ isActive: false }) : className}>{children}</a>
  ),
  Outlet: () => <div>People page</div>,
  useLocation: () => ({ pathname: "/trip/people" }),
  useNavigate: () => jest.fn(),
}), { virtual: true });

describe("shared-room refresh control", () => {
  let container;
  let root;
  let originalScrollTo;
  let originalRequestAnimationFrame;
  let originalCancelAnimationFrame;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  });

  beforeEach(() => {
    originalScrollTo = window.scrollTo;
    originalRequestAnimationFrame = window.requestAnimationFrame;
    originalCancelAnimationFrame = window.cancelAnimationFrame;
    window.scrollTo = jest.fn();
    window.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };
    window.cancelAnimationFrame = jest.fn();

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.scrollTo = originalScrollTo;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
  });

  test("shows the mobile button and reports a successful server refresh", async () => {
    const driver = {
      isAsync: true,
      read: jest.fn()
        .mockResolvedValueOnce({ tripName: "Summer trip" })
        .mockResolvedValueOnce({ tripName: "Updated summer trip" }),
      write: jest.fn(),
      subscribe: jest.fn(() => () => {}),
    };

    await act(async () => {
      root.render(
        <LanguageProvider>
          <AppLayout driver={driver} roomCode="ABC123" notificationKey="test-room" />
        </LanguageProvider>
      );
    });

    const refreshButton = container.querySelector(".mobile-refresh-button");
    expect(refreshButton).not.toBeNull();
    expect(refreshButton.getAttribute("aria-label")).toBe("Refresh data");
    expect([...container.querySelectorAll(".bottom-nav .nav-tab")].map((tab) => tab.textContent)).toEqual([
      "Overview", "Expenses", "Settle", "Plan", "More",
    ]);
    expect([...container.querySelectorAll(".side-nav-link")].some((link) => link.textContent.includes("Wishlist"))).toBe(true);

    await act(async () => {
      refreshButton.click();
    });

    expect(driver.read).toHaveBeenCalledTimes(2);
    expect(refreshButton.getAttribute("aria-label")).toBe("Data updated");
    expect(container.querySelector(".mobile-trip").textContent).toBe("Updated summer trip");
  });
});
