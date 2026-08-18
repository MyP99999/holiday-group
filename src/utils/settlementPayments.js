import { calculateBalances, calculateSettlements, convert, getExpenseShares } from "../utils";

const PAYMENT_EPSILON = 0.005;

function paymentExpenseId(payment) {
  return String(payment?.expenseId || payment?.logisticsExpenseId || "");
}

function buildExpenseObligations(expenses = []) {
  return expenses.flatMap((expense) => {
    const payeeId = String(expense.paidById || "");
    if (!payeeId) return [];

    return getExpenseShares(expense).flatMap(({ personId, amount }) => {
      const payerId = String(personId);
      const amountEUR = convert(amount, expense.currency, "EUR");
      if (payerId === payeeId || amountEUR <= PAYMENT_EPSILON) return [];

      return [{
        from: payerId,
        to: payeeId,
        amountEUR,
        expenseId: String(expense.id),
        expenseSource: expense.source || "expense",
        reason: String(expense.description || "Expense"),
        settlementMethod: "expense",
      }];
    });
  });
}

function findPathFrom(obligations, fromId, toId, initiallyVisited = new Set()) {
  const start = String(fromId);
  const target = String(toId);
  const queue = [{ node: start, path: [], visited: new Set([...initiallyVisited, start]) }];

  while (queue.length) {
    const current = queue.shift();
    if (current.node === target) return current.path;

    obligations.forEach((obligation, index) => {
      if (obligation.amountEUR <= PAYMENT_EPSILON || obligation.from !== current.node) return;
      if (current.visited.has(obligation.to)) return;
      queue.push({
        node: obligation.to,
        path: [...current.path, index],
        visited: new Set([...current.visited, obligation.to]),
      });
    });
  }

  return null;
}

function findObligationPath(obligations, payment) {
  const fromId = String(payment.fromId);
  const toId = String(payment.toId);
  const preferredExpenseId = paymentExpenseId(payment);

  if (preferredExpenseId) {
    const preferredStarts = obligations
      .map((obligation, index) => ({ obligation, index }))
      .filter(({ obligation }) => (
        obligation.amountEUR > PAYMENT_EPSILON
        && obligation.from === fromId
        && obligation.expenseId === preferredExpenseId
      ));

    for (const { obligation, index } of preferredStarts) {
      if (obligation.to === toId) return [index];
      const tail = findPathFrom(obligations, obligation.to, toId, new Set([fromId]));
      if (tail) return [index, ...tail];
    }
  }

  return findPathFrom(obligations, fromId, toId);
}

function reasonedOptimizedSettlements(people, expenses, payments) {
  const { transactions } = calculateSettlements(people, expenses, payments);
  const usedByPayerAndExpense = {};

  return transactions.flatMap((transaction) => {
    let remainingEUR = transaction.amountEUR;
    const rows = [];
    const reasons = getSettlementPaymentReasons(transaction, expenses, payments);

    reasons.forEach((reason) => {
      if (remainingEUR <= PAYMENT_EPSILON) return;
      const usageKey = `${transaction.from}:${reason.expenseId}`;
      const availableEUR = Math.max(0, reason.remainingEUR - (usedByPayerAndExpense[usageKey] || 0));
      const amountEUR = Math.min(remainingEUR, availableEUR);
      if (amountEUR <= PAYMENT_EPSILON) return;

      rows.push({
        ...transaction,
        amountEUR,
        expenseId: reason.expenseId,
        expenseSource: reason.source,
        reason: reason.title,
        settlementMethod: "expense",
      });
      usedByPayerAndExpense[usageKey] = (usedByPayerAndExpense[usageKey] || 0) + amountEUR;
      remainingEUR -= amountEUR;
    });

    if (remainingEUR > PAYMENT_EPSILON) rows.push({ ...transaction, amountEUR: remainingEUR });
    return rows;
  });
}

