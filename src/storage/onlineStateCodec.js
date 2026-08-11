const OTHER_COST_STORAGE_TYPE = "logistics-other-cost";
const LOGISTICS_PAYMENT_STORAGE_TYPE = "logistics-payment";
const ACTIVITY_STORAGE_TYPE = "activity-entry";
const TRIP_DATES_STORAGE_TYPE = "trip-dates";
const TRIP_DATES_STORAGE_ID = "__trip-dates__";

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
  const embeddedActivityLog = settlementPayments
    .filter((item) => item?.storageType === ACTIVITY_STORAGE_TYPE)
    .map(withoutStorageType);
  const embeddedTripDates = settlementPayments.find((item) => item?.storageType === TRIP_DATES_STORAGE_TYPE);

  return {
    ...state,
    expenses: expenses.filter((item) => item?.storageType !== OTHER_COST_STORAGE_TYPE),
    otherCosts: mergeById(state.otherCosts || [], embeddedOtherCosts),
    settlementPayments: settlementPayments.filter((item) => item?.storageType !== LOGISTICS_PAYMENT_STORAGE_TYPE && item?.source !== "logistics" && item?.storageType !== ACTIVITY_STORAGE_TYPE && item?.storageType !== TRIP_DATES_STORAGE_TYPE),
    logisticsPayments: mergeById(state.logisticsPayments || [], embeddedLogisticsPayments),
    activityLog: mergeById(state.activityLog || [], embeddedActivityLog),
    tripStartDate: state.tripStartDate || embeddedTripDates?.startDate || "",
    tripEndDate: state.tripEndDate || embeddedTripDates?.endDate || "",
  };
}

export function packOnlineTripState(state = {}) {
  const expenses = (state.expenses || []).filter((item) => item?.storageType !== OTHER_COST_STORAGE_TYPE);
  const settlementPayments = (state.settlementPayments || [])
    .filter((item) => item?.storageType !== LOGISTICS_PAYMENT_STORAGE_TYPE && item?.source !== "logistics" && item?.storageType !== ACTIVITY_STORAGE_TYPE && item?.storageType !== TRIP_DATES_STORAGE_TYPE);

  return {
    ...state,
    expenses: [
      ...expenses,
      ...(state.otherCosts || []).map((cost) => ({ ...cost, storageType: OTHER_COST_STORAGE_TYPE })),
    ],
    settlementPayments: [
      ...settlementPayments,
      ...(state.logisticsPayments || []).map((payment) => ({ ...payment, storageType: LOGISTICS_PAYMENT_STORAGE_TYPE })),
      ...(state.activityLog || []).map((entry) => ({ ...entry, storageType: ACTIVITY_STORAGE_TYPE })),
      ...((state.tripStartDate || state.tripEndDate) ? [{
        id: TRIP_DATES_STORAGE_ID,
        storageType: TRIP_DATES_STORAGE_TYPE,
        startDate: state.tripStartDate || "",
        endDate: state.tripEndDate || "",
      }] : []),
    ],
  };
}
