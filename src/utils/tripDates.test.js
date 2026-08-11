import { formatTripDateRange, normalizeTripDate, validateTripDates } from "./tripDates";

describe("trip dates", () => {
  test("normalizes valid calendar dates and rejects impossible ones", () => {
    expect(normalizeTripDate("2026-08-11")).toBe("2026-08-11");
    expect(normalizeTripDate("2026-02-30")).toBe("");
  });

  test("requires the end of the trip to be after its start", () => {
    expect(validateTripDates("2026-08-15", "2026-08-11")).toEqual({ error: "range" });
    expect(validateTripDates("2026-08-11", "2026-08-15")).toEqual({
      value: { startDate: "2026-08-11", endDate: "2026-08-15" },
    });
  });

  test("formats a date-only range without timezone shifts", () => {
    expect(formatTripDateRange("2026-08-11", "2026-08-15", "en")).toBe("August 11, 2026 – August 15, 2026");
  });
});