export function calculateExpenseSettlements(people, expenses, payments = []) {
  const obligations = buildExpenseObligations(expenses);

  for (const payment of payments) {
    let remainingEUR = Number(payment.amountEUR) || 0;
    if (remainingEUR <= PAYMENT_EPSILON) continue;

    while (remainingEUR > PAYMENT_EPSILON) {
      const path = findObligationPath(obligations, payment);
      if (!path?.length) return reasonedOptimizedSettlements(people, expenses, payments);
      const amountEUR = Math.min(remainingEUR, ...path.map((index) => obligations[index].amountEUR));
      path.forEach((index) => { obligations[index].amountEUR -= amountEUR; });
      remainingEUR -= amountEUR;
    }
  }

  return obligations.filter((obligation) => obligation.amountEUR > PAYMENT_EPSILON);
}

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

  if (payment.settlementMethod === "expense" && paymentExpenseId(payment)) {
    const expenseId = paymentExpenseId(payment);
    const expense = (expenses || []).find((item) => String(item.id) === expenseId);
    const share = expense && getExpenseShares(expense).find((item) => String(item.personId) === String(payment.fromId));
    const shareEUR = convert(share?.amount || 0, expense?.currency, "EUR");
    const alreadyPaidEUR = otherPayments
      .filter((item) => String(item.fromId) === String(payment.fromId) && paymentExpenseId(item) === expenseId)
      .reduce((total, item) => total + (Number(item.amountEUR) || 0), 0);
    return Math.max(0, shareEUR - alreadyPaidEUR);
  }

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
    if (originalAmount <= PAYMENT_EPSILON) return;

    if (payment.settlementMethod === "expense" && paymentExpenseId(payment)) {
      const expenseId = paymentExpenseId(payment);
      const expense = (expenses || []).find((item) => String(item.id) === expenseId);
      const payeeId = String(expense?.paidById || "");
      if (!expense || String(payment.toId) !== payeeId || String(payment.fromId) === payeeId) return;
      const share = expense && getExpenseShares(expense).find((item) => String(item.personId) === String(payment.fromId));
      const shareEUR = convert(share?.amount || 0, expense?.currency, "EUR");
      const previousPayments = [...fixedPayments, ...accepted];
      const alreadyPaidEUR = previousPayments
        .filter((item) => String(item.fromId) === String(payment.fromId) && paymentExpenseId(item) === expenseId)
        .reduce((total, item) => total + (Number(item.amountEUR) || 0), 0);
      const acceptedAmount = Math.min(originalAmount, Math.max(0, shareEUR - alreadyPaidEUR));
      if (acceptedAmount <= PAYMENT_EPSILON) return;
      accepted.push({
        ...payment,
        amountEUR: acceptedAmount,
        isPartial: Boolean(payment.isPartial || acceptedAmount + 0.01 < originalAmount),
      });
      return;
    }

    const { transactions } = calculateSettlements(people, expenses, [...fixedPayments, ...accepted]);
    const matchingTransaction = transactions.find((transaction) => (
      String(transaction.from) === String(payment.fromId)
      && String(transaction.to) === String(payment.toId)
    ));
    const acceptedAmount = Math.min(originalAmount, matchingTransaction?.amountEUR || 0);
    if (acceptedAmount <= PAYMENT_EPSILON) return;

    accepted.push({
      ...payment,
      amountEUR: acceptedAmount,
      isPartial: Boolean(payment.isPartial || acceptedAmount + 0.01 < originalAmount),
    });
  });

  return accepted;
}

export function reconcileLogisticsPayments(logisticsExpenses = [], logisticsPayments = []) {
  const expensesById = new Map(logisticsExpenses.map((expense) => [String(expense.id), expense]));
  const paidByObligation = new Map();
  const accepted = [];

  logisticsPayments.forEach((payment) => {
    const expenseId = paymentExpenseId(payment);
    const expense = expensesById.get(expenseId);
    const fromId = String(payment.fromId || "");
    const toId = String(payment.toId || "");
    const payeeId = String(expense?.paidById || "");
    const originalAmount = Number(payment.amountEUR) || 0;

    if (!expense || !fromId || toId !== payeeId || fromId === payeeId || originalAmount <= PAYMENT_EPSILON) return;

    const share = getExpenseShares(expense).find((item) => String(item.personId) === fromId);
    const shareEUR = convert(share?.amount || 0, expense.currency, "EUR");
    const obligationKey = `${expenseId}:${fromId}:${payeeId}`;
    const alreadyPaidEUR = paidByObligation.get(obligationKey) || 0;
    const acceptedAmount = Math.min(originalAmount, Math.max(0, shareEUR - alreadyPaidEUR));
    if (acceptedAmount <= PAYMENT_EPSILON) return;

    paidByObligation.set(obligationKey, alreadyPaidEUR + acceptedAmount);
    accepted.push({
      ...payment,
      amountEUR: acceptedAmount,
      isPartial: Boolean(payment.isPartial || acceptedAmount + 0.01 < originalAmount),
    });
  });

  return accepted;
}
