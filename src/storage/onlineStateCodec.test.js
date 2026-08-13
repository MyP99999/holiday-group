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

  test("stores activity entries alongside payments without exposing them as payments", () => {
    const original = {
      settlementPayments: [{ id: "payment-1", source: "settlement" }],
      logisticsPayments: [],
      activityLog: [{ id: "activity-1", type: "expense_edited", actorName: "Maya" }],
    };
    const packed = packOnlineTripState(original);
    expect(packed.settlementPayments).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "activity-1", storageType: "activity-entry" }),
    ]));

    const restored = unpackOnlineTripState(packed);
    expect(restored.settlementPayments).toEqual(original.settlementPayments);
    expect(restored.activityLog).toEqual(original.activityLog);
  });

  test("stores trip dates without exposing the metadata as a payment", () => {
    const original = {
      settlementPayments: [],
      logisticsPayments: [],
      activityLog: [],
      tripStartDate: "2026-08-11",
      tripEndDate: "2026-08-15",
    };
    const packed = packOnlineTripState(original);
    expect(packed.settlementPayments).toEqual([
      expect.objectContaining({ id: "__trip-dates__", storageType: "trip-dates" }),
    ]);

    const restored = unpackOnlineTripState(packed);
    expect(restored.tripStartDate).toBe(original.tripStartDate);
    expect(restored.tripEndDate).toBe(original.tripEndDate);
    expect(restored.settlementPayments).toEqual([]);
  });

  test("stores shared wishlist ideas without exposing them as payments", () => {
    const original = {
      settlementPayments: [],
      logisticsPayments: [],
      activityLog: [],
      wishlistIdeas: [{ id: "wishlist-1", title: "Sunset boat tour", likedByIds: ["maya"] }],
    };
    const packed = packOnlineTripState(original);
    expect(packed.settlementPayments).toEqual([
      expect.objectContaining({ id: "wishlist-1", storageType: "wishlist-idea" }),
    ]);

    const restored = unpackOnlineTripState(packed);
    expect(restored.wishlistIdeas).toEqual(original.wishlistIdeas);
    expect(restored.settlementPayments).toEqual([]);
  });
});
