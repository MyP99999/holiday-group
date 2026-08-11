import { calculateSettlements } from "../utils";
import { buildLogisticsExpenses } from "./logisticsCosts";
import { reconcileSettlementPayments } from "./settlementPayments";

function reconcileExpenseMutation(state, expenses) {
  const logisticsExpenses = buildLogisticsExpenses({
    accommodations: state.accommodations,
    vehicles: state.vehicles,
    flights: state.flights,
    otherCosts: state.otherCosts,
  });
  const allExpenses = [...expenses, ...logisticsExpenses];
  const logisticsPayments = state.logisticsPayments || [];
  const settlementPayments = reconcileSettlementPayments(
    state.people || [],
    allExpenses,
    state.settlementPayments || [],
    logisticsPayments
  );
  const activeRouteKeys = new Set(
    calculateSettlements(
      state.people || [],
      allExpenses,
      [...settlementPayments, ...logisticsPayments]
    ).transactions.map((transaction) => `${transaction.from}:${transaction.to}`)
  );
  const paymentRoutes = Object.fromEntries(
    Object.entries(state.paymentRoutes || {}).filter(([key]) => activeRouteKeys.has(key))
  );

  return {
    ...state,
    expenses,
    settlementPayments,
    paymentRoutes,
  };
}

export function removeExpenseFromTripState(state, expenseId) {
  const expenses = (state.expenses || []).filter((expense) => String(expense.id) !== String(expenseId));
  if (expenses.length === (state.expenses || []).length) return state;
  return reconcileExpenseMutation(state, expenses);
}

export function updateExpenseInTripState(state, expenseId, updates) {
  let found = false;
  const expenses = (state.expenses || []).map((expense) => {
    if (String(expense.id) !== String(expenseId)) return expense;
    found = true;
    const next = { ...expense, ...updates, id: expense.id };
    if (updates.shares === null) delete next.shares;
    return next;
  });
  if (!found) return state;
  return reconcileExpenseMutation(state, expenses);
}
