import { Fragment, useState } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { createId } from "../storage/tripState";
import PersonAvatar from "./PersonAvatar";

export function chatDayKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export default function ChatPanel() {
  const { t, locale } = useLanguage();
  const { people, chatMessages, setChatMessages, currentMemberId } = useApp();
  const [senderId, setSenderId] = useState(() => String(currentMemberId || people[0]?.id || ""));
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const text = message.trim();
    const authorId = currentMemberId || senderId || people[0]?.id;
    if (!text || !authorId) return;
    setChatMessages((current) => [...current, {
      id: createId("message"),
      authorId,
      text,
      createdAt: new Date().toISOString(),
    }]);
    setMessage("");
  };

  return (
    <section className="chat-panel">
      <div className="chat-panel-heading">
        <div><h2>{t("group_chat")}</h2><p>{t("chat_desc")}</p></div>
      </div>

      <div className="chat-stream" aria-live="polite">
        {chatMessages.length ? chatMessages.map((item, messageIndex) => {
          const authorIndex = people.findIndex((person) => String(person.id) === String(item.authorId));
          const author = people[authorIndex];
          const sentAt = new Date(item.createdAt);
          const dayKey = chatDayKey(item.createdAt);
          const previousDayKey = messageIndex ? chatDayKey(chatMessages[messageIndex - 1]?.createdAt) : "";
          return (
            <Fragment key={item.id}>
              {dayKey && dayKey !== previousDayKey && (
                <div className="chat-day-separator"><time dateTime={dayKey}>{sentAt.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</time></div>
              )}
              <article className="chat-message">
                <PersonAvatar person={author} people={people} index={authorIndex} />
                <div><p><strong>{author?.name || t("member")}</strong><time dateTime={item.createdAt} title={sentAt.toLocaleString(locale)}>{sentAt.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}</time></p><span>{item.text}</span></div>
              </article>
            </Fragment>
          );
        }) : <div className="chat-empty"><strong>{t("no_messages")}</strong><span>{t("no_messages_desc")}</span></div>}
      </div>

      <div className="chat-composer">
        {!currentMemberId && people.length > 1 && (
          <label><span>{t("sending_as")}</span><select value={senderId} onChange={(event) => setSenderId(event.target.value)}>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
        )}
        <div className="chat-input-row">
          <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} placeholder={t("type_message")} />
          <button className="button primary" onClick={sendMessage}>{t("send")}</button>
        </div>
        <small>{t("visible_all")}</small>
      </div>
    </section>
  );
}
