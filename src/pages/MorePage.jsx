import { NavLink } from "react-router-dom";
import { LuHeart, LuVote } from "react-icons/lu";
import PageHeader from "../components/PageHeader";
import { useLanguage } from "../context/LanguageContext";

const moreItems = [
  { to: "../decisions", titleKey: "group_decisions", descriptionKey: "more_decisions_desc", icon: LuVote },
  { to: "../wishlist", titleKey: "wishlist", descriptionKey: "more_wishlist_desc", icon: LuHeart },
];

export default function MorePage() {
  const { t } = useLanguage();
  return (
    <div className="page-stack compact-page more-page">
      <PageHeader title={t("more")} description={t("more_desc")} />
      <nav className="more-menu-grid" aria-label={t("more")}>
        {moreItems.map(({ to, titleKey, descriptionKey, icon: Icon }) => (
          <NavLink key={to} to={to} className="more-menu-card">
            <Icon aria-hidden="true" />
            <span><strong>{t(titleKey)}</strong><small>{t(descriptionKey)}</small></span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
