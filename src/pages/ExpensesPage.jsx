import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuReceiptText, LuScanLine, LuUtensils } from "react-icons/lu";
import PageHeader from "../components/PageHeader";
import CurrencySelect from "../components/CurrencySelect";
import PersonAvatar from "../components/PersonAvatar";
import { ScanExpenseForm } from "./ScanPage";
import { RestaurantExpenseForm } from "./RestaurantPage";
import { useApp } from "../context/AppContext";
import { convert, fmt, getExpenseShares } from "../utils";
import { useLanguage } from "../context/LanguageContext";
import { useCurrencyRates } from "../context/CurrencyRatesContext";
import { removeExpenseFromTripState } from "../utils/expenseDeletion";

const emptyForm = {
  description: "",
  amount: "",
  currency: "EUR",
  paidById: "",
  participantIds: [],
  splitMode: "equal",
  shares: {},
};

export default function ExpensesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, locale } = useLanguage();
  const { rateDate, status: rateStatus } = useCurrencyRates();
  const formRef = useRef(null);
  const { people, expenses, setExpenses, updateTripState } = useApp();
  const [displayCurrency, setDisplayCurrency] = useState("EUR");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [expenseMode, setExpenseMode] = useState(() => {
    const requestedMode = location.state?.expenseMode;
    return requestedMode === "scan" || requestedMode === "restaurant" ? requestedMode : "manual";
  });
  const totalSpent = useMemo(
    () => expenses.reduce((sum, expense) => sum + convert(expense.amount, expense.currency, displayCurrency), 0),
    [expenses, displayCurrency, rateDate]
  );

  useEffect(() => {
    if (people.length && !form.paidById) {
      setForm((current) => ({ ...current, paidById: String(people[0].id), participantIds: people.map((person) => person.id) }));
    }
  }, [people, form.paidById]);

  useEffect(() => {
    const requestedMode = location.state?.expenseMode;
    if (requestedMode === "scan" || requestedMode === "restaurant") setExpenseMode(requestedMode);
  }, [location.state]);

  useEffect(() => {
    if (!expenseToDelete) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => event.key === "Escape" && setExpenseToDelete(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [expenseToDelete]);

  const openExpenseMode = (mode) => {
    setExpenseMode(mode);
    window.requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const toggleParticipant = (id) => setForm((current) => ({
    ...current,
    participantIds: current.participantIds.includes(id)
      ? current.participantIds.filter((personId) => personId !== id)
      : [...current.participantIds, id],
  }));

  const saveExpense = () => {
    setError("");
    const amount = Number(form.amount);
    if (!form.description.trim() || !amount || !form.paidById || !form.participantIds.length) {
      setError("Add a description, amount, payer and at least one contributor.");
      return;
    }

    let shares;
    if (form.splitMode === "custom") {
      shares = Object.fromEntries(form.participantIds.map((id) => [String(id), Number(form.shares[String(id)]) || 0]));
      const shareTotal = Object.values(shares).reduce((sum, value) => sum + value, 0);
      if (Math.abs(shareTotal - amount) > 0.01) {
        setError(`Custom shares must add up to ${fmt(amount, form.currency)}.`);
        return;
      }
    }

    setExpenses((current) => [...current, {
      id: Date.now(),
      description: form.description.trim(),
      amount,
      currency: form.currency,
      paidById: form.paidById,
      participantIds: form.participantIds,
      ...(shares ? { shares } : {}),
      source: "manual",
      date: new Date().toISOString(),
    }]);
    setForm((current) => ({ ...emptyForm, currency: current.currency, paidById: current.paidById, participantIds: people.map((person) => person.id) }));
  };

  const personName = (id) => people.find((person) => String(person.id) === String(id))?.name || "Unknown";
  const confirmDeleteExpense = () => {
    if (!expenseToDelete) return;
    updateTripState((current) => removeExpenseFromTripState(current, expenseToDelete.id));
    setExpenseToDelete(null);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title={t("expenses")}
        description={t("expenses_desc")}
        actions={<><CurrencySelect value={displayCurrency} onChange={setDisplayCurrency} /><button className="button primary" onClick={() => openExpenseMode("manual")}>+ {t("add_expense")}</button></>}
      />

      <section className="summary-band" aria-label="Expense summary">
        <div><strong>{fmt(totalSpent, displayCurrency)}</strong><span>{t("total_spent")}</span></div>
        <div><strong>{people.length ? fmt(totalSpent / people.length, displayCurrency) : fmt(0, displayCurrency)}</strong><span>{t("per_person")}</span></div>
        <div><strong>{people.length}</strong><span>{t("people")}</span></div>
        <div className="rate-status"><span>{rateStatus === "live" ? t("live_rates") : t("rates_updated")}</span><strong>{rateDate}</strong></div>
      </section>

      <div className={`expense-workspace${expenseMode !== "manual" ? " expense-workspace-expanded" : ""}`}>
        <section className="surface-panel expense-list-panel">
          <div className="panel-heading"><div><h2>{t("recent_expenses")}</h2></div></div>
          {expenses.length ? (
            <div className="expense-table" role="table">
              <div className="expense-table-head" role="row"><span>Description</span><span>Paid by</span><span>Split</span><span>Date</span><span>Amount</span><span /></div>
              {[...expenses].reverse().map((expense) => {
                const payerIndex = people.findIndex((person) => String(person.id) === String(expense.paidById));
                const payer = people[payerIndex];
                const converted = convert(expense.amount, expense.currency, displayCurrency);
                const shares = getExpenseShares(expense);
                return (
                  <div className="expense-table-row" role="row" key={expense.id}>
                    <span className="expense-primary"><strong>{expense.description}</strong><small>{expense.source === "scan" ? "Scanned receipt" : expense.source === "restaurant" ? "Restaurant split" : "Shared expense"}</small></span>
                    <span className="payer-cell"><PersonAvatar person={payer} people={people} index={payerIndex} size="small" />{personName(expense.paidById)}</span>
                    <span>{expense.shares ? "Custom" : `${shares.length} ${shares.length === 1 ? "person" : "people"}`}</span>
                    <span>{expense.date ? new Date(expense.date).toLocaleDateString(locale, { day: "2-digit", month: "short" }) : "—"}</span>
                    <span className="amount-cell"><strong>{fmt(expense.amount, expense.currency)}</strong>{expense.currency !== displayCurrency && <small>{fmt(converted, displayCurrency)}</small>}</span>
                    <button className="row-action" onClick={() => setExpenseToDelete(expense)}>{t("remove")}</button>
                  </div>
                );
              })}
            </div>
          ) : <div className="empty-copy"><h3>{t("no_expenses")}</h3><p>{t("no_expenses_desc")}</p></div>}
        </section>

        <section className="surface-panel expense-form-panel" ref={formRef}>
          <div className="panel-heading"><div><h2>{t("add_an_expense")}</h2></div></div>
          <div className="expense-entry-tabs" role="tablist" aria-label="Expense type">
            <button type="button" role="tab" aria-selected={expenseMode === "manual"} className={expenseMode === "manual" ? "active" : ""} onClick={() => setExpenseMode("manual")}><LuReceiptText aria-hidden="true" /><span>{t("add_expense")}</span></button>
            <button type="button" role="tab" aria-selected={expenseMode === "scan"} className={expenseMode === "scan" ? "active" : ""} onClick={() => setExpenseMode("scan")}><LuScanLine aria-hidden="true" /><span>{t("scan_receipt")}</span></button>
            <button type="button" role="tab" aria-selected={expenseMode === "restaurant"} className={expenseMode === "restaurant" ? "active" : ""} onClick={() => setExpenseMode("restaurant")}><LuUtensils aria-hidden="true" /><span>{t("restaurant_split")}</span></button>
          </div>
          {expenseMode === "manual" && (!people.length ? (
            <div className="empty-copy compact-empty"><h3>{t("add_people_first")}</h3><p>{t("group_needs_names")}</p><button className="button secondary" onClick={() => navigate("../people")}>{t("overview")}</button></div>
          ) : (
            <div className="form-stack">
              <label className="field-group"><span className="field-label">{t("description")}</span><input value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder={t("what_for")} /></label>
              <div className="amount-grid">
                <label className="field-group"><span className="field-label">{t("amount")}</span><input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} placeholder="0.00" /></label>
                <label className="field-group"><span className="field-label">{t("currency")}</span><CurrencySelect value={form.currency} onChange={(currency) => setForm((current) => ({ ...current, currency }))} /></label>
              </div>
              <label className="field-group"><span className="field-label">{t("paid_by")}</span><select value={form.paidById} onChange={(event) => setForm((current) => ({ ...current, paidById: event.target.value }))}>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
              <div className="split-mode" aria-label="Split method">
                <button className={form.splitMode === "equal" ? "active" : ""} onClick={() => setForm((current) => ({ ...current, splitMode: "equal" }))}>{t("split_equally")}</button>
                <button className={form.splitMode === "custom" ? "active" : ""} onClick={() => setForm((current) => ({ ...current, splitMode: "custom" }))}>{t("custom_amounts")}</button>
              </div>
              <div className="contributors-heading"><span className="field-label">{t("split_between")}</span><button className="text-link" onClick={() => setForm((current) => ({ ...current, participantIds: people.map((person) => person.id) }))}>{t("select_all")}</button></div>
              <div className={`contributor-grid${form.splitMode === "custom" ? " custom" : ""}`}>
                {people.map((person) => {
                  const selected = form.participantIds.includes(person.id);
                  return (
                    <div className={`contributor-control${selected ? " selected" : ""}`} key={person.id}>
                      <button onClick={() => toggleParticipant(person.id)} aria-pressed={selected}><span className="check-box">{selected ? "✓" : ""}</span>{person.name}</button>
                      {form.splitMode === "custom" && selected && <input aria-label={`${person.name} share`} type="number" min="0" step="0.01" placeholder="0.00" value={form.shares[String(person.id)] || ""} onChange={(event) => setForm((current) => ({ ...current, shares: { ...current.shares, [String(person.id)]: event.target.value } }))} />}
                    </div>
                  );
                })}
              </div>
              {error && <p className="form-error">{error}</p>}
              <button className="button primary wide" onClick={saveExpense}>{t("save_expense")}</button>
            </div>
          ))}
          {expenseMode === "scan" && <ScanExpenseForm />}
          {expenseMode === "restaurant" && <RestaurantExpenseForm />}
        </section>
      </div>

      {expenseToDelete && (
        <div className="confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && setExpenseToDelete(null)}>
          <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-expense-title" aria-describedby="delete-expense-description">
            <h2 id="delete-expense-title">{t("delete_expense_confirm_title")}</h2>
            <p id="delete-expense-description">{t("delete_expense_confirm_desc", { description: expenseToDelete.description })}</p>
            <div className="confirm-payment-summary">
              <span><strong>{expenseToDelete.description}</strong> · {personName(expenseToDelete.paidById)}</span>
              <b>{fmt(expenseToDelete.amount, expenseToDelete.currency)}</b>
            </div>
            <div className="confirm-actions">
              <button className="button secondary" autoFocus onClick={() => setExpenseToDelete(null)}>{t("cancel")}</button>
              <button className="button danger" onClick={confirmDeleteExpense}>{t("delete_expense")}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
