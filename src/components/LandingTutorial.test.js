import { act } from "react";
import { createRoot } from "react-dom/client";
import LandingTutorial from "./LandingTutorial";
import { LanguageProvider } from "../context/LanguageContext";

describe("LandingTutorial", () => {
  let container;
  let root;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  });

  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(<LanguageProvider><LandingTutorial /></LanguageProvider>);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  test("opens the guide and switches tutorial steps", () => {
    const toggle = container.querySelector(".tutorial-toggle");
    const section = container.querySelector(".how-section");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(section.classList.contains("is-visible")).toBe(true);

    act(() => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(section.classList.contains("is-visible")).toBe(true);
    expect(container.textContent).toContain("K7M4Q2");

    const spendButton = [...container.querySelectorAll(".tutorial-step-button")]
      .find((button) => button.textContent.includes("Add what everyone spent"));
    act(() => spendButton.click());

    expect(spendButton.getAttribute("aria-expanded")).toBe("true");
    expect(container.textContent).toContain("Record a normal expense");
  });
});
