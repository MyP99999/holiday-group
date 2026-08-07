import { EUR_RATES, CURRENCY_SYMBOLS, PERSON_COLORS } from "./constants";

export function convert(amount, from = "EUR", to = "EUR") {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || !EUR_RATES[from] || !EUR_RATES[to]) return 0;
  return (numeric / EUR_RATES[from]) * EUR_RATES[to];
}

export function fmt(value, currency = "EUR") {
  const numeric = Number(value) || 0;
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const formatted = numeric.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return symbol.length > 2 ? `${symbol} ${formatted}` : `${symbol}${formatted}`;
}

export function personColor(index, person) {
  if (person?.color) return person.color;
  if (index < PERSON_COLORS.length) return PERSON_COLORS[Math.max(0, index)];
  return `hsl(${Math.round(index * 137.508) % 360} 42% 43%)`;
}

export function getExpenseShares(expense) {
  if (expense.shares && Object.keys(expense.shares).length) {
    return Object.entries(expense.shares).map(([personId, amount]) => ({
      personId: String(personId),
      amount: Number(amount) || 0,
    }));
  }

  const participantIds = expense.participantIds || [];
  const share = participantIds.length ? Number(expense.amount) / participantIds.length : 0;
  return participantIds.map((personId) => ({ personId: String(personId), amount: share }));
}

export function calculateBalances(people, expenses, settlementPayments = []) {
  const balances = Object.fromEntries(people.map((person) => [String(person.id), 0]));

  expenses.forEach((expense) => {
    const paidById = String(expense.paidById);
    if (balances[paidById] === undefined) return;
    balances[paidById] += convert(expense.amount, expense.currency, "EUR");
    getExpenseShares(expense).forEach(({ personId, amount }) => {
      if (balances[personId] !== undefined) {
        balances[personId] -= convert(amount, expense.currency, "EUR");
      }
    });
  });

  settlementPayments.forEach((payment) => {
    const fromId = String(payment.fromId);
    const toId = String(payment.toId);
    const amountEUR = Number(payment.amountEUR) || 0;
    if (balances[fromId] !== undefined) balances[fromId] += amountEUR;
    if (balances[toId] !== undefined) balances[toId] -= amountEUR;
  });

  return balances;
}

export function calculateSettlements(people, expenses, settlementPayments = []) {
  const balances = calculateBalances(people, expenses, settlementPayments);
  const creditors = Object.entries(balances)
    .filter(([, balance]) => balance > 0.005)
    .map(([id, amount]) => ({ id, amount }));
  const debtors = Object.entries(balances)
    .filter(([, balance]) => balance < -0.005)
    .map(([id, amount]) => ({ id, amount: -amount }));

  const transactions = [];
  let creditorIndex = 0;
  let debtorIndex = 0;
  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amountEUR = Math.min(creditor.amount, debtor.amount);
    transactions.push({ from: debtor.id, to: creditor.id, amountEUR });
    creditor.amount -= amountEUR;
    debtor.amount -= amountEUR;
    if (creditor.amount < 0.005) creditorIndex += 1;
    if (debtor.amount < 0.005) debtorIndex += 1;
  }

  return { balances, transactions };
}
