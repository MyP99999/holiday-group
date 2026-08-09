import { convert } from "../utils";

export function uniqueIds(ids = []) {
  return [...new Set(ids.filter((id) => id !== null && id !== undefined && id !== "").map(String))];
}

export function getStayShares(stay) {
  const total = Number(stay.price) || 0;
  const shares = {};
  if (stay.splitMode === "people") {
    const participants = uniqueIds(stay.participantIds);
    if (!participants.length) return shares;
    participants.forEach((id) => { shares[id] = total / participants.length; });
    return shares;
  }

  const occupiedRooms = (stay.rooms || []).filter((room) => room.occupantIds?.length);
  if (!occupiedRooms.length) return shares;
  const perRoom = total / occupiedRooms.length;
  occupiedRooms.forEach((room) => {
    const occupants = uniqueIds(room.occupantIds);
    occupants.forEach((id) => { shares[id] = (shares[id] || 0) + perRoom / occupants.length; });
  });
  return shares;
}

export function getRentalShares(vehicle) {
  const participants = uniqueIds(vehicle.rentalParticipantIds);
  const total = Number(vehicle.rentalPrice) || 0;
  if (!vehicle.rentalEnabled || !participants.length) return {};
  return Object.fromEntries(participants.map((id) => [id, total / participants.length]));
}

export function getFlightShares(flight) {
  return getEqualShares(flight.price, flight.participantIds);
}

export function getOtherCostShares(cost) {
  return getEqualShares(cost.amount, cost.participantIds);
}

function getEqualShares(amount, participantIds) {
  const participants = uniqueIds(participantIds);
  const total = Number(amount) || 0;
  if (!participants.length) return {};
  return Object.fromEntries(participants.map((id) => [id, total / participants.length]));
}

function asExpense(type, item, { description, amount, currency, paidById, shares, createdAt }) {
  return {
    id: `logistics:${type}:${item.id}`,
    logisticsType: type,
    logisticsId: String(item.id),
    description,
    amount: Number(amount) || 0,
    currency: currency || "EUR",
    paidById: String(paidById || ""),
    participantIds: Object.keys(shares),
    shares,
    source: "logistics",
    date: createdAt || new Date(0).toISOString(),
  };
}

export function buildLogisticsExpenses({ accommodations = [], vehicles = [], flights = [], otherCosts = [] } = {}) {
  const items = [
    ...accommodations.map((stay) => asExpense("accommodation", stay, {
      description: stay.name || "Accommodation",
      amount: stay.price,
      currency: stay.currency,
      paidById: stay.paidById,
      shares: getStayShares(stay),
      createdAt: stay.createdAt,
    })),
    ...vehicles.filter((vehicle) => vehicle.rentalEnabled).map((vehicle) => asExpense("rental", vehicle, {
      description: vehicle.name || "Car rental",
      amount: vehicle.rentalPrice,
      currency: vehicle.rentalCurrency,
      paidById: vehicle.rentalPaidById,
      shares: getRentalShares(vehicle),
      createdAt: vehicle.createdAt,
    })),
    ...flights.map((flight) => asExpense("flight", flight, {
      description: [flight.flightNumber || flight.airline, flight.from && flight.to ? `${flight.from} → ${flight.to}` : ""].filter(Boolean).join(" · ") || "Flight",
      amount: flight.price,
      currency: flight.currency,
      paidById: flight.paidById,
      shares: getFlightShares(flight),
      createdAt: flight.createdAt,
    })),
    ...otherCosts.map((cost) => asExpense("other", cost, {
      description: cost.title || "Other cost",
      amount: cost.amount,
      currency: cost.currency,
      paidById: cost.paidById,
      shares: getOtherCostShares(cost),
      createdAt: cost.createdAt,
    })),
  ];

  return items.filter((item) => item.amount > 0 && item.paidById && item.participantIds.length);
}

export function logisticsObligations(logisticsExpenses, logisticsPayments, outputCurrency = "EUR", settlementPayments = []) {
  const paymentsByTargetAndPerson = {};
  logisticsPayments.forEach((payment) => {
    const key = `${payment.logisticsExpenseId}:${String(payment.fromId)}:${String(payment.toId)}`;
    paymentsByTargetAndPerson[key] = (paymentsByTargetAndPerson[key] || 0)
      + convert(payment.amountEUR, "EUR", outputCurrency);
  });

  const obligations = [];
  logisticsExpenses.forEach((expense) => {
    Object.entries(expense.shares || {}).forEach(([personId, amount]) => {
      if (String(personId) === String(expense.paidById)) return;
      const due = convert(amount, expense.currency, outputCurrency);
      const key = `${expense.id}:${String(personId)}:${String(expense.paidById)}`;
      const paid = paymentsByTargetAndPerson[key] || 0;
      obligations.push({
        logisticsExpenseId: expense.id,
        logisticsType: expense.logisticsType,
        logisticsId: expense.logisticsId,
        title: expense.description,
        personId: String(personId),
        payeeId: String(expense.paidById),
        due,
        paid,
        remaining: Math.max(0, due - paid),
        currency: outputCurrency,
      });
    });
  });

  settlementPayments.forEach((payment) => {
    let available = convert(payment.amountEUR, "EUR", outputCurrency);
    if (available <= 0.005) return;

    const candidates = obligations
      .filter((obligation) => obligation.personId === String(payment.fromId) && obligation.remaining > 0.005)
      .sort((left, right) => Number(right.payeeId === String(payment.toId)) - Number(left.payeeId === String(payment.toId)));

    candidates.forEach((obligation) => {
      if (available <= 0.005) return;
      const applied = Math.min(available, obligation.remaining);
      obligation.paid += applied;
      obligation.remaining = Math.max(0, obligation.remaining - applied);
      available -= applied;
    });
  });

  return obligations;
}
