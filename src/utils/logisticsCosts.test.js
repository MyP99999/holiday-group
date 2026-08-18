import {
  buildLogisticsExpenses,
  getStayShares,
  logisticsObligations,
} from "./logisticsCosts";
import { calculateBalances } from "../utils";

describe("logistics costs", () => {
  test("splits an accommodation between selected people", () => {
    expect(getStayShares({ price: 300, splitMode: "people", participantIds: ["a", "b", "c"] }))
      .toEqual({ a: 100, b: 100, c: 100 });
  });

  test("builds expenses for each priced logistics category", () => {
    const result = buildLogisticsExpenses({
      accommodations: [{ id: "stay", name: "Villa", details: "Breakfast included", price: 200, currency: "EUR", paidById: "a", splitMode: "people", participantIds: ["a", "b"], rooms: [] }],
      vehicles: [{ id: "car", name: "Rental", details: "Collect at terminal", rentalEnabled: true, rentalPrice: 90, rentalCurrency: "EUR", rentalPaidById: "b", rentalParticipantIds: ["a", "b"] }],
      flights: [{ id: "flight", from: "OTP", to: "BCN", details: "One checked bag", price: 120, currency: "EUR", paidById: "a", participantIds: ["a"] }],
      otherCosts: [{ id: "food", title: "Food", details: "Welcome groceries", amount: 60, currency: "EUR", paidById: "b", participantIds: ["a", "b"] }],
    });
    expect(result.map((item) => item.logisticsType)).toEqual(["accommodation", "rental", "flight", "other"]);
    expect(result.map((item) => item.details)).toEqual([
      "Breakfast included", "Collect at terminal", "One checked bag", "Welcome groceries",
    ]);
  });

  test("subtracts a linked advance from what a person still owes", () => {
    const expenses = buildLogisticsExpenses({
      accommodations: [{ id: "stay", name: "Villa", price: 200, currency: "EUR", paidById: "a", splitMode: "people", participantIds: ["a", "b"], rooms: [] }],
    });
    const obligations = logisticsObligations(expenses, [{ logisticsExpenseId: expenses[0].id, fromId: "b", toId: "a", amountEUR: 40 }]);
    expect(obligations).toEqual([expect.objectContaining({ personId: "b", payeeId: "a", due: 100, paid: 40, remaining: 60 })]);
  });

  test("updates settlement balances when an advance is recorded", () => {
    const expenses = buildLogisticsExpenses({
      accommodations: [{ id: "stay", name: "Villa", price: 200, currency: "EUR", paidById: "a", splitMode: "people", participantIds: ["a", "b"], rooms: [] }],
    });
    const balances = calculateBalances(
      [{ id: "a" }, { id: "b" }],
      expenses,
      [{ fromId: "b", toId: "a", amountEUR: 40 }]
    );
    expect(balances).toEqual({ a: 60, b: -60 });
  });

  test("applies Settle Up payments to the logistics table", () => {
    const expenses = buildLogisticsExpenses({
      accommodations: [{ id: "stay", name: "Villa", price: 200, currency: "EUR", paidById: "a", splitMode: "people", participantIds: ["a", "b"], rooms: [] }],
    });
    const obligations = logisticsObligations(
      expenses,
      [],
      "EUR",
      [{ fromId: "b", toId: "a", amountEUR: 100, source: "settlement" }]
    );

    expect(obligations).toEqual([
      expect.objectContaining({ personId: "b", payeeId: "a", due: 100, paid: 100, remaining: 0 }),
    ]);
  });

  test("includes ordinary expenses in the planned cost obligations", () => {
    const expenses = [{
      id: "fuel",
      description: "Fuel",
      amount: 120,
      currency: "EUR",
      paidById: "a",
      participantIds: ["a", "b", "c"],
      source: "manual",
    }];

    expect(logisticsObligations(expenses, [])).toEqual([
      expect.objectContaining({ logisticsExpenseId: "fuel", title: "Fuel", personId: "b", payeeId: "a", due: 40 }),
      expect.objectContaining({ logisticsExpenseId: "fuel", title: "Fuel", personId: "c", payeeId: "a", due: 40 }),
    ]);
  });
});
