import {
  SELECTED_CURRENCY_STORAGE_KEY,
  loadSelectedCurrency,
  saveSelectedCurrency,
} from "./CurrencyRatesContext";

beforeEach(() => {
  localStorage.clear();
});

test("restores a valid selected currency from localStorage", () => {
  localStorage.setItem(SELECTED_CURRENCY_STORAGE_KEY, "RON");
  expect(loadSelectedCurrency()).toBe("RON");
});

test("falls back to EUR when the saved currency is invalid", () => {
  localStorage.setItem(SELECTED_CURRENCY_STORAGE_KEY, "INVALID");
  expect(loadSelectedCurrency()).toBe("EUR");
});

test("persists only supported currencies", () => {
  expect(saveSelectedCurrency("USD")).toBe(true);
  expect(localStorage.getItem(SELECTED_CURRENCY_STORAGE_KEY)).toBe("USD");

  expect(saveSelectedCurrency("BTC")).toBe(false);
  expect(localStorage.getItem(SELECTED_CURRENCY_STORAGE_KEY)).toBe("USD");
});
