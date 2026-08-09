import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { SOCIAL_LINKS } from "../constants";

const socialPreviews = [
  {
    platform: "Instagram",
    href: SOCIAL_LINKS.instagram,
    Icon: FaInstagram,
    className: "instagram",
  },
  {
    platform: "TikTok",
    href: SOCIAL_LINKS.tiktok,
    Icon: FaTiktok,
    className: "tiktok",
  },
];

export default function LandingSocialShowcase() {
  const { t } = useLanguage();

  return (
    <section className="landing-social-showcase landing-reveal" id="socials" aria-label={t("footer_follow")}>
      {socialPreviews.map(({ platform, href, Icon, className }) => (
        <a className={`social-preview ${className}`} href={href} target="_blank" rel="noreferrer" key={platform}>
          <figure aria-hidden="true">
            <span className="social-brand-tile">
              <img src="/brand-mark.png" alt="" />
              <b>HolidaySplits</b>
            </span>
            <span className="social-platform-mark"><Icon /></span>
          </figure>
          <div>
            <strong>{platform}</strong>
            <span>@holidaysplits ↗</span>
          </div>
        </a>
      ))}
    </section>
  );
}
