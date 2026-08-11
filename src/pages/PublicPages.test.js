import { act } from "react";
import { createRoot } from "react-dom/client";
import PrivacyPage from "./PrivacyPage";
import TermsPage from "./TermsPage";
import SupportPage from "./SupportPage";
import DeleteAccountPage from "./DeleteAccountPage";

jest.mock("react-router-dom", () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
  useNavigate: () => jest.fn(),
}), { virtual: true });

const pages = [
  ["/privacy", PrivacyPage, "Privacy Policy"],
  ["/terms", TermsPage, "Terms of Service"],
  ["/support", SupportPage, "Support"],
  ["/delete-account", DeleteAccountPage, "Delete your HolidaySplits account"],
];

describe("public Google Play information pages", () => {
  let container;
  let root;
  let scrollTo;

  beforeAll(() => { globalThis.IS_REACT_ACT_ENVIRONMENT = true; });
  afterAll(() => { delete globalThis.IS_REACT_ACT_ENVIRONMENT; });

  beforeEach(() => {
    scrollTo = window.scrollTo;
    window.scrollTo = jest.fn();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.scrollTo = scrollTo;
  });

  test.each(pages)("%s renders its public heading and navigation", (path, Page, heading) => {
    act(() => { root.render(<Page />); });

    expect(container.querySelector("h1")?.textContent).toBe(heading);
    expect(container.querySelector('a[href="/privacy"]')).not.toBeNull();
    expect(container.querySelector('a[href="/delete-account"]')).not.toBeNull();
  });

  test("account deletion can be requested without signing in", () => {
    act(() => { root.render(<DeleteAccountPage />); });

    const requestLink = [...container.querySelectorAll("a")].find((link) => link.textContent === "Request account deletion");
    expect(requestLink?.href).toContain("mailto:support@holidaysplits.com");
    expect(container.textContent).toContain("What is deleted");
    expect(container.textContent).toContain("What may be retained");
  });
});
