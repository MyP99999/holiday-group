import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuExternalLink } from "react-icons/lu";
import BrandButton from "./BrandButton";

export const SUPPORT_EMAIL = "support@holidaysplits.com";

const informationLinks = [
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Service"],
  ["/support", "Support"],
  ["/delete-account", "Delete Account"],
];

export default function PublicInfoLayout({ eyebrow, title, summary, updated, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} · HolidaySplits`;
    window.scrollTo?.(0, 0);
    return () => { document.title = previousTitle; };
  }, [title]);

  return (
    <div className="public-info-page">
      <header className="entry-topbar public-info-topbar">
        <BrandButton className="wordmark" onClick={() => navigate("/")} />
        <button className="text-link public-info-back" type="button" onClick={() => navigate("/")}>
          <LuArrowLeft aria-hidden="true" /> Home
        </button>
      </header>

      <main className="public-info-shell">
        <aside className="public-info-aside" aria-label="Legal and support pages">
          <span className="public-info-kicker">HolidaySplits</span>
          <nav>
            {informationLinks.map(([path, label]) => (
              <Link key={path} to={path} className={window.location.pathname === path ? "active" : ""}>{label}</Link>
            ))}
          </nav>
          <a className="public-info-contact" href={`mailto:${SUPPORT_EMAIL}`}>
            Contact support <LuExternalLink aria-hidden="true" />
          </a>
        </aside>

        <article className="public-info-article">
          <header className="public-info-hero">
            <span>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{summary}</p>
            {updated && <small>Last updated: {updated}</small>}
          </header>
          <div className="public-info-content">{children}</div>
        </article>
      </main>

      <footer className="public-info-footer">
        <span>© {new Date().getFullYear()} HolidaySplits</span>
        <div>{informationLinks.map(([path, label]) => <Link key={path} to={path}>{label}</Link>)}</div>
      </footer>
    </div>
  );
}
