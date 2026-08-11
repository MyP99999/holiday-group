import { appendActivity, changedActivityFields, createActivityEntry } from "./activityLog";

test("creates a stable audit entry and prepends it to trip activity", () => {
  const entry = createActivityEntry({
    type: "expense_edited",
    actor: { id: "admin", name: "Maya" },
    subject: { id: "expense", description: "Dinner" },
    fields: ["amount", "amount", "payer"],
    createdAt: "2026-08-11T12:00:00.000Z",
  });
  const result = appendActivity({ activityLog: [{ id: "older" }] }, entry);

  expect(entry).toEqual(expect.objectContaining({
    type: "expense_edited",
    actorId: "admin",
    actorName: "Maya",
    subjectName: "Dinner",
    fields: ["amount", "payer"],
  }));
  expect(result.activityLog.map((item) => item.id)).toEqual([entry.id, "older"]);
});

test("finds only fields that changed", () => {
  expect(changedActivityFields(
    { amount: 10, currency: "EUR", payer: "a" },
    { amount: 12, currency: "EUR", payer: "b" },
    { amount: "amount", currency: "currency", payer: "payer" }
  )).toEqual(["amount", "payer"]);
});
