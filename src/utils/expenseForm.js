export function expenseToForm(expense = {}) {
  const participantIds = Array.isArray(expense.participantIds) && expense.participantIds.length
    ? expense.participantIds.map(String)
    : Object.keys(expense.shares || {});

  return {
    description: String(expense.description || ""),
    amount: expense.amount === undefined || expense.amount === null ? "" : String(expense.amount),
    currency: expense.currency || "EUR",
    paidById: expense.paidById === undefined || expense.paidById === null ? "" : String(expense.paidById),
    participantIds: [...new Set(participantIds)],
    splitMode: expense.shares && Object.keys(expense.shares).length ? "custom" : "equal",
    shares: Object.fromEntries(
      Object.entries(expense.shares || {}).map(([personId, amount]) => [String(personId), String(amount)])
    ),
  };
}

export function validateExpenseForm(form = {}) {
  const amount = Number(form.amount);
  const participantIds = [...new Set((form.participantIds || []).map(String))];

  if (
    !String(form.description || "").trim()
    || !Number.isFinite(amount)
    || amount <= 0
    || !String(form.paidById || "")
    || !participantIds.length
  ) {
    return { error: "required" };
  }

  let shares = null;
  if (form.splitMode === "custom") {
    shares = Object.fromEntries(
      participantIds.map((personId) => [personId, Number(form.shares?.[personId]) || 0])
    );
    const shareTotal = Object.values(shares).reduce((sum, value) => sum + value, 0);
    if (Math.abs(shareTotal - amount) > 0.01) return { error: "shares_total", amount };
  }

  return {
    value: {
      description: String(form.description).trim(),
      amount,
      currency: form.currency || "EUR",
      paidById: String(form.paidById),
      participantIds,
      shares,
    },
  };
}
