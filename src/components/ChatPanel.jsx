import { Fragment, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { createId } from "../storage/tripState";
import PersonAvatar from "./PersonAvatar";
import { chronologicalChatMessages } from "../utils/chatMessages";

export function chatDayKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export const CHAT_PAGE_SIZE = 15;

export function initialChatStart(messageCount, pageSize = CHAT_PAGE_SIZE) {
  return Math.max(0, messageCount - pageSize);
}

export function previousChatStart(currentStart, pageSize = CHAT_PAGE_SIZE) {
  return Math.max(0, currentStart - pageSize);
}

export default function ChatPanel() {
  const { t, locale } = useLanguage();
  const { people, chatMessages, setChatMessages, currentMemberId } = useApp();
  const orderedMessages = useMemo(() => chronologicalChatMessages(chatMessages), [chatMessages]);
  const [senderId, setSenderId] = useState(() => String(currentMemberId || people[0]?.id || ""));
  const [message, setMessage] = useState("");
  const [visibleStart, setVisibleStart] = useState(() => initialChatStart(orderedMessages.length));
  const streamRef = useRef(null);
  const prependMetricsRef = useRef(null);
  const loadingOlderRef = useRef(false);
  const stickToBottomRef = useRef(true);
  const scrollToBottomRef = useRef(true);
  const previousMessageCountRef = useRef(orderedMessages.length);
  const visibleMessages = useMemo(() => orderedMessages.slice(visibleStart), [orderedMessages, visibleStart]);

  const loadOlderMessages = useCallback(() => {
    if (loadingOlderRef.current) return;
    const stream = streamRef.current;
    setVisibleStart((currentStart) => {
      const nextStart = previousChatStart(currentStart);
      if (nextStart === currentStart) return currentStart;
      loadingOlderRef.current = true;
      prependMetricsRef.current = stream
        ? { scrollHeight: stream.scrollHeight, scrollTop: stream.scrollTop }
        : null;
      return nextStart;
    });
  }, []);

  useLayoutEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;

    if (prependMetricsRef.current) {
      const { scrollHeight, scrollTop } = prependMetricsRef.current;
      stream.scrollTop = stream.scrollHeight - scrollHeight + scrollTop;
      prependMetricsRef.current = null;
      loadingOlderRef.current = false;
      return;
    }

    if (scrollToBottomRef.current) {
      stream.scrollTop = stream.scrollHeight;
      scrollToBottomRef.current = false;
    }
  }, [visibleStart, visibleMessages.length]);

  useLayoutEffect(() => {
    const previousCount = previousMessageCountRef.current;
    const messageCount = orderedMessages.length;
    previousMessageCountRef.current = messageCount;

    if (messageCount > previousCount && stickToBottomRef.current) {
      scrollToBottomRef.current = true;
      const nextStart = initialChatStart(messageCount);
      if (nextStart !== visibleStart) {
        setVisibleStart(nextStart);
      } else if (streamRef.current) {
        streamRef.current.scrollTop = streamRef.current.scrollHeight;
        scrollToBottomRef.current = false;
      }
    } else if (messageCount < previousCount) {
      scrollToBottomRef.current = true;
      const nextStart = initialChatStart(messageCount);
      if (nextStart !== visibleStart) {
        setVisibleStart(nextStart);
      } else if (streamRef.current) {
        streamRef.current.scrollTop = streamRef.current.scrollHeight;
        scrollToBottomRef.current = false;
      }
    }
  }, [orderedMessages.length, visibleStart]);

  const handleChatScroll = () => {
    const stream = streamRef.current;
    if (!stream) return;
    stickToBottomRef.current = stream.scrollHeight - stream.scrollTop - stream.clientHeight < 48;
    if (stream.scrollTop <= 24 && visibleStart > 0) loadOlderMessages();
  };

  const sendMessage = () => {
    const text = message.trim();
    const authorId = currentMemberId || senderId || people[0]?.id;
    if (!text || !authorId) return;
    stickToBottomRef.current = true;
    setChatMessages((current) => chronologicalChatMessages([...current, {
      id: createId("message"),
      authorId,
      text,
      createdAt: new Date().toISOString(),
    }]));
    setMessage("");
  };

  return (
    <section className="chat-panel">
      <div className="chat-panel-heading">
        <div><h2>{t("group_chat")}</h2><p>{t("chat_desc")}</p></div>
      </div>

      <div ref={streamRef} className="chat-stream" role="log" aria-live="polite" onScroll={handleChatScroll}>
        {visibleStart > 0 && <div className="chat-history-hint">{t("scroll_for_older_messages")}</div>}
        {visibleStart === 0 && orderedMessages.length > CHAT_PAGE_SIZE && <div className="chat-history-hint">{t("start_of_conversation")}</div>}
        {orderedMessages.length ? visibleMessages.map((item, messageIndex) => {
          const authorIndex = people.findIndex((person) => String(person.id) === String(item.authorId));
          const author = people[authorIndex];
          const sentAt = new Date(item.createdAt);
          const dayKey = chatDayKey(item.createdAt);
          const previousDayKey = messageIndex ? chatDayKey(visibleMessages[messageIndex - 1]?.createdAt) : "";
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
