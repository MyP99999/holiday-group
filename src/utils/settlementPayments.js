import { calculateSettlements, convert } from "../utils";

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
