import { act } from "react";
import { createRoot } from "react-dom/client";
import LandingSocialShowcase from "./LandingSocialShowcase";
import { LanguageProvider } from "../context/LanguageContext";
import { SOCIAL_LINKS } from "../constants";

describe("LandingSocialShowcase", () => {
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
    act(() => root.render(<LanguageProvider><LandingSocialShowcase /></LanguageProvider>));
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  test("links both profiles and combines platform logos with the app mark", () => {
    const links = [...container.querySelectorAll(".social-preview")];

    expect(links.map((link) => link.href)).toEqual([SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok]);
    expect(links.every((link) => link.target === "_blank" && link.querySelector("svg"))).toBe(true);
    expect(links.every((link) => link.querySelector("img")?.getAttribute("src") === "/brand-mark.png")).toBe(true);
    expect(container.querySelector('[src*="social-instagram-trip"], [src*="social-tiktok-trip"]')).toBeNull();
  });
});
