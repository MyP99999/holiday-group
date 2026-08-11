import { createId } from "../storage/tripState";

export function createActivityEntry({ type, actor, subject, fields = [], createdAt = new Date().toISOString() }) {
  return {
    id: createId("activity"),
    type,
    actorId: actor?.id ? String(actor.id) : "",
    actorName: actor?.name || "Admin",
    subjectId: subject?.id ? String(subject.id) : "",
    subjectName: subject?.name || subject?.description || subject?.title || "",
    fields: [...new Set(fields.filter(Boolean))],
    createdAt,
  };
}

export function appendActivity(state, entry) {
  return { ...state, activityLog: [entry, ...(state.activityLog || [])].slice(0, 500) };
}

export function changedActivityFields(before = {}, after = {}, fieldMap = {}) {
  return Object.entries(fieldMap).flatMap(([field, key]) => (
    String(before[field] ?? "") === String(after[field] ?? "") ? [] : [key]
  ));
}
