import { createContext, useContext, useEffect, useRef, useState } from "react";
import { normalizeTripState } from "../storage/tripState";
import { appendActivity, createActivityEntry } from "../utils/activityLog";

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ driver, currentMemberId = "", ownerMode = false, children }) {
  const [state, setState] = useState(() => (
    driver.isAsync ? null : normalizeTripState(driver.read())
  ));
  const stateRef = useRef(state);
  const [loadError, setLoadError] = useState("");
  const [syncError, setSyncError] = useState("");
  const [pendingWrites, setPendingWrites] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    const start = async () => {
      setLoadError("");
      try {
        const nextState = normalizeTripState(await driver.read());
        if (!active) return;
        stateRef.current = nextState;
        setState(nextState);

        if (!driver.isAsync) driver.write(nextState);
        unsubscribe = driver.subscribe((remoteState) => {
          if (active) {
            const normalized = normalizeTripState(remoteState);
            stateRef.current = normalized;
            setState(normalized);
          }
        });
      } catch (error) {
        if (active) setLoadError(error.message || "Could not load this trip.");
      }
    };

    start();
    return () => {
      active = false;
      unsubscribe();
    };
  }, [driver, reloadKey]);

  const persist = (nextState) => {
    setSyncError("");
    try {
      const result = driver.write(nextState);
      if (result && typeof result.then === "function") {
        setPendingWrites((count) => count + 1);
        result
          .catch((error) => setSyncError(error.message || "Changes could not be synced."))
          .finally(() => setPendingWrites((count) => Math.max(0, count - 1)));
      }
    } catch (error) {
      setSyncError(error.message || "Changes could not be saved.");
    }
  };

  const setField = (field, updater) => {
    const previous = stateRef.current;
    if (!previous) return;
    const value = typeof updater === "function" ? updater(previous[field]) : updater;
    const next = { ...previous, [field]: value };
    stateRef.current = next;
    setState(next);
    persist(next);
  };

  const updateTripState = (updater) => {
    const previous = stateRef.current;
    if (!previous || typeof updater !== "function") return;
    const next = updater(previous);
    if (!next || next === previous) return;
    stateRef.current = next;
    setState(next);
    persist(next);
  };

  if (!state) {
    return (
      <div className="app-loading app-loading-state">
        {loadError ? (
          <>
            <strong>We couldn't open this trip.</strong>
            <small>{loadError}</small>
            <button className="button secondary" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>
          </>
        ) : (
          <><span />Loading your shared tripâ€¦</>
        )}
      </div>
    );
  }

  const effectiveMemberId = currentMemberId || state.currentMemberId || "";
  const currentPerson = state.people.find((person) => String(person.id) === String(effectiveMemberId)) || null;
  const canManageMembers = ownerMode || currentPerson?.role === "admin";
  const canModerateMembers = Boolean(canManageMembers && typeof driver.moderateMember === "function");
  const canEditMemberProfile = (memberId) => {
    const target = state.people.find((person) => String(person.id) === String(memberId));
    return Boolean(
      target && (
        ownerMode ||
        String(memberId) === String(effectiveMemberId) ||
        (canManageMembers && !target.claimedAt)
      )
    );
  };

  const updateMemberProfile = async (memberId, details) => {
    if (!canEditMemberProfile(memberId)) return false;
    const previous = stateRef.current;
    const next = {
      ...previous,
      people: previous.people.map((person) => String(person.id) === String(memberId)
        ? { ...person, ...details }
        : person),
    };
    stateRef.current = next;
    setState(next);
    setSyncError("");

    if (typeof driver.writeMemberProfile === "function") {
      setPendingWrites((count) => count + 1);
      try {
        await driver.writeMemberProfile(memberId, details);
      } catch (error) {
        stateRef.current = previous;
        setState(previous);
        setSyncError(error.message || "Changes could not be saved.");
        return false;
      } finally {
        setPendingWrites((count) => Math.max(0, count - 1));
      }
    } else {
      persist(next);
    }
    return true;
  };

  const moderateMember = async (memberId, action) => {
    if (!canModerateMembers || !["kick", "ban", "unban"].includes(action)) return false;
    const target = stateRef.current?.people.find((person) => String(person.id) === String(memberId));
    setSyncError("");
    setPendingWrites((count) => count + 1);
    try {
      await driver.moderateMember(memberId, action);
      const refreshed = normalizeTripState(await driver.read());
      const nextState = appendActivity(refreshed, createActivityEntry({
        type: action === "kick" ? "member_kicked" : action === "ban" ? "member_banned" : "member_unbanned",
        actor: currentPerson,
        subject: target,
      }));
      await driver.write(nextState);
      stateRef.current = nextState;
      setState(nextState);
      return true;
    } catch (error) {
      setSyncError(error.message || "The member action could not be completed.");
      throw error;
    } finally {
      setPendingWrites((count) => Math.max(0, count - 1));
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      currentMemberId: effectiveMemberId,
      currentPerson,
      canManageMembers,
      canModerateMembers,
      canEditMemberProfile,
      updateMemberProfile,
      moderateMember,
      updateTripState,
      isSyncing: pendingWrites > 0,
      syncError,
      setPeople: (updater) => setField("people", updater),
      setExpenses: (updater) => setField("expenses", updater),
      setAccommodations: (updater) => setField("accommodations", updater),
      setVehicles: (updater) => setField("vehicles", updater),
      setFlights: (updater) => setField("flights", updater),
      setOtherCosts: (updater) => setField("otherCosts", updater),
      setPolls: (updater) => setField("polls", updater),
      setComments: (updater) => setField("comments", updater),
      setChatMessages: (updater) => setField("chatMessages", updater),
      setPaymentRoutes: (updater) => setField("paymentRoutes", updater),
      setSettlementPayments: (updater) => setField("settlementPayments", updater),
      setLogisticsPayments: (updater) => setField("logisticsPayments", updater),
    }}>
      {children}
    </AppContext.Provider>
  );
}
