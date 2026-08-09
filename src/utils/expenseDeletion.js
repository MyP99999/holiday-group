import { calculateSettlements } from "../utils";
import { buildLogisticsExpenses } from "./logisticsCosts";
import { reconcileSettlementPayments } from "./settlementPayments";

export function removeExpenseFromTripState(state, expenseId) {
  const expenses = (state.expenses || []).filter((expense) => String(expense.id) !== String(expenseId));
  if (expenses.length === (state.expenses || []).length) return state;

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
