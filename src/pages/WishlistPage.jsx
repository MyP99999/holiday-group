import { useEffect, useMemo, useState } from "react";
import { LuExternalLink, LuHeart, LuLightbulb, LuPlus, LuTrash2 } from "react-icons/lu";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { createId } from "../storage/tripState";

const IDEA_CATEGORIES = ["place", "stay", "food", "activity", "other"];
const emptyIdea = { title: "", details: "", category: "place", url: "" };

export function safeIdeaUrl(value = "") {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

export function toggleWishlistLike(ideas, ideaId, memberId) {
  if (!memberId) return ideas;
  return ideas.map((idea) => {
    if (String(idea.id) !== String(ideaId)) return idea;
    const likedByIds = [...new Set((idea.likedByIds || []).map(String))];
    const normalizedMemberId = String(memberId);
    return {
      ...idea,
      likedByIds: likedByIds.includes(normalizedMemberId)
        ? likedByIds.filter((id) => id !== normalizedMemberId)
        : [...likedByIds, normalizedMemberId],
    };
  });
}

export default function WishlistPage() {
  const { t, locale } = useLanguage();
  const {
    people, wishlistIdeas, setWishlistIdeas, currentMemberId, canManageMembers,
  } = useApp();
  const [showComposer, setShowComposer] = useState(false);
  const [ideaForm, setIdeaForm] = useState(emptyIdea);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortMode, setSortMode] = useState("popular");
  const [localMemberId, setLocalMemberId] = useState("");
  const actorId = String(currentMemberId || localMemberId || people[0]?.id || "");

  useEffect(() => {
    if (currentMemberId) return;
    if (!people.some((person) => String(person.id) === String(localMemberId))) {
      setLocalMemberId(String(people[0]?.id || ""));
    }
  }, [currentMemberId, localMemberId, people]);

  const ideas = useMemo(() => {
    const filtered = categoryFilter === "all"
      ? wishlistIdeas
      : wishlistIdeas.filter((idea) => idea.category === categoryFilter);
    return [...filtered].sort((left, right) => {
      if (sortMode === "newest") return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
      const likeDifference = (right.likedByIds?.length || 0) - (left.likedByIds?.length || 0);
      return likeDifference || new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
    });
  }, [categoryFilter, sortMode, wishlistIdeas]);

  const totalLikes = wishlistIdeas.reduce((sum, idea) => sum + (idea.likedByIds?.length || 0), 0);
  const mostLoved = [...wishlistIdeas].sort((left, right) => (right.likedByIds?.length || 0) - (left.likedByIds?.length || 0))[0];
  const personName = (id) => people.find((person) => String(person.id) === String(id))?.name || t("member");

  const addIdea = (event) => {
    event.preventDefault();
    const title = ideaForm.title.trim();
    if (!title) return;
    setWishlistIdeas((current) => [{
      id: createId("wishlist"),
      title,
      details: ideaForm.details.trim(),
      category: IDEA_CATEGORIES.includes(ideaForm.category) ? ideaForm.category : "other",
      url: safeIdeaUrl(ideaForm.url),
      createdBy: actorId,
      createdAt: new Date().toISOString(),
      likedByIds: [],
    }, ...current]);
    setIdeaForm(emptyIdea);
    setShowComposer(false);
  };

  const toggleLike = (ideaId) => {
    if (!actorId) return;
    setWishlistIdeas((current) => toggleWishlistLike(current, ideaId, actorId));
  };

  const removeIdea = (idea) => {
    if (!(canManageMembers || String(idea.createdBy) === actorId)) return;
    if (!window.confirm(t("remove_idea_confirm"))) return;
    setWishlistIdeas((current) => current.filter((item) => String(item.id) !== String(idea.id)));
  };

  return (
    <div className="page-stack compact-page wishlist-page">
      <PageHeader
        title={t("wishlist")}
        description={t("wishlist_desc")}
        actions={<button className="button primary" onClick={() => setShowComposer((visible) => !visible)}><LuPlus aria-hidden="true" />{showComposer ? t("cancel") : t("add_idea")}</button>}
      />

      <section className="wishlist-summary" aria-label={t("wishlist_summary")}>
        <div><strong>{wishlistIdeas.length}</strong><span>{t("ideas")}</span></div>
        <div><strong>{totalLikes}</strong><span>{t("likes")}</span></div>
        <div><strong>{mostLoved?.title || "—"}</strong><span>{t("most_loved")}</span></div>
      </section>

      {showComposer && (
        <form className="wishlist-composer surface-panel" onSubmit={addIdea}>
          <div className="panel-heading"><div><h2>{t("new_idea")}</h2><p>{t("new_idea_desc")}</p></div><LuLightbulb aria-hidden="true" /></div>
          <div className="wishlist-form-grid">
            <label className="field-group"><span className="field-label">{t("idea_title")}</span><input autoFocus value={ideaForm.title} onChange={(event) => setIdeaForm((current) => ({ ...current, title: event.target.value }))} placeholder={t("idea_title_placeholder")} maxLength={120} required /></label>
            <label className="field-group"><span className="field-label">{t("idea_category")}</span><select value={ideaForm.category} onChange={(event) => setIdeaForm((current) => ({ ...current, category: event.target.value }))}>{IDEA_CATEGORIES.map((category) => <option key={category} value={category}>{t(`wish_category_${category}`)}</option>)}</select></label>
            <label className="field-group wishlist-details-field"><span className="field-label">{t("idea_details")}</span><textarea value={ideaForm.details} onChange={(event) => setIdeaForm((current) => ({ ...current, details: event.target.value }))} placeholder={t("idea_details_placeholder")} maxLength={500} rows="3" /></label>
            <label className="field-group wishlist-link-field"><span className="field-label">{t("idea_link")}</span><input type="text" inputMode="url" value={ideaForm.url} onChange={(event) => setIdeaForm((current) => ({ ...current, url: event.target.value }))} placeholder={t("idea_link_placeholder")} /></label>
          </div>
          <div className="wishlist-composer-actions"><button type="button" className="button secondary" onClick={() => setShowComposer(false)}>{t("cancel")}</button><button className="button primary" type="submit" disabled={!ideaForm.title.trim()}>{t("save_idea")}</button></div>
        </form>
      )}

      <section className="wishlist-toolbar">
        <div className="wishlist-filters" aria-label={t("filter_ideas")}>
          {["all", ...IDEA_CATEGORIES].map((category) => <button key={category} className={categoryFilter === category ? "active" : ""} onClick={() => setCategoryFilter(category)}>{t(`wish_category_${category}`)}</button>)}
        </div>
        <div className="wishlist-toolbar-controls">
          {!currentMemberId && people.length > 1 && <label><span>{t("liking_as")}</span><select value={actorId} onChange={(event) => setLocalMemberId(event.target.value)}>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>}
          <label><span>{t("sort_by")}</span><select value={sortMode} onChange={(event) => setSortMode(event.target.value)}><option value="popular">{t("most_loved")}</option><option value="newest">{t("newest")}</option></select></label>
        </div>
      </section>

      {ideas.length ? (
        <div className="wishlist-grid">
          {ideas.map((idea) => {
            const likedByIds = idea.likedByIds || [];
            const liked = likedByIds.map(String).includes(actorId);
            const canRemove = canManageMembers || String(idea.createdBy) === actorId;
            const likedByNames = likedByIds.map(personName).join(", ");
            return (
              <article className="wishlist-card" key={idea.id}>
                <header>
                  <span className={`wishlist-category category-${idea.category}`}>{t(`wish_category_${idea.category}`)}</span>
                  {canRemove && <button className="wishlist-remove" onClick={() => removeIdea(idea)} aria-label={t("remove_idea")} title={t("remove_idea")}><LuTrash2 aria-hidden="true" /></button>}
                </header>
                <div className="wishlist-card-copy">
                  <h2>{idea.title}</h2>
                  {idea.details && <p>{idea.details}</p>}
                  {idea.url && <a href={idea.url} target="_blank" rel="noreferrer">{t("open_idea_link")}<LuExternalLink aria-hidden="true" /></a>}
                </div>
                <footer>
                  <span>{idea.createdBy ? t("added_by", { name: personName(idea.createdBy) }) : t("shared_idea")}{idea.createdAt && <> · <time dateTime={idea.createdAt}>{new Date(idea.createdAt).toLocaleDateString(locale, { day: "numeric", month: "short" })}</time></>}</span>
                  <button className={`wishlist-like${liked ? " liked" : ""}`} onClick={() => toggleLike(idea.id)} disabled={!actorId} aria-pressed={liked} aria-label={t(liked ? "unlike_idea" : "like_idea")} title={likedByNames || t("no_likes_yet")}><LuHeart aria-hidden="true" /><strong>{likedByIds.length}</strong></button>
                </footer>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="wishlist-empty surface-panel"><LuHeart aria-hidden="true" /><strong>{t("no_wishlist_ideas")}</strong><span>{categoryFilter === "all" ? t("no_wishlist_ideas_desc") : t("no_filtered_ideas")}</span>{categoryFilter === "all" && <button className="text-link" onClick={() => setShowComposer(true)}>{t("add_first_idea")}</button>}</section>
      )}
    </div>
  );
}
