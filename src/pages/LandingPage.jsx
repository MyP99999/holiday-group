import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import BrandButton from "../components/BrandButton";
import LanguageSelect from "../components/LanguageSelect";
import LandingTutorial from "../components/LandingTutorial";
import LandingSocialShowcase from "../components/LandingSocialShowcase";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { SOCIAL_LINKS } from "../constants";

const slides = [
  {
    src: "/images/restaurant-lake.jpg",
    title: "landing_slide_restaurant_title",
    description: "landing_slide_restaurant_desc",
    alt: "landing_slide_restaurant_alt",
    position: "53% center",
  },
  {
    src: "/images/villa-room-planning.jpg",
    title: "landing_slide_villa_title",
    description: "landing_slide_villa_desc",
    alt: "landing_slide_villa_alt",
    position: "55% center",
  },
  {
    src: "/images/coastal-road-trip.jpg",
    title: "landing_slide_road_title",
    description: "landing_slide_road_desc",
    alt: "landing_slide_road_alt",
    position: "60% center",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const mediaRef = useRef(null);
  const touchStart = useRef(null);
  const currentYear = new Date().getFullYear();

  const changeSlide = (direction) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reducedMotion) return undefined;
    const timer = window.setInterval(() => changeSlide(1), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const nodes = document.querySelectorAll(".landing-reveal");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.16 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const updateSpotlight = (event) => {
    if (event.pointerType === "touch" || !mediaRef.current) return;
    const rect = mediaRef.current.getBoundingClientRect();
    mediaRef.current.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    mediaRef.current.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  const handleTouchStart = (event) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) > 45) changeSlide(distance > 0 ? -1 : 1);
  };

  return (
    <div className="landing-page">
      <header className="landing-nav landing-reveal is-visible">
        <BrandButton className="wordmark" onClick={() => navigate("/")} />
        <nav>
          <a href="#how-it-works">{t("how_it_works")}</a>
          <a href="#made-for-groups">{t("for_groups")}</a>
          <LanguageSelect compact />
          {authLoading ? (
            <span className="landing-account-loading" aria-label={t("checking_session")} />
          ) : user ? (
            <div className="landing-account-actions">
              <button className="text-link landing-trips-link" onClick={() => navigate("/online/lobby")}>{t("my_trips")}</button>
              <button className="landing-profile-button" onClick={() => navigate("/profile")} aria-label={`${t("profile")}: ${user.name}`}>
                <span aria-hidden="true">{user.name?.slice(0, 2).toUpperCase()}</span>
                <b>{user.name}</b>
              </button>
            </div>
          ) : (
            <button className="text-link" onClick={() => navigate("/online")}>{t("sign_in")}</button>
          )}
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-copy landing-reveal is-visible">
            <h1>{t("hero_title")}</h1>
            <p>{t("hero_desc")}</p>
            <div className="hero-actions">
              {user && <button className="button secondary large-button mobile-hero-trips-button" onClick={() => navigate("/online/lobby")}>{t("my_trips")}</button>}
              <button className="button primary large-button" onClick={() => navigate("/offline")}>{t("start_local_trip")}</button>
              <button className="button secondary large-button" onClick={() => navigate(user ? "/online/lobby" : "/online?mode=register")}>{t("open_guest_room")}</button>
            </div>
            <span className="hero-note">{t("no_account_choice")}</span>
          </div>

          <div
            className={`hero-media-shell landing-reveal is-visible${paused ? " is-paused" : ""}`}
            ref={mediaRef}
            onPointerMove={updateSpotlight}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
            }}
          >
            <figure className="hero-media" aria-roledescription="carousel" aria-label={t("landing_stories")}>
              <div className="hero-media-stage">
                {slides.map((slide, index) => (
                  <img
                    key={slide.src}
                    className={index === activeSlide ? "active" : ""}
                    src={slide.src}
                    alt={t(slide.alt)}
                    style={{ objectPosition: slide.position }}
                    loading={index === 0 ? "eager" : "lazy"}
                    aria-hidden={index !== activeSlide}
                  />
                ))}
              </div>
              <figcaption key={slides[activeSlide].title}>
                <strong>{t(slides[activeSlide].title)}</strong>
                <span>{t(slides[activeSlide].description)}</span>
              </figcaption>
              <button className="carousel-arrow previous" onClick={() => changeSlide(-1)} aria-label={t("previous_story")}>
                <LuChevronLeft aria-hidden="true" />
              </button>
              <button className="carousel-arrow next" onClick={() => changeSlide(1)} aria-label={t("next_story")}>
                <LuChevronRight aria-hidden="true" />
              </button>
            </figure>
            <div className="carousel-progress" aria-label={t("choose_story")}>
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  className={index === activeSlide ? "active" : ""}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`${t("show_story")} ${index + 1}`}
                  aria-current={index === activeSlide ? "true" : undefined}
                ><span /></button>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-proof landing-reveal" id="made-for-groups" aria-label={t("landing_core_features")}>
          <div><span>01</span><strong>{t("proof_scan_title")}</strong><p>{t("proof_scan_desc")}</p></div>
          <div><span>02</span><strong>{t("proof_split_title")}</strong><p>{t("proof_split_desc")}</p></div>
          <div><span>03</span><strong>{t("proof_currency_title")}</strong><p>{t("proof_currency_desc")}</p></div>
        </section>

        <LandingTutorial />
        <LandingSocialShowcase />
      </main>

      <footer className="landing-footer landing-reveal">
        <div className="landing-footer-main">
          <div className="footer-intro">
            <span className="footer-brand"><img src="/brand-mark.png" alt="" /><b>HolidaySplits</b></span>
            <p>{t("landing_footer")}</p>
          </div>
          <div className="footer-column">
            <strong>{t("footer_explore")}</strong>
            <a href="#how-it-works">{t("how_it_works")}</a>
            <a href="#made-for-groups">{t("for_groups")}</a>
            {!authLoading && (
              <button onClick={() => navigate(user ? "/profile" : "/online")}>{user ? t("profile") : t("sign_in")}</button>
            )}
          </div>
          <div className="footer-column">
            <strong>Legal &amp; support</strong>
            <button onClick={() => navigate("/privacy")}>Privacy Policy</button>
            <button onClick={() => navigate("/terms")}>Terms of Service</button>
            <button onClick={() => navigate("/support")}>Support</button>
            <button onClick={() => navigate("/delete-account")}>Delete Account</button>
          </div>
          <div className="footer-column footer-socials">
            <strong>{t("footer_follow")}</strong>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer">Instagram <small>@holidaysplits</small></a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer">TikTok <small>@holidaysplits</small></a>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <span>© {currentYear} HolidaySplits</span>
          <span>{t("footer_made_for")}</span>
        </div>
      </footer>
    </div>
  );
}
