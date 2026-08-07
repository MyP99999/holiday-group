import { normalizePaymentDetails, normalizeTripState } from "./tripState";

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
});
