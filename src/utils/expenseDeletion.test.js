import { calculateSettlements } from "../utils";
import { removeExpenseFromTripState } from "./expenseDeletion";

function sharedExpense(id, amount) {
  return {
    id,
    amount,
    currency: "EUR",
    paidById: "recipient",
    participantIds: ["payer", "recipient"],
  };
}

function tripState(expenses, settlementPayments) {
  return {
    people: [{ id: "payer" }, { id: "recipient" }],
    expenses,
    accommodations: [],
    vehicles: [],
    flights: [],
    otherCosts: [],
    logisticsPayments: [],
    settlementPayments,
    paymentRoutes: { "payer:recipient": "helper" },
  };
}

describe("expense deletion", () => {
  test("removes the expense, its obsolete settlement, route and balance impact", () => {
    const state = tripState(
      [sharedExpense("deleted", 200)],
      [{ id: "payment", fromId: "payer", toId: "recipient", amountEUR: 100 }]
    );

    const result = removeExpenseFromTripState(state, "deleted");

    expect(result.expenses).toEqual([]);
    expect(result.settlementPayments).toEqual([]);
    expect(result.paymentRoutes).toEqual({});
    expect(calculateSettlements(result.people, result.expenses, result.settlementPayments).transactions).toEqual([]);
  });

  test("preserves only the settlement amount still supported by remaining expenses", () => {
    const state = tripState(
      [sharedExpense("keep", 100), sharedExpense("delete", 100)],
      [{ id: "payment", fromId: "payer", toId: "recipient", amountEUR: 100 }]
    );

    const result = removeExpenseFromTripState(state, "delete");

    expect(result.expenses.map((expense) => expense.id)).toEqual(["keep"]);
    expect(result.settlementPayments).toEqual([
      expect.objectContaining({ id: "payment", amountEUR: 50 }),
    ]);
    expect(calculateSettlements(result.people, result.expenses, result.settlementPayments).transactions).toEqual([]);
  });
});
