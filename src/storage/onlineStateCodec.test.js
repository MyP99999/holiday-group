import { packOnlineTripState, unpackOnlineTripState } from "./onlineStateCodec";

describe("online trip state compatibility", () => {
  test("preserves ordinary expenses and settlement payments", () => {
    const state = unpackOnlineTripState({
      expenses: [{ id: "expense-1", source: "manual" }],
      settlementPayments: [{ id: "payment-1", source: "settlement" }],
    });
    expect(state.expenses).toEqual([{ id: "expense-1", source: "manual" }]);
    expect(state.settlementPayments).toEqual([{ id: "payment-1", source: "settlement" }]);
  });

  test("stores new logistics records in existing payload collections", () => {
    const packed = packOnlineTripState({
      expenses: [{ id: "expense-1", source: "manual" }],
      otherCosts: [{ id: "food", title: "Food", amount: 100 }],
      settlementPayments: [],
      logisticsPayments: [{ id: "advance-1", source: "logistics", amountEUR: 25 }],
    });

    expect(packed.expenses).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "food", storageType: "logistics-other-cost" }),
    ]));
    expect(packed.settlementPayments).toEqual([
      expect.objectContaining({ id: "advance-1", storageType: "logistics-payment" }),
    ]);
  });

  test("restores embedded logistics records without exposing them as normal expenses", () => {
    const original = {
      expenses: [{ id: "expense-1", source: "manual" }],
      otherCosts: [{ id: "food", title: "Food", amount: 100 }],
      settlementPayments: [],
      logisticsPayments: [{ id: "advance-1", source: "logistics", amountEUR: 25 }],
    };
    const restored = unpackOnlineTripState(packOnlineTripState(original));

    expect(restored.expenses).toEqual(original.expenses);
    expect(restored.otherCosts).toEqual(original.otherCosts);
    expect(restored.settlementPayments).toEqual([]);
    expect(restored.logisticsPayments).toEqual(original.logisticsPayments);
  });
});
