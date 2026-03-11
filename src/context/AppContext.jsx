import { createContext, useContext, useState, useEffect } from "react";

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ driver, children }) {
  // Single state object avoids stale-closure issues when writing back to storage
  const [state, setState] = useState(() => driver.read() || { people: [], expenses: [] });

  // Cross-tab / cross-device sync (no-op for memoryDriver)
  useEffect(() => {
    return driver.subscribe((newState) => setState(newState));
  }, [driver]);

  const setPeople = (updater) => {
    setState((prev) => {
      const people = typeof updater === "function" ? updater(prev.people) : updater;
      const next = { ...prev, people };
      driver.write(next);
      return next;
    });
  };

  const setExpenses = (updater) => {
    setState((prev) => {
      const expenses = typeof updater === "function" ? updater(prev.expenses) : updater;
      const next = { ...prev, expenses };
      driver.write(next);
      return next;
    });
  };

  return (
    <AppContext.Provider value={{ people: state.people, expenses: state.expenses, setPeople, setExpenses }}>
      {children}
    </AppContext.Provider>
  );
}
