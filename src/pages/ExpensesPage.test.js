import { act } from "react";
import { createRoot } from "react-dom/client";
import { AppContext } from "../context/AppContext";
import { LanguageProvider } from "../context/LanguageContext";
import ExpensesPage from "./ExpensesPage";

jest.mock("react-router-dom", () => ({
  Navigate: () => null,
  useLocation: () => ({ state: null }),
  useNavigate: () => jest.fn(),
}), { virtual: true });

jest.mock("../context/CurrencyRatesContext", () => ({
  useCurrencyRates: () => ({
    rateDate: "2026-08-11", status: "live", selectedCurrency: "EUR", setSelectedCurrency: jest.fn(),
  }),
}));

global.IS_REACT_ACT_ENVIRONMENT = true;

function click(element) {
  act(() => element.dispatchEvent(new MouseEvent("click", { bubbles: true })));
}

function changeInput(element, value) {
  const setter = Object.getOwnPropertyDescriptor(element.constructor.prototype, "value").set;
  act(() => {
    setter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function buttonWithText(container, text) {
  return [...container.querySelectorAll("button")].find((button) => button.textContent.trim() === text);
}

function controlWithLabel(container, text) {
  const label = [...container.querySelectorAll("label")].find((item) => item.textContent.trim().startsWith(text));
  return label?.querySelector("input, textarea");
}

test("edits a ledger expense while preserving its source metadata and id", () => {
  const expense = {
    id: "expense-1",
    description: "Original dinner",
    amount: 80,
    currency: "EUR",
    paidById: "maya",
    participantIds: ["maya", "theo"],
    source: "scan",
    receiptName: "Lido receipt",
    date: "2026-08-10T18:00:00.000Z",
  };
  const tripState = {
    people: [{ id: "maya", name: "Maya" }, { id: "theo", name: "Theo" }],
    expenses: [expense],
    accommodations: [],
    vehicles: [],
    flights: [],
    otherCosts: [],
    settlementPayments: [],
    logisticsPayments: [],
    paymentRoutes: {},
  };
  let savedState = null;
  const updateTripState = jest.fn((updater) => { savedState = updater(tripState); });
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => root.render(
    <LanguageProvider>
      <AppContext.Provider value={{
        ...tripState,
        setExpenses: jest.fn(),
        updateTripState,
      }}>
        <ExpensesPage />
      </AppContext.Provider>
    </LanguageProvider>
  ));

  click(buttonWithText(container, "Edit"));
  const dialog = container.querySelector('[role="dialog"]');
  expect(dialog?.querySelector("h2")?.textContent).toBe("Edit expense");
  changeInput(controlWithLabel(dialog, "Title"), "Dinner at Lido");
  changeInput(controlWithLabel(dialog, "Description"), "Birthday meal by the water");
  changeInput(controlWithLabel(dialog, "Amount"), "96");
  click(buttonWithText(dialog, "Save changes"));

  expect(updateTripState).toHaveBeenCalledTimes(1);
  expect(savedState.expenses).toEqual([
    expect.objectContaining({
      id: "expense-1",
      description: "Dinner at Lido",
      details: "Birthday meal by the water",
      amount: 96,
      source: "scan",
      receiptName: "Lido receipt",
      editedAt: expect.any(String),
    }),
  ]);
  expect(container.querySelector('[role="dialog"]')).toBeNull();

  act(() => root.unmount());
  container.remove();
});
