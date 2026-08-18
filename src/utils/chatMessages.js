function messageTimestamp(message) {
  const timestamp = new Date(message?.createdAt).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY;
}

export function chronologicalChatMessages(messages = []) {
  return messages
    .map((message, index) => ({ message, index, timestamp: messageTimestamp(message) }))
    .sort((left, right) => left.timestamp - right.timestamp || left.index - right.index)
    .map(({ message }) => message);
}
