const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function normalizeTripDate(value) {
  const match = String(value || "").match(DATE_PATTERN);
  if (!match) return "";
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.getUTCFullYear() === Number(year)
    && date.getUTCMonth() === Number(month) - 1
    && date.getUTCDate() === Number(day)
    ? `${year}-${month}-${day}`
    : "";
}

export function validateTripDates(startValue, endValue) {
  const startDate = normalizeTripDate(startValue);
  const endDate = normalizeTripDate(endValue);
  if ((startValue && !startDate) || (endValue && !endDate)) return { error: "invalid" };
  if (startDate && endDate && endDate < startDate) return { error: "range" };
  return { value: { startDate, endDate } };
}

export function formatTripDate(value, locale = "en") {
  const normalized = normalizeTripDate(value);
  if (!normalized) return "";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${normalized}T00:00:00.000Z`));
}

export function formatTripDateRange(startValue, endValue, locale = "en") {
  const startDate = formatTripDate(startValue, locale);
  const endDate = formatTripDate(endValue, locale);
  return [startDate, endDate].filter(Boolean).join(" – ");
}
