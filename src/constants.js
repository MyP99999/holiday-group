export const RATE_DATE = "06 Aug 2026";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/holidaysplits/",
  tiktok: "https://www.tiktok.com/@holidaysplits",
};

// ECB reference rates: one euro equals the listed amount of each currency.
// These are intentionally stored as a single base table so every cross-rate is consistent.
export const EUR_RATES = {
  EUR: 1,
  USD: 1.1542,
  GBP: 0.85705,
  CHF: 0.9346,
  RON: 5.2543,
  PLN: 4.299,
  CZK: 24.21,
  HUF: 363.75,
  BGN: 1.9558,
  TRY: 54.9341,
  CAD: 1.6156,
  AUD: 1.639,
  JPY: 182.17,
};

export const CURRENCY_META = {
  EUR: { symbol: "€", name: "Euro" },
  USD: { symbol: "$", name: "US dollar" },
  GBP: { symbol: "£", name: "Pound sterling" },
  CHF: { symbol: "CHF", name: "Swiss franc" },
  RON: { symbol: "lei", name: "Romanian leu" },
  PLN: { symbol: "zł", name: "Polish złoty" },
  CZK: { symbol: "Kč", name: "Czech koruna" },
  HUF: { symbol: "Ft", name: "Hungarian forint" },
  BGN: { symbol: "лв", name: "Bulgarian lev" },
  TRY: { symbol: "₺", name: "Turkish lira" },
  CAD: { symbol: "CA$", name: "Canadian dollar" },
  AUD: { symbol: "A$", name: "Australian dollar" },
  JPY: { symbol: "¥", name: "Japanese yen" },
};

export const CURRENCIES = Object.keys(EUR_RATES);
export const CURRENCY_SYMBOLS = Object.fromEntries(
  Object.entries(CURRENCY_META).map(([code, meta]) => [code, meta.symbol])
);

export const PERSON_COLORS = [
  "#C95B43", "#6E8D79", "#D39A4C", "#7697C8", "#8C76A8",
  "#B86B83", "#9A7658", "#4E8A92", "#75855C", "#A86B55",
];
