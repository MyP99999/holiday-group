import { calculateBalances, calculateSettlements, convert, getExpenseShares } from "../utils";

export function canConfirmSettlementPayment(transaction, currentMemberId, canManageMembers) {
  return Boolean(
    transaction && (
      canManageMembers ||
      (currentMemberId && String(transaction.from) === String(currentMemberId))
    )
  );
}

export function resolveSettlementPaymentAmountEUR(amount, currency, maximumAmountEUR) {
  const numeric = Number(amount);
  const maximum = Number(maximumAmountEUR);
  if (!Number.isFinite(numeric) || numeric <= 0 || !Number.isFinite(maximum) || maximum <= 0) return null;

  const converted = convert(numeric, currency, "EUR");
  if (!converted || converted - maximum > 0.01) return null;
  return maximum - converted < 0.01 ? maximum : converted;
}

export function editablePaymentLimitEUR(people, expenses, payments, paymentId) {
  const payment = (payments || []).find((item) => String(item.id) === String(paymentId));
  if (!payment) return 0;
  const otherPayments = (payments || []).filter((item) => String(item.id) !== String(paymentId));
  const balances = calculateBalances(people || [], expenses || [], otherPayments);
  const debtorAmount = Math.max(0, -(balances[String(payment.fromId)] || 0));
  const creditorAmount = Math.max(0, balances[String(payment.toId)] || 0);
  return Math.min(debtorAmount, creditorAmount);
}

export function toLocalDateTimeInput(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function normalizeSettlementPaymentReason(reason) {
  const normalized = String(reason ?? "").trim();
  return normalized ? normalized.slice(0, 120) : null;
}

export function getSettlementPaymentReasons(transaction, expenses = [], payments = []) {
  if (!transaction) return [];
  const payerId = String(transaction.from);
  const preferredPayeeId = String(transaction.to);
  const reasons = expenses.flatMap((expense, index) => {
    const payeeId = String(expense.paidById || "");
    const share = getExpenseShares(expense).find((item) => String(item.personId) === payerId);
    const amountEUR = convert(share?.amount || 0, expense.currency, "EUR");
    if (!payeeId || payeeId === payerId || amountEUR <= 0.005) return [];

    return [{
      expenseId: String(expense.id),
      title: String(expense.description || "Expense"),
      payeeId,
      source: expense.source || "expense",
      remainingEUR: amountEUR,
      index,
    }];
  });

  payments
    .filter((payment) => String(payment.fromId) === payerId && Number(payment.amountEUR) > 0.005)
    .forEach((payment) => {
      let availableEUR = Number(payment.amountEUR);
      const recordedExpenseId = String(payment.expenseId || payment.logisticsExpenseId || "");
      const recordedReason = normalizeSettlementPaymentReason(payment.reason || payment.logisticsTitle);
      const exactCandidates = reasons.filter((reason) => (
        reason.remainingEUR > 0.005
        && (
          (recordedExpenseId && reason.expenseId === recordedExpenseId)
          || (!recordedExpenseId && recordedReason && reason.title === recordedReason)
        )
      ));
      const fallbackCandidates = reasons
        .filter((reason) => reason.remainingEUR > 0.005 && !exactCandidates.includes(reason))
        .sort((left, right) => Number(right.payeeId === String(payment.toId)) - Number(left.payeeId === String(payment.toId)));

      [...exactCandidates, ...fallbackCandidates].forEach((reason) => {
        if (availableEUR <= 0.005) return;
        const appliedEUR = Math.min(availableEUR, reason.remainingEUR);
        reason.remainingEUR = Math.max(0, reason.remainingEUR - appliedEUR);
        availableEUR -= appliedEUR;
      });
    });

  return reasons
    .filter((reason) => reason.remainingEUR > 0.005)
    .sort((left, right) => (
      Number(right.payeeId === preferredPayeeId) - Number(left.payeeId === preferredPayeeId)
      || left.index - right.index
    ))
    .map(({ index, ...reason }) => reason);
}

export function reconcileSettlementPayments(
  people,
  expenses,
  settlementPayments = [],
  fixedPayments = []
) {
  const accepted = [];

  settlementPayments.forEach((payment) => {
    const originalAmount = Number(payment.amountEUR) || 0;
    if (originalAmount <= 0.005) return;

    const { transactions } = calculateSettlements(people, expenses, [...fixedPayments, ...accepted]);
    const matchingTransaction = transactions.find((transaction) => (
      String(transaction.from) === String(payment.fromId)
      && String(transaction.to) === String(payment.toId)
    ));
    const acceptedAmount = Math.min(originalAmount, matchingTransaction?.amountEUR || 0);
    if (acceptedAmount <= 0.005) return;

    accepted.push({
      ...payment,
      amountEUR: acceptedAmount,
      isPartial: Boolean(payment.isPartial || acceptedAmount + 0.01 < originalAmount),
    });
  });

  return accepted;
}
