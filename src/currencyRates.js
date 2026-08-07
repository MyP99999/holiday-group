import { EUR_RATES, RATE_DATE } from "./constants";

const CACHE_KEY = "hg:currency-rates:v2";
const CACHE_TTL = 6 * 60 * 60 * 1000;
const REQUESTED_QUOTES = Object.keys(EUR_RATES).filter((code) => code !== "EUR").join(",");
const RATES_URL = `https://api.frankfurter.dev/v2/rates?base=EUR&quotes=${REQUESTED_QUOTES}&providers=ECB`;

let activeRates = { ...EUR_RATES };

export function getCurrencyRates() {
  return activeRates;
}

export function setCurrencyRates(rates) {
  activeRates = { ...EUR_RATES, ...rates, EUR: 1 };
  return activeRates;
}

export function loadCurrencyRateCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!cached?.rates || !cached?.rateDate || !cached?.fetchedAt) return null;
    return cached;
  } catch {
    return null;
  }
}

export function saveCurrencyRateCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Rates still work for this session when storage is unavailable.
  }
}

export function isCurrencyRateCacheFresh(cache) {
  return Boolean(cache && Date.now() - Number(cache.fetchedAt) < CACHE_TTL);
}

export async function fetchDailyCurrencyRates() {
  const response = await fetch(RATES_URL, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Currency service returned ${response.status}.`);
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length < 5) throw new Error("Currency service returned incomplete rates.");

  const rates = Object.fromEntries(rows
    .filter((row) => row.base === "EUR" && EUR_RATES[row.quote] && Number(row.rate) > 0)
    .map((row) => [row.quote, Number(row.rate)]));
  const dates = rows.map((row) => row.date).filter(Boolean).sort();
  const rateDate = dates[dates.length - 1];
  if (!rateDate || !rates.USD) throw new Error("Currency service returned invalid data.");

  return {
    rates: setCurrencyRates(rates),
    rateDate,
    fetchedAt: Date.now(),
    source: "ECB via Frankfurter",
  };
}

export const fallbackCurrencyRates = {
  rates: { ...EUR_RATES },
  rateDate: RATE_DATE,
  fetchedAt: 0,
  source: "Saved ECB fallback",
};
