import { buildLogisticsExpenses } from "./logisticsCosts";
import { calculateSettlements } from "../utils";
import { reconcileLogisticsPayments, reconcileSettlementPayments } from "./settlementPayments";

export function getTripExpenses({
  expenses = [],
  accommodations = [],
  vehicles = [],
  flights = [],
  otherCosts = [],
} = {}) {
  return [
    ...expenses,
    ...buildLogisticsExpenses({ accommodations, vehicles, flights, otherCosts }),
  ];
}

export function getTripPayments({ settlementPayments = [], logisticsPayments = [] } = {}) {
  return [...settlementPayments, ...logisticsPayments];
}

export function reconcileTripFinancials(state) {
  const logisticsExpenses = buildLogisticsExpenses({
    accommodations: state.accommodations,
    vehicles: state.vehicles,
    flights: state.flights,
    otherCosts: state.otherCosts,
  });
  const allExpenses = [...(state.expenses || []), ...logisticsExpenses];
  const logisticsPayments = reconcileLogisticsPayments(logisticsExpenses, state.logisticsPayments || []);
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
    settlementPayments,
    logisticsPayments,
    paymentRoutes,
  };
}

export function removePaymentFromTripState(state, paymentId) {
  const matchesPayment = (payment) => String(payment.id) === String(paymentId);
  const settlementPayments = (state.settlementPayments || []).filter((payment) => !matchesPayment(payment));
  const logisticsPayments = (state.logisticsPayments || []).filter((payment) => !matchesPayment(payment));

  if (
    settlementPayments.length === (state.settlementPayments || []).length
    && logisticsPayments.length === (state.logisticsPayments || []).length
  ) return state;

  return {
    ...state,
    settlementPayments,
    logisticsPayments,
  };
}
