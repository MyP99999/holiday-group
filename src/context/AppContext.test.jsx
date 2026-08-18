import { act } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider, useApp } from "./AppContext";

function RefreshProbe() {
  const { tripName, refreshData, isRefreshing, updateTripState } = useApp();
  return (
    <>
      <span data-testid="trip-name">{tripName}</span>
      <span data-testid="refreshing">{String(isRefreshing)}</span>
      <button type="button" data-testid="refresh" onClick={refreshData}>Refresh</button>
      <button
        type="button"
        data-testid="edit"
        onClick={() => updateTripState((state) => ({ ...state, tripName: "Local edit" }))}
      >
        Edit
      </button>
    </>
  );
}

function FinancialProbe() {
  const { logisticsPayments } = useApp();
  return <span data-testid="logistics-payment-count">{logisticsPayments.length}</span>;
}

function deferred() {
  let resolve;
  const promise = new Promise((next) => { resolve = next; });
  return { promise, resolve };
}

async function flushEffects() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("manual trip refresh", () => {
  let container;
  let root;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  test("replaces the displayed trip with a fresh server read", async () => {
    const driver = {
      isAsync: true,
      read: jest.fn()
        .mockResolvedValueOnce({ tripName: "Before refresh" })
        .mockResolvedValueOnce({ tripName: "After refresh" }),
      write: jest.fn(),
      subscribe: jest.fn(() => () => {}),
    };

    await act(async () => {
      root.render(<AppProvider driver={driver}><RefreshProbe /></AppProvider>);
    });
    await flushEffects();

    expect(container.querySelector('[data-testid="trip-name"]').textContent).toBe("Before refresh");

    await act(async () => {
      container.querySelector('[data-testid="refresh"]').click();
    });

    expect(container.querySelector('[data-testid="trip-name"]').textContent).toBe("After refresh");
    expect(driver.read).toHaveBeenCalledTimes(2);
  });

  test("does not overwrite a local edit made while refresh is running", async () => {
    const pendingRefresh = deferred();
    const driver = {
      isAsync: true,
      read: jest.fn()
        .mockResolvedValueOnce({ tripName: "Before refresh" })
        .mockReturnValueOnce(pendingRefresh.promise),
      write: jest.fn(() => Promise.resolve()),
      subscribe: jest.fn(() => () => {}),
    };

    await act(async () => {
      root.render(<AppProvider driver={driver}><RefreshProbe /></AppProvider>);
    });
    await flushEffects();

    act(() => container.querySelector('[data-testid="refresh"]').click());
    expect(container.querySelector('[data-testid="refreshing"]').textContent).toBe("true");

    act(() => container.querySelector('[data-testid="edit"]').click());
    expect(container.querySelector('[data-testid="trip-name"]').textContent).toBe("Local edit");

    await act(async () => {
      pendingRefresh.resolve({ tripName: "Stale server response" });
      await pendingRefresh.promise;
    });

    expect(container.querySelector('[data-testid="trip-name"]').textContent).toBe("Local edit");
    expect(container.querySelector('[data-testid="refreshing"]').textContent).toBe("false");
  });
});

describe("trip financial reconciliation", () => {
  let container;
  let root;

  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterAll(() => {
    delete globalThis.IS_REACT_ACT_ENVIRONMENT;
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  test("does not load a logistics payment addressed to a former payer", async () => {
    const driver = {
      isAsync: true,
      read: jest.fn().mockResolvedValue({
        people: [{ id: "geo" }, { id: "stefan" }, { id: "alina" }],
        expenses: [],
        vehicles: [{
          id: "van",
          rentalEnabled: true,
          rentalPrice: 150,
          rentalCurrency: "EUR",
          rentalPaidById: "stefan",
          rentalParticipantIds: ["geo", "stefan", "alina"],
        }],
        logisticsPayments: [{
          id: "stale",
          logisticsExpenseId: "logistics:rental:van",
          fromId: "alina",
          toId: "geo",
          amountEUR: 50,
        }],
      }),
      write: jest.fn(),
      subscribe: jest.fn(() => () => {}),
    };

    await act(async () => {
      root.render(<AppProvider driver={driver}><FinancialProbe /></AppProvider>);
    });
    await flushEffects();

    expect(container.querySelector('[data-testid="logistics-payment-count"]').textContent).toBe("0");
  });
});
