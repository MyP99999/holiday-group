const OTHER_COST_STORAGE_TYPE = "logistics-other-cost";
const LOGISTICS_PAYMENT_STORAGE_TYPE = "logistics-payment";

function withoutStorageType(item) {
  const { storageType, ...value } = item;
  return value;
}

function mergeById(...collections) {
  const values = new Map();
  collections.flat().forEach((item) => {
    if (!item?.id) return;
    values.set(String(item.id), item);
  });
  return [...values.values()];
}

export function unpackOnlineTripState(state = {}) {
  const expenses = Array.isArray(state.expenses) ? state.expenses : [];
  const settlementPayments = Array.isArray(state.settlementPayments) ? state.settlementPayments : [];
  const embeddedOtherCosts = expenses
    .filter((item) => item?.storageType === OTHER_COST_STORAGE_TYPE)
    .map(withoutStorageType);
  const embeddedLogisticsPayments = settlementPayments
    .filter((item) => item?.storageType === LOGISTICS_PAYMENT_STORAGE_TYPE || item?.source === "logistics")
    .map(withoutStorageType);

  return {
    ...state,
    expenses: expenses.filter((item) => item?.storageType !== OTHER_COST_STORAGE_TYPE),
    otherCosts: mergeById(state.otherCosts || [], embeddedOtherCosts),
    settlementPayments: settlementPayments.filter((item) => item?.storageType !== LOGISTICS_PAYMENT_STORAGE_TYPE && item?.source !== "logistics"),
    logisticsPayments: mergeById(state.logisticsPayments || [], embeddedLogisticsPayments),
  };
}

export function packOnlineTripState(state = {}) {
  const expenses = (state.expenses || []).filter((item) => item?.storageType !== OTHER_COST_STORAGE_TYPE);
  const settlementPayments = (state.settlementPayments || [])
    .filter((item) => item?.storageType !== LOGISTICS_PAYMENT_STORAGE_TYPE && item?.source !== "logistics");

  return {
    ...state,
    expenses: [
      ...expenses,
      ...(state.otherCosts || []).map((cost) => ({ ...cost, storageType: OTHER_COST_STORAGE_TYPE })),
    ],
    settlementPayments: [
      ...settlementPayments,
      ...(state.logisticsPayments || []).map((payment) => ({ ...payment, storageType: LOGISTICS_PAYMENT_STORAGE_TYPE })),
    ],
  };
}
