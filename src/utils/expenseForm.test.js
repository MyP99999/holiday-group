import { expenseToForm, validateExpenseForm } from "./expenseForm";

describe("expense form", () => {
  test("loads a custom expense into editable string values", () => {
    expect(expenseToForm({
      description: "Villa",
      details: "Paid at check-in",
      amount: 120,
      currency: "RON",
      paidById: 1,
      participantIds: [1, 2],
      shares: { 1: 20, 2: 100 },
    })).toEqual({
      description: "Villa",
      details: "Paid at check-in",
      amount: "120",
      currency: "RON",
      paidById: "1",
      participantIds: ["1", "2"],
      splitMode: "custom",
      shares: { 1: "20", 2: "100" },
    });
  });

  test("recovers participants from custom shares in legacy expenses", () => {
    expect(expenseToForm({ amount: 20, shares: { a: 8, b: 12 } }).participantIds).toEqual(["a", "b"]);
  });

  test("normalizes a valid equal split", () => {
    expect(validateExpenseForm({
      description: "  Taxi  ",
      details: "  Airport transfer  ",
      amount: "30",
      currency: "EUR",
      paidById: "payer",
      participantIds: ["payer", "friend", "friend"],
      splitMode: "equal",
    })).toEqual({
      value: {
        description: "Taxi",
        details: "Airport transfer",
        amount: 30,
        currency: "EUR",
        paidById: "payer",
        participantIds: ["payer", "friend"],
        shares: null,
      },
    });
  });

  test("rejects incomplete expenses and custom shares with the wrong total", () => {
    expect(validateExpenseForm({ amount: "-2" })).toEqual({ error: "required" });
    expect(validateExpenseForm({
      description: "Dinner",
      amount: "50",
      currency: "EUR",
      paidById: "payer",
      participantIds: ["payer", "friend"],
      splitMode: "custom",
      shares: { payer: "10", friend: "20" },
    })).toEqual({ error: "shares_total", amount: 50 });
  });
});
