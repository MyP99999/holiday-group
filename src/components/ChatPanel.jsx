import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { createId } from "../storage/tripState";
import PersonAvatar from "./PersonAvatar";

export default function ChatPanel({ compact = false }) {
  const navigate = useNavigate();
  const { t, locale } = useLanguage();
  const { people, chatMessages, setChatMessages, currentMemberId } = useApp();
  const [senderId, setSenderId] = useState(() => String(currentMemberId || people[0]?.id || ""));
  const [message, setMessage] = useState("");
  const visibleMessages = useMemo(
    () => compact ? chatMessages.slice(-4) : chatMessages,
    [chatMessages, compact]
  );

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
    <section className={`chat-panel${compact ? " compact-chat" : ""}`}>
      <div className="chat-panel-heading">
        <div><h2>{t("group_chat")}</h2>{!compact && <p>{t("chat_desc")}</p>}</div>
        {compact && <button className="text-link" onClick={() => navigate("../chat")}>{t("chat")}</button>}
      </div>

      <div className="chat-stream" aria-live="polite">
        {visibleMessages.length ? visibleMessages.map((item) => {
          const authorIndex = people.findIndex((person) => String(person.id) === String(item.authorId));
          const author = people[authorIndex];
          return (
            <article className="chat-message" key={item.id}>
              <PersonAvatar person={author} people={people} index={authorIndex} />
              <div><p><strong>{author?.name || "Member"}</strong><time>{new Date(item.createdAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}</time></p><span>{item.text}</span></div>
            </article>
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
