import {
  calculateExpenseSettlements,
  canConfirmSettlementPayment,
  editablePaymentLimitEUR,
  getSettlementPaymentReasons,
  normalizeSettlementPaymentReason,
  reconcileSettlementPayments,
  reconcileLogisticsPayments,
  resolveSettlementPaymentAmountEUR,
  toLocalDateTimeInput,
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

  test("keeps expense payments tied to the original payer and reason", () => {
    const people = [{ id: "alex" }, { id: "bea" }, { id: "chris" }];
    const expenses = [{
      id: "villa",
      description: "Villa",
      amount: 300,
      currency: "EUR",
      paidById: "alex",
      participantIds: ["alex", "bea", "chris"],
    }];

    expect(calculateExpenseSettlements(people, expenses)).toEqual([
      expect.objectContaining({ from: "bea", to: "alex", amountEUR: 100, expenseId: "villa", reason: "Villa" }),
      expect.objectContaining({ from: "chris", to: "alex", amountEUR: 100, expenseId: "villa", reason: "Villa" }),
    ]);
  });

  test("reduces a detailed expense payment without merging the other payment", () => {
    const people = [{ id: "alex" }, { id: "bea" }, { id: "chris" }];
    const expenses = [{
      id: "villa",
      description: "Villa",
      amount: 300,
      currency: "EUR",
      paidById: "alex",
      participantIds: ["alex", "bea", "chris"],
    }];
    const payments = [{
      fromId: "bea",
      toId: "alex",
      expenseId: "villa",
      settlementMethod: "expense",
      amountEUR: 40,
    }];

    expect(calculateExpenseSettlements(people, expenses, payments)).toEqual([
      expect.objectContaining({ from: "bea", to: "alex", amountEUR: 60, reason: "Villa" }),
      expect.objectContaining({ from: "chris", to: "alex", amountEUR: 100, reason: "Villa" }),
    ]);
  });

  test("applies an optimized payment across a chain of detailed obligations", () => {
    const people = [{ id: "alex" }, { id: "bea" }, { id: "chris" }];
    const expenses = [
      { id: "dinner", description: "Dinner", amount: 20, currency: "EUR", paidById: "bea", participantIds: ["alex", "bea"] },
      { id: "taxi", description: "Taxi", amount: 20, currency: "EUR", paidById: "chris", participantIds: ["bea", "chris"] },
    ];
    const payments = [{ fromId: "alex", toId: "chris", expenseId: "dinner", amountEUR: 10 }];

    expect(calculateExpenseSettlements(people, expenses, payments)).toEqual([]);
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

  test("removes a detailed payment when the expense payer changes", () => {
    const expense = {
      id: "rental",
      amount: 150,
      currency: "EUR",
      paidById: "new-payee",
      participantIds: ["payer", "new-payee"],
    };
    const payment = {
      id: "stale",
      fromId: "payer",
      toId: "old-payee",
      expenseId: "rental",
      settlementMethod: "expense",
      amountEUR: 75,
    };

    expect(reconcileSettlementPayments(
      [{ id: "payer" }, { id: "old-payee" }, { id: "new-payee" }],
      [expense],
      [payment]
    )).toEqual([]);
  });

  test("removes logistics payments to a former payer and caps valid payments", () => {
    const expense = {
      id: "logistics:rental:van",
      amount: 150,
      currency: "EUR",
      paidById: "stefan",
      participantIds: ["geo", "stefan"],
      source: "logistics",
    };
    const payments = [
      { id: "stale", logisticsExpenseId: expense.id, fromId: "alina", toId: "geo", amountEUR: 75 },
      { id: "valid", logisticsExpenseId: expense.id, fromId: "geo", toId: "stefan", amountEUR: 50 },
      { id: "excess", logisticsExpenseId: expense.id, fromId: "geo", toId: "stefan", amountEUR: 50 },
    ];

    expect(reconcileLogisticsPayments([expense], payments)).toEqual([
      expect.objectContaining({ id: "valid", amountEUR: 50 }),
      expect.objectContaining({ id: "excess", amountEUR: 25, isPartial: true }),
    ]);
  });

  test("limits an edited history payment to the debt before that payment", () => {
    const people = [{ id: "payer" }, { id: "recipient" }];
    const expenses = [{ amount: 200, currency: "EUR", paidById: "recipient", participantIds: ["payer", "recipient"] }];
    const payments = [
      { id: "earlier", fromId: "payer", toId: "recipient", amountEUR: 20 },
      { id: "editing", fromId: "payer", toId: "recipient", amountEUR: 40 },
    ];

    expect(editablePaymentLimitEUR(people, expenses, payments, "editing")).toBe(80);
    expect(editablePaymentLimitEUR(people, expenses, payments, "missing")).toBe(0);
  });

  test("limits an edited detailed payment to its expense share", () => {
    const people = [{ id: "alex" }, { id: "bea" }];
    const expenses = [{ id: "dinner", amount: 100, currency: "EUR", paidById: "alex", participantIds: ["alex", "bea"] }];
    const payments = [{ id: "editing", fromId: "bea", toId: "alex", expenseId: "dinner", settlementMethod: "expense", amountEUR: 20 }];

    expect(editablePaymentLimitEUR(people, expenses, payments, "editing")).toBe(50);
  });

  test("formats stored payment dates for a datetime-local input", () => {
    expect(toLocalDateTimeInput("2026-08-11T12:34:00.000Z")).toMatch(/^2026-08-11T\d{2}:34$/);
    expect(toLocalDateTimeInput("invalid")).toBe("");
  });
});
