import { useEffect, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { useLanguage } from "../context/LanguageContext";

const DEMO_ROOM_CODE = "K7M4Q2";
const DEMO_INVITE_URL = `https://holidaysplits.com/online?mode=register&room=${DEMO_ROOM_CODE}`;

const tutorialSteps = [
  { title: "tutorial_create_title", description: "tutorial_create_desc" },
  { title: "tutorial_invite_title", description: "tutorial_invite_desc", invite: true },
  { title: "tutorial_spend_title", description: "tutorial_spend_desc" },
  { title: "tutorial_settle_title", description: "tutorial_settle_desc" },
];

export default function LandingTutorial() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(() => window.location.hash === "#how-it-works");
  const [activeStep, setActiveStep] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let scrollTimer;
    const openFromHash = () => {
      if (window.location.hash !== "#how-it-works") return;
      setOpen(true);
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        const tutorial = document.getElementById("how-it-works");
        if (!tutorial) return;
        window.scrollTo({ top: tutorial.getBoundingClientRect().top + window.scrollY, behavior: "auto" });
      }, 180);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => {
      window.clearTimeout(scrollTimer);
      window.removeEventListener("hashchange", openFromHash);
    };
  }, []);

  const copyDemoInvite = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_INVITE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className={`how-section landing-reveal is-visible${open ? " tutorial-open" : ""}`} id="how-it-works">
      <div className="tutorial-intro">
        <h2>{t("tutorial_title")}</h2>
        <p>{t("tutorial_desc")}</p>
        <button
          type="button"
          className="tutorial-toggle"
          aria-expanded={open}
          aria-controls="landing-quick-guide"
          onClick={() => setOpen((current) => !current)}
        >
          <span>{t(open ? "tutorial_close" : "tutorial_open")}</span>
          <LuChevronDown aria-hidden="true" />
        </button>
      </div>

      <div className="tutorial-dropdown" id="landing-quick-guide" aria-hidden={!open}>
        <div className="tutorial-dropdown-inner">
          <ol className="tutorial-steps">
            {tutorialSteps.map((step, index) => {
              const active = index === activeStep;
              return (
                <li className={active ? "active" : ""} key={step.title}>
                  <button
                    type="button"
                    className="tutorial-step-button"
                    aria-expanded={active}
                    onClick={() => setActiveStep(index)}
                    tabIndex={open ? 0 : -1}
                  >
                    <span className="tutorial-step-number">{index + 1}</span>
                    <strong>{t(step.title)}</strong>
                    <LuChevronDown aria-hidden="true" />
                  </button>

                  {active && (
                    <div className="tutorial-step-content">
                      <p>{t(step.description)}</p>
                      {step.invite && (
                        <div className="tutorial-invite-demo">
                          <div>
                            <span>{t("room_code")}</span>
                            <code>{DEMO_ROOM_CODE}</code>
                          </div>
                          <div className="tutorial-demo-link">
                            <span>{t("tutorial_invite_link")}</span>
                            <code title={DEMO_INVITE_URL}>{DEMO_INVITE_URL.replace("https://", "")}</code>
                          </div>
                          <button type="button" onClick={copyDemoInvite} tabIndex={open ? 0 : -1}>{t(copied ? "copied" : "tutorial_copy_link")}</button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
