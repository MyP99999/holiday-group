import { useEffect, useMemo, useState } from "react";
import CurrencySelect from "./CurrencySelect";
import PersonAvatar from "./PersonAvatar";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { createId } from "../storage/tripState";
import { fmt } from "../utils";

const CATEGORIES = ["accommodation", "rental_car", "flight", "restaurant", "activity", "other"];

function emptyChoice() {
  return { id: createId("choice"), title: "", detail: "", price: "", currency: "EUR", url: "", voterIds: [] };
}

function emptyDraft() {
  return { category: "accommodation", question: "", options: [emptyChoice(), emptyChoice()] };
}

function safeUrl(value = "") {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function applyPollVote(polls, pollId, optionId, voterId) {
  if (!voterId) return polls;
  return polls.map((poll) => {
    if (poll.id !== pollId || poll.status === "closed") return poll;
    const selectedOption = poll.options.find((option) => option.id === optionId);
    const removingVote = selectedOption?.voterIds.map(String).includes(String(voterId));
    return {
      ...poll,
      options: poll.options.map((option) => ({
        ...option,
        voterIds: option.id === optionId && !removingVote
          ? [...option.voterIds.filter((id) => String(id) !== String(voterId)), voterId]
          : option.voterIds.filter((id) => String(id) !== String(voterId)),
      })),
    };
  });
}

export default function DecisionBoard({ startRequest }) {
  const { t } = useLanguage();
  const { people, polls, setPolls, currentMemberId, canManageMembers } = useApp();
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [localVoterId, setLocalVoterId] = useState("");
  const voterId = currentMemberId || localVoterId || people[0]?.id || "";
  const activeVoter = people.find((person) => String(person.id) === String(voterId));

  const categoryLabels = useMemo(() => ({
    accommodation: t("poll_category_accommodation"),
    rental_car: t("poll_category_rental_car"),
    flight: t("poll_category_flight"),
    restaurant: t("poll_category_restaurant"),
    activity: t("poll_category_activity"),
    other: t("poll_category_other"),
  }), [t]);

  useEffect(() => {
    if (!startRequest?.id) return;
    const firstChoice = { ...emptyChoice(), ...(startRequest.option || {}) };
    setDraft({
      category: CATEGORIES.includes(startRequest.category) ? startRequest.category : "other",
      question: startRequest.question || "",
      options: [firstChoice, emptyChoice()],
    });
    setShowComposer(true);
    window.requestAnimationFrame(() => document.getElementById("group-decisions")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [startRequest]);

  useEffect(() => {
    if (currentMemberId) return;
    if (!people.some((person) => String(person.id) === String(localVoterId))) {
      setLocalVoterId(people[0]?.id || "");
    }
  }, [currentMemberId, localVoterId, people]);

  const updateChoice = (choiceId, fields) => setDraft((current) => ({
    ...current,
    options: current.options.map((option) => option.id === choiceId ? { ...option, ...fields } : option),
  }));

  const removeChoice = (choiceId) => setDraft((current) => ({
    ...current,
    options: current.options.length > 2 ? current.options.filter((option) => option.id !== choiceId) : current.options,
  }));

  const closeComposer = () => {
    setDraft(emptyDraft());
    setShowComposer(false);
  };

  const createPoll = () => {
    const options = draft.options
      .filter((option) => option.title.trim())
      .map((option) => ({
        ...option,
        title: option.title.trim(),
        detail: option.detail.trim(),
        price: option.price === "" ? "" : Math.max(0, Number(option.price) || 0),
        url: safeUrl(option.url),
        voterIds: [],
      }));
    if (!voterId || !draft.question.trim() || options.length < 2) return;

    setPolls((current) => [{
      id: createId("poll"),
      category: draft.category,
      question: draft.question.trim(),
      options,
      status: "open",
      createdBy: voterId,
      createdAt: new Date().toISOString(),
    }, ...current]);
    closeComposer();
  };

  const toggleVote = (pollId, optionId) => {
    if (!voterId) return;
    setPolls((current) => applyPollVote(current, pollId, optionId, voterId));
  };

  const setPollStatus = (pollId, status) => setPolls((current) => current.map((poll) => (
    poll.id === pollId ? { ...poll, status } : poll
  )));

  const removePoll = (pollId) => {
    if (!window.confirm(t("delete_poll_confirm"))) return;
    setPolls((current) => current.filter((poll) => poll.id !== pollId));
  };

  return (
    <section className="decision-board logistics-section" id="group-decisions">
      <div className="decision-heading">
        <div>
          <span>{t("group_choice")}</span>
          <h2>{t("group_decisions")}</h2>
          <p>{t("group_decisions_desc")}</p>
        </div>
        <div>
          <label className="poll-voting-as">
            <span>{t("voting_as")}</span>
            {currentMemberId ? <b>{activeVoter?.name || t("member")}</b> : <select value={voterId} onChange={(event) => setLocalVoterId(event.target.value)} disabled={!people.length}>{people.length ? people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>) : <option value="">{t("no_people")}</option>}</select>}
          </label>
          <strong>{polls.filter((poll) => poll.status !== "closed").length}<span>{t("open_votes")}</span></strong>
          <button className="button primary small-button" onClick={() => setShowComposer((visible) => !visible)}>{showComposer ? t("cancel") : t("new_vote")}</button>
        </div>
      </div>

      {showComposer && (
        <div className="decision-composer">
          <div className="decision-composer-heading">
            <div><strong>{t("new_vote")}</strong><span>{t("one_vote_help")}</span></div>
            {!voterId && <small>{t("add_people_to_vote")}</small>}
          </div>

          <div className="poll-category-picker" aria-label={t("vote_category")}>
            {CATEGORIES.map((category) => (
              <button type="button" key={category} className={draft.category === category ? "active" : ""} onClick={() => setDraft((current) => ({ ...current, category }))}>{categoryLabels[category]}</button>
            ))}
          </div>

          <label className="poll-question-field">
            <span>{t("poll_question")}</span>
            <input autoFocus value={draft.question} onChange={(event) => setDraft((current) => ({ ...current, question: event.target.value }))} placeholder={t("poll_question_placeholder")} />
          </label>

          <div className="poll-choice-drafts">
            <span className="poll-draft-label">{t("poll_choices")}</span>
            {draft.options.map((option, index) => (
              <div className="poll-choice-draft" key={option.id}>
                <span className="poll-choice-number">{index + 1}</span>
                <label className="poll-choice-name"><span>{t("choice")}</span><input value={option.title} onChange={(event) => updateChoice(option.id, { title: event.target.value })} placeholder={t("choice_title_placeholder")} /></label>
                <label className="poll-choice-detail"><span>{t("details_optional")}</span><input value={option.detail} onChange={(event) => updateChoice(option.id, { detail: event.target.value })} placeholder={t("choice_detail_placeholder")} /></label>
                <label className="poll-choice-price"><span>{t("optional_price")}</span><div><input type="number" min="0" step="0.01" value={option.price} onChange={(event) => updateChoice(option.id, { price: event.target.value })} placeholder="0.00" /><CurrencySelect value={option.currency} onChange={(currency) => updateChoice(option.id, { currency })} /></div></label>
                <label className="poll-choice-link"><span>{t("optional_link")}</span><input type="url" value={option.url} onChange={(event) => updateChoice(option.id, { url: event.target.value })} placeholder="booking.com/..." /></label>
                <button type="button" className="row-action poll-remove-choice" disabled={draft.options.length <= 2} onClick={() => removeChoice(option.id)}>{t("remove")}</button>
              </div>
            ))}
          </div>

          <div className="decision-composer-actions">
            <button className="text-link" onClick={() => setDraft((current) => ({ ...current, options: [...current.options, emptyChoice()] }))}>+ {t("add_choice")}</button>
            <div><button className="button secondary small-button" onClick={closeComposer}>{t("cancel")}</button><button className="button primary small-button" disabled={!voterId || !draft.question.trim() || draft.options.filter((option) => option.title.trim()).length < 2} onClick={createPoll}>{t("create_vote")}</button></div>
          </div>
        </div>
      )}

      {polls.length ? (
        <div className="poll-grid">
          {polls.map((poll) => {
            const scores = poll.options.map((option) => option.voterIds.length);
            const highScore = Math.max(0, ...scores);
            const leaders = poll.options.filter((option) => option.voterIds.length === highScore && highScore > 0);
            const totalVoters = new Set(poll.options.flatMap((option) => option.voterIds.map(String))).size;
            const canEdit = canManageMembers || String(poll.createdBy) === String(voterId);
            const creator = people.find((person) => String(person.id) === String(poll.createdBy));
            return (
              <article className={`poll-card${poll.status === "closed" ? " closed" : ""}`} key={poll.id}>
                <header>
                  <div><span className={`poll-category poll-category-${poll.category}`}>{categoryLabels[poll.category] || categoryLabels.other}</span><h3>{poll.question}</h3></div>
                  <span className={`poll-status ${poll.status}`}>{t(poll.status === "closed" ? "poll_closed" : "poll_open")}</span>
                </header>

                <div className="poll-options">
                  {poll.options.map((option) => {
                    const selected = option.voterIds.map(String).includes(String(voterId));
                    const peopleWhoVoted = option.voterIds.map((id) => people.find((person) => String(person.id) === String(id))).filter(Boolean);
                    const isLeader = highScore > 0 && option.voterIds.length === highScore;
                    const resultLabel = isLeader ? (poll.status === "closed" && leaders.length === 1 ? t("winner") : leaders.length > 1 ? t("tied") : t("leading")) : "";
                    return (
                      <div className={`poll-option${selected ? " selected" : ""}${isLeader ? " leader" : ""}`} key={option.id}>
                        <button type="button" className="poll-option-main" aria-pressed={selected} disabled={poll.status === "closed" || !voterId} onClick={() => toggleVote(poll.id, option.id)}>
                          <span className="poll-radio"><span /></span>
                          <span className="poll-option-copy"><strong>{option.title}</strong>{option.detail && <small>{option.detail}</small>}</span>
                          {option.price !== "" && <b>{fmt(option.price, option.currency)}</b>}
                        </button>
                        <div className="poll-option-meta">
                          <div className="poll-voter-stack" aria-label={t("poll_vote_count", { count: option.voterIds.length })}>{peopleWhoVoted.slice(0, 5).map((person) => <PersonAvatar key={person.id} person={person} people={people} index={people.findIndex((item) => item.id === person.id)} size="small" />)}{option.voterIds.length > 5 && <span>+{option.voterIds.length - 5}</span>}</div>
                          <div>{resultLabel && <span className="poll-result-label">{resultLabel}</span>}<strong>{t("poll_vote_count", { count: option.voterIds.length })}</strong>{option.url && <a href={safeUrl(option.url)} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{t("view_option")}</a>}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <footer>
                  <span>{t("people_voted", { count: totalVoters })}{creator ? ` · ${t("started_by", { name: creator.name })}` : ""}</span>
                  {canEdit && <div><button className="text-link" onClick={() => setPollStatus(poll.id, poll.status === "closed" ? "open" : "closed")}>{t(poll.status === "closed" ? "reopen_vote" : "close_vote")}</button><button className="row-action" onClick={() => removePoll(poll.id)}>{t("delete_vote")}</button></div>}
                </footer>
              </article>
            );
          })}
        </div>
      ) : !showComposer && (
        <div className="decision-empty"><strong>{t("no_votes")}</strong><span>{t("no_votes_desc")}</span><button className="text-link" onClick={() => setShowComposer(true)}>{t("new_vote")}</button></div>
      )}
    </section>
  );
}
