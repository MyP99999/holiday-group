import {
  canConfirmSettlementPayment,
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
