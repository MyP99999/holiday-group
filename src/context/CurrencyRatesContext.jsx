import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  fallbackCurrencyRates,
  fetchDailyCurrencyRates,
  isCurrencyRateCacheFresh,
  loadCurrencyRateCache,
  saveCurrencyRateCache,
  setCurrencyRates,
} from "../currencyRates";

const CurrencyRatesContext = createContext(null);

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

  const value = useMemo(() => ({ ...rateState, isRefreshing, refreshRates }), [rateState, isRefreshing, refreshRates]);
  return <CurrencyRatesContext.Provider value={value}>{children}</CurrencyRatesContext.Provider>;
}
