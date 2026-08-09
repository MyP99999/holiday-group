import {
  canConfirmSettlementPayment,
  getSettlementPaymentReasons,
  normalizeSettlementPaymentReason,
  reconcileSettlementPayments,
  resolveSettlementPaymentAmountEUR,
} from "./settlementPayments";
import { calculateSettlements } from "../utils";

describe("settlement payment confirmation", () => {
  test("allows a member to confirm only their own outgoing payment", () => {
    const transaction = { from: "debtor", to: "creditor", amountEUR: 100 };
    expect(canConfirmSettlementPayment(transaction, "debtor", false)).toBe(true);
    expect(canConfirmSettlementPayment(transaction, "creditor", false)).toBe(false);
    expect(canConfirmSettlementPayment(transaction, "someone-else", false)).toBe(false);
  });

  test("allows an admin to confirm any payment", () => {
    expect(canConfirmSettlementPayment({ from: "debtor" }, "admin", true)).toBe(true);
  });

  test("accepts partial and full amounts but rejects overpayment", () => {
    expect(resolveSettlementPaymentAmountEUR(35, "EUR", 100)).toBe(35);
    expect(resolveSettlementPaymentAmountEUR(100, "EUR", 100)).toBe(100);
    expect(resolveSettlementPaymentAmountEUR(100.02, "EUR", 100)).toBeNull();
  });

  test("keeps a concise reason with every confirmed settlement", () => {
    expect(normalizeSettlementPaymentReason("  Rental car  ")).toBe("Rental car");
    expect(normalizeSettlementPaymentReason("   ")).toBeNull();
    expect(normalizeSettlementPaymentReason(null)).toBeNull();
    expect(normalizeSettlementPaymentReason("x".repeat(140))).toHaveLength(120);
  });

  test("offers real unpaid expenses as selectable payment reasons", () => {
    const reasons = getSettlementPaymentReasons(
      { from: "guest", to: "rental-payer", amountEUR: 75 },
      [
        { id: "dinner", description: "Dinner", amount: 60, currency: "EUR", paidById: "food-payer", participantIds: ["guest", "food-payer"] },
        { id: "rental", description: "Rental car", amount: 150, currency: "EUR", paidById: "rental-payer", participantIds: ["guest", "rental-payer"] },
      ]
    );

    expect(reasons).toEqual([
      expect.objectContaining({ expenseId: "rental", title: "Rental car", payeeId: "rental-payer", remainingEUR: 75 }),
      expect.objectContaining({ expenseId: "dinner", title: "Dinner", payeeId: "food-payer", remainingEUR: 30 }),
    ]);
  });

  test("reduces the selected reason after a recorded payment", () => {
    const reasons = getSettlementPaymentReasons(
      { from: "guest", to: "payer", amountEUR: 60 },
      [{ id: "rental", description: "Rental car", amount: 200, currency: "EUR", paidById: "payer", participantIds: ["guest", "payer"] }],
      [{ fromId: "guest", toId: "payer", expenseId: "rental", reason: "Rental car", amountEUR: 40 }]
    );

    expect(reasons).toEqual([
      expect.objectContaining({ expenseId: "rental", remainingEUR: 60 }),
    ]);
  });

  test("leaves the unpaid balance pending after a partial confirmation", () => {
    const people = [{ id: "payer" }, { id: "recipient" }];
    const expenses = [{
      amount: 200,
      currency: "EUR",
      paidById: "recipient",
      participantIds: ["payer", "recipient"],
    }];
    const payments = [{ fromId: "payer", toId: "recipient", amountEUR: 40 }];

    expect(calculateSettlements(people, expenses, payments).transactions).toEqual([
      { from: "payer", to: "recipient", amountEUR: 60 },
    ]);
  });

  test("removes a settlement that only belonged to a deleted expense", () => {
    const payments = [{ id: "paid", fromId: "payer", toId: "recipient", amountEUR: 100 }];

    expect(reconcileSettlementPayments(
      [{ id: "payer" }, { id: "recipient" }],
      [],
      payments
    )).toEqual([]);
  });

  test("reduces an old settlement to the amount still owed after deletion", () => {
    const people = [{ id: "payer" }, { id: "recipient" }];
    const remainingExpense = [{
      amount: 100,
      currency: "EUR",
      paidById: "recipient",
      participantIds: ["payer", "recipient"],
    }];
    const payments = [{ id: "paid", fromId: "payer", toId: "recipient", amountEUR: 100 }];

    expect(reconcileSettlementPayments(people, remainingExpense, payments)).toEqual([
      expect.objectContaining({ id: "paid", amountEUR: 50, isPartial: true }),
    ]);
  });
});
