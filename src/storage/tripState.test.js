import { normalizePaymentDetails, normalizeTripState, normalizeVehicleSeats } from "./tripState";

describe("member payment details", () => {
  it("adds safe defaults to older trip members", () => {
    const state = normalizeTripState({ people: [{ id: "person-1", name: "Ana", role: "admin" }] });

    expect(state.people[0]).toMatchObject({
      accountHolder: "",
      iban: "",
      paymentMethods: [],
      paymentNote: "",
    });
  });

  it("keeps supported payment details and ignores malformed methods", () => {
    expect(normalizePaymentDetails({
      accountHolder: "Ana Pop",
      iban: "RO49 AAAA 1B31 0075 9384 0000",
      paymentMethods: [null, { id: "revolut-1", type: "revolut", value: "@ana" }],
      paymentNote: "Use the trip name as reference",
    })).toEqual({
      accountHolder: "Ana Pop",
      iban: "RO49 AAAA 1B31 0075 9384 0000",
      paymentMethods: [{ id: "revolut-1", type: "revolut", value: "@ana" }],
      paymentNote: "Use the trip name as reference",
    });
  });

  it("adds defaults for logistics payers, custom costs and payment history", () => {
    const state = normalizeTripState({
      expenses: [{ id: "expense" }],
      accommodations: [{ id: "stay", rooms: [] }],
      vehicles: [{ id: "car" }],
      flights: [{ id: "flight" }],
      otherCosts: [{ id: "other" }],
    });

    expect(state.accommodations[0].paidById).toBe("");
    expect(state.vehicles[0].rentalPaidById).toBe("");
    expect(state.flights[0].paidById).toBe("");
    expect([state.expenses[0].details, state.accommodations[0].details, state.vehicles[0].details, state.flights[0].details, state.otherCosts[0].details]).toEqual(["", "", "", "", ""]);
    expect(state.logisticsPayments).toEqual([]);
  });
});

describe("vehicle seat limits", () => {
  it("keeps seat counts between one and sixty", () => {
    expect(normalizeVehicleSeats(0)).toBe(1);
    expect(normalizeVehicleSeats(42)).toBe(42);
    expect(normalizeVehicleSeats(80)).toBe(60);
  });

  it("does not allow an edit below the occupied seat count", () => {
    expect(normalizeVehicleSeats(2, 5)).toBe(5);
  });
});

describe("trip date defaults", () => {
  it("keeps valid saved dates and clears malformed legacy values", () => {
    expect(normalizeTripState({ tripStartDate: "2026-08-11", tripEndDate: "2026-08-15" })).toMatchObject({
      tripStartDate: "2026-08-11",
      tripEndDate: "2026-08-15",
    });
    expect(normalizeTripState({ tripStartDate: "tomorrow" }).tripStartDate).toBe("");
    expect(normalizeTripState({ tripStartDate: "2026-08-15", tripEndDate: "2026-08-11" }).tripEndDate).toBe("");
  });
});

describe("wishlist defaults", () => {
  it("normalizes ideas and removes duplicate likes", () => {
    const state = normalizeTripState({
      wishlistIdeas: [{ id: "idea-1", title: "Boat tour", category: "activity", likedByIds: [1, "1", 2] }],
    });

    expect(state.wishlistIdeas[0]).toMatchObject({
      title: "Boat tour",
      category: "activity",
      likedByIds: ["1", "2"],
    });
  });
});
