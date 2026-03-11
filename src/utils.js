import { RATES, CURRENCY_SYMBOLS, PERSON_COLORS } from "./constants";

export function convert(amount, from, to) {
  if (!amount || isNaN(amount)) return 0;
  return amount * RATES[from][to];
}

export function fmt(val, cur) {
  return `${CURRENCY_SYMBOLS[cur]} ${val.toFixed(2)}`;
}

export function personColor(index) {
  return PERSON_COLORS[index % PERSON_COLORS.length];
}
