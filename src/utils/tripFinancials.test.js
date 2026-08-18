import { calculateBalances } from "../utils";
import { getTripExpenses, getTripPayments, reconcileTripFinancials, removePaymentFromTripState } from "./tripFinancials";

describe("trip financial snapshot", () => {
  const people = [{ id: "alex" }, { id: "bea" }];
  const state = {
    expenses: [{
      id: "dinner",
      description: "Dinner",
      amount: 100,
      currency: "EUR",
      paidById: "alex",
      participantIds: ["alex", "bea"],
    }],
    accommodations: [{
      id: "stay",
      name: "Villa",
      price: 200,
      currency: "EUR",
      paidById: "alex",
      splitMode: "people",
      participantIds: ["alex", "bea"],
      rooms: [],
    }],
    vehicles: [],
    flights: [],
    otherCosts: [],
    settlementPayments: [{ id: "paid", fromId: "bea", toId: "alex", amountEUR: 25 }],
    logisticsPayments: [],
  };

  test("uses ordinary and logistics expenses in the same snapshot", () => {
    const expenses = getTripExpenses(state);

    expect(expenses.map((expense) => expense.id)).toEqual(["dinner", "logistics:accommodation:stay"]);
    expect(expenses.reduce((total, expense) => total + expense.amount, 0)).toBe(300);
  });

  test("removing a payment immediately restores its overview balance impact", () => {
    const expenses = getTripExpenses(state);
    const before = calculateBalances(people, expenses, getTripPayments(state));
    const updated = removePaymentFromTripState(state, "paid");
    const after = calculateBalances(people, expenses, getTripPayments(updated));

    expect(before).toEqual({ alex: 125, bea: -125 });
    expect(updated.settlementPayments).toEqual([]);
    expect(after).toEqual({ alex: 150, bea: -150 });
  });

  test("removes a payment by id even when its source metadata is missing or wrong", () => {
    const mixedState = {
      ...state,
      settlementPayments: [{ id: "legacy", source: "logistics" }],
      logisticsPayments: [{ id: "logistics", source: "settlement" }],
    };

    expect(removePaymentFromTripState(mixedState, "legacy").settlementPayments).toEqual([]);
    expect(removePaymentFromTripState(mixedState, "logistics").logisticsPayments).toEqual([]);
  });

  test("removes logistics payments left behind after a payer change", () => {
    const changedPayerState = {
      ...state,
      accommodations: [],
      vehicles: [{
        id: "van",
        name: "Van",
        rentalEnabled: true,
        rentalPrice: 150,
        rentalCurrency: "EUR",
        rentalPaidById: "alex",
        rentalParticipantIds: ["alex", "bea"],
      }],
      settlementPayments: [],
      logisticsPayments: [{
        id: "stale",
        logisticsExpenseId: "logistics:rental:van",
        fromId: "alex",
        toId: "bea",
        amountEUR: 75,
      }],
    };

    expect(reconcileTripFinancials(changedPayerState).logisticsPayments).toEqual([]);
  });
});
