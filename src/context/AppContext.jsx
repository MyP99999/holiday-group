import { createContext, useContext, useState, useEffect } from "react";
import { normalizeTripState } from "../storage/tripState";

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ driver, currentMemberId = "", ownerMode = false, children }) {
  // Single state object avoids stale-closure issues when writing back to storage
  const [state, setState] = useState(() => normalizeTripState(driver.read()));

  // Cross-tab / cross-device sync (no-op for memoryDriver)
  useEffect(() => {
    // Persist state migrations (for example, stable member colors) as soon as
    // an older trip is opened instead of waiting for the next user edit.
    driver.write(normalizeTripState(driver.read()));
    return driver.subscribe((newState) => setState(normalizeTripState(newState)));
  }, [driver]);

  const setField = (field, updater) => {
    setState((prev) => {
      const value = typeof updater === "function" ? updater(prev[field]) : updater;
      const next = { ...prev, [field]: value };
      driver.write(next);
      return next;
    });
  };

  const currentPerson = state.people.find((person) => String(person.id) === String(currentMemberId)) || null;
  const canManageMembers = ownerMode || currentPerson?.role === "admin";

  return (
    <AppContext.Provider value={{
      ...state,
      currentMemberId,
      currentPerson,
      canManageMembers,
      setPeople: (updater) => setField("people", updater),
      setExpenses: (updater) => setField("expenses", updater),
      setAccommodations: (updater) => setField("accommodations", updater),
      setVehicles: (updater) => setField("vehicles", updater),
      setComments: (updater) => setField("comments", updater),
      setChatMessages: (updater) => setField("chatMessages", updater),
      setPaymentRoutes: (updater) => setField("paymentRoutes", updater),
      setSettlementPayments: (updater) => setField("settlementPayments", updater),
    }}>
      {children}
    </AppContext.Provider>
  );
}
