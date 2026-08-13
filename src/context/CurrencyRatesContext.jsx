import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  fallbackCurrencyRates,
  fetchDailyCurrencyRates,
  isCurrencyRateCacheFresh,
  loadCurrencyRateCache,
  saveCurrencyRateCache,
  setCurrencyRates,
} from "../currencyRates";
import { CURRENCIES } from "../constants";

const CurrencyRatesContext = createContext(null);
export const SELECTED_CURRENCY_STORAGE_KEY = "hg:selected-currency";

function browserStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function loadSelectedCurrency(storage = browserStorage()) {
  try {
    const savedCurrency = storage?.getItem(SELECTED_CURRENCY_STORAGE_KEY);
    return CURRENCIES.includes(savedCurrency) ? savedCurrency : "EUR";
  } catch {
    return "EUR";
  }
}

export function saveSelectedCurrency(currency, storage = browserStorage()) {
  if (!CURRENCIES.includes(currency)) return false;
  try {
    storage?.setItem(SELECTED_CURRENCY_STORAGE_KEY, currency);
    return true;
  } catch {
    return false;
  }
}

export function useCurrencyRates() {
  return useContext(CurrencyRatesContext);
}

export function CurrencyRatesProvider({ children }) {
  const [rateState, setRateState] = useState(() => {
    const cached = loadCurrencyRateCache();
    if (cached) {
      setCurrencyRates(cached.rates);
      return { ...cached, status: isCurrencyRateCacheFresh(cached) ? "live" : "stale" };
    }
    return { ...fallbackCurrencyRates, status: "fallback" };
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCurrency, setSelectedCurrencyState] = useState(loadSelectedCurrency);

  const setSelectedCurrency = useCallback((currency) => {
    if (!CURRENCIES.includes(currency)) return;
    saveSelectedCurrency(currency);
    setSelectedCurrencyState(currency);
  }, []);

  const refreshRates = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const next = await fetchDailyCurrencyRates();
      saveCurrencyRateCache(next);
      setRateState({ ...next, status: "live" });
      return next;
    } catch (error) {
      setRateState((current) => ({ ...current, status: current.fetchedAt ? "stale" : "fallback", error: error.message }));
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const cached = loadCurrencyRateCache();
    if (!isCurrencyRateCacheFresh(cached)) refreshRates();
  }, [refreshRates]);

  useEffect(() => {
    const syncSelectedCurrency = (event) => {
      if (event.key !== SELECTED_CURRENCY_STORAGE_KEY) return;
      setSelectedCurrencyState(CURRENCIES.includes(event.newValue) ? event.newValue : "EUR");
    };
    window.addEventListener("storage", syncSelectedCurrency);
    return () => window.removeEventListener("storage", syncSelectedCurrency);
  }, []);

  const value = useMemo(() => ({
    ...rateState,
    isRefreshing,
    refreshRates,
    selectedCurrency,
    setSelectedCurrency,
  }), [rateState, isRefreshing, refreshRates, selectedCurrency, setSelectedCurrency]);
  return <CurrencyRatesContext.Provider value={value}>{children}</CurrencyRatesContext.Provider>;
}
