import { useLanguage } from "../context/LanguageContext";

const socialPreviews = [
  {
    platform: "Instagram",
    image: "/images/social-instagram-trip.jpg",
    altKey: "social_instagram_alt",
    className: "instagram",
  },
  {
    platform: "TikTok",
    image: "/images/social-tiktok-trip.jpg",
    altKey: "social_tiktok_alt",
    className: "tiktok",
  },
];

export default function LandingSocialShowcase() {
  const { t } = useLanguage();

  return (
    <section className="landing-social-showcase landing-reveal" aria-label={t("footer_follow")}>
      {socialPreviews.map((preview) => (
        <article className={`social-preview ${preview.className}`} key={preview.platform}>
          <figure>
            <img src={preview.image} alt={t(preview.altKey)} loading="lazy" />
          </figure>
          <div>
            <strong>{preview.platform}</strong>
            <span>{t("footer_soon")}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
