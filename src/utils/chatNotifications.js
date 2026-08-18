import { chronologicalChatMessages } from "./chatMessages";

export function unreadMessages(messages = [], lastReadMessageId = "", currentMemberId = "") {
  const orderedMessages = chronologicalChatMessages(messages);
  const markerIndex = lastReadMessageId
    ? orderedMessages.findIndex((message) => String(message.id) === String(lastReadMessageId))
    : -1;
  const candidates = markerIndex >= 0 ? orderedMessages.slice(markerIndex + 1) : orderedMessages;

  return candidates.filter((message) => (
    !currentMemberId || String(message.authorId) !== String(currentMemberId)
  ));
}

export function unreadBadge(count = 0) {
  const safeCount = Math.max(0, Number(count) || 0);
  return safeCount > 9 ? "9+" : String(safeCount);
}
