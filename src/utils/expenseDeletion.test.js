import { calculateSettlements } from "../utils";
import { removeExpenseFromTripState, updateExpenseInTripState } from "./expenseDeletion";

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

describe("expense editing", () => {
  test("preserves metadata and reconciles settlements after a financial change", () => {
    const state = tripState(
      [{ ...sharedExpense("receipt-item", 200), source: "scan", receiptName: "Dinner" }],
      [{ id: "payment", expenseId: "receipt-item", fromId: "payer", toId: "recipient", amountEUR: 100 }]
    );

    const result = updateExpenseInTripState(state, "receipt-item", {
      description: "Dinner corrected",
      amount: 100,
      shares: null,
      editedAt: "2026-08-11T12:00:00.000Z",
    });

    expect(result.expenses).toEqual([
      expect.objectContaining({
        id: "receipt-item",
        description: "Dinner corrected",
        amount: 100,
        source: "scan",
        receiptName: "Dinner",
        editedAt: "2026-08-11T12:00:00.000Z",
      }),
    ]);
    expect(result.expenses[0]).not.toHaveProperty("shares");
    expect(result.settlementPayments).toEqual([
      expect.objectContaining({ id: "payment", amountEUR: 50 }),
    ]);
    expect(result.paymentRoutes).toEqual({});
  });

  test("leaves state untouched when the expense no longer exists", () => {
    const state = tripState([sharedExpense("keep", 20)], []);
    expect(updateExpenseInTripState(state, "missing", { amount: 40 })).toBe(state);
  });
});
