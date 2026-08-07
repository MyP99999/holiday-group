import { useNavigate } from "react-router-dom";
import LanguageSelect from "../components/LanguageSelect";
import { useLanguage } from "../context/LanguageContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button className="wordmark" onClick={() => navigate("/")}>Holiday Group</button>
        <nav>
          <a href="#how-it-works">{t("how_it_works")}</a>
          <a href="#made-for-groups">{t("for_groups")}</a>
          <LanguageSelect compact />
          <button className="text-link" onClick={() => navigate("/online")}>{t("sign_in")}</button>
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <h1>{t("hero_title")}</h1>
            <p>{t("hero_desc")}</p>
            <div className="hero-actions">
              <button className="button primary large-button" onClick={() => navigate("/offline")}>{t("start_local_trip")}</button>
              <button className="button secondary large-button" onClick={() => navigate("/guest")}>{t("open_guest_room")}</button>
            </div>
            <span className="hero-note">{t("no_account_choice")}</span>
          </div>
          <figure className="hero-media">
            <img src="/images/friends-splitting-receipt.png" alt="Four friends reviewing a restaurant receipt together by a lake" />
            <figcaption><strong>One bill, four friends.</strong><span>Assign items in a few taps.</span></figcaption>
          </figure>
        </section>

        <section className="landing-proof" id="made-for-groups" aria-label="Core product features">
          <div><span>01</span><strong>Scan the receipt</strong><p>Photograph a bill, review the items, then choose who shared each one.</p></div>
          <div><span>02</span><strong>Split any cost</strong><p>Use equal shares or enter exact amounts for a flexible, fair split.</p></div>
          <div><span>03</span><strong>Travel in any currency</strong><p>Record locally, convert consistently, and settle in the currency you prefer.</p></div>
        </section>

        <section className="how-section" id="how-it-works">
          <div><h2>Built for the whole trip, not just the final bill.</h2><p>Add friends, log accommodation and transport, handle restaurant items separately, then reduce the final balance to the fewest payments.</p></div>
          <ol>
            <li><span>Bring the group</span><strong>Create a local trip or share a guest room code.</strong></li>
            <li><span>Capture the spend</span><strong>Type it, scan it, or use the restaurant splitter.</strong></li>
            <li><span>Leave even</span><strong>See exactly who pays whom and in which currency.</strong></li>
          </ol>
        </section>
      </main>

      <footer className="landing-footer"><span>Holiday Group</span><p>Local-first today. Supabase-ready for account sync and realtime rooms next.</p></footer>
    </div>
  );
}
