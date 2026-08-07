import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import CurrencySelect from "../components/CurrencySelect";
import PersonAvatar from "../components/PersonAvatar";
import { useApp } from "../context/AppContext";
import { convert, fmt, getExpenseShares } from "../utils";
import { useLanguage } from "../context/LanguageContext";
import { useCurrencyRates } from "../context/CurrencyRatesContext";

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
  const { t, locale } = useLanguage();
  const { rateDate, status: rateStatus } = useCurrencyRates();
  const formRef = useRef(null);
  const { people, expenses, setExpenses } = useApp();
  const [displayCurrency, setDisplayCurrency] = useState("EUR");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const totalSpent = useMemo(
    () => expenses.reduce((sum, expense) => sum + convert(expense.amount, expense.currency, displayCurrency), 0),
    [expenses, displayCurrency, rateDate]
  );

  useEffect(() => {
    if (people.length && !form.paidById) {
      setForm((current) => ({ ...current, paidById: String(people[0].id), participantIds: people.map((person) => person.id) }));
    }
  }, [people, form.paidById]);

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

  return (
    <div className="page-stack">
      <PageHeader
        title={t("expenses")}
        description={t("expenses_desc")}
        actions={<><CurrencySelect value={displayCurrency} onChange={setDisplayCurrency} /><button className="button primary" onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>+ {t("add_expense")}</button></>}
      />

      <section className="summary-band" aria-label="Expense summary">
        <div><strong>{fmt(totalSpent, displayCurrency)}</strong><span>{t("total_spent")}</span></div>
        <div><strong>{people.length ? fmt(totalSpent / people.length, displayCurrency) : fmt(0, displayCurrency)}</strong><span>{t("per_person")}</span></div>
        <div><strong>{people.length}</strong><span>{t("people")}</span></div>
        <div className="rate-status"><span>{rateStatus === "live" ? t("live_rates") : t("rates_updated")}</span><strong>{rateDate}</strong></div>
      </section>

      <div className="expense-workspace">
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
                    <button className="row-action" onClick={() => setExpenses((current) => current.filter((item) => item.id !== expense.id))}>Remove</button>
                  </div>
                );
              })}
            </div>
          ) : <div className="empty-copy"><h3>{t("no_expenses")}</h3><p>{t("no_expenses_desc")}</p></div>}
        </section>

        <aside className="surface-panel expense-form-panel" ref={formRef}>
          <div className="panel-heading"><div><h2>{t("add_an_expense")}</h2></div></div>
          {!people.length ? (
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
              <button className="text-link centered-link" onClick={() => navigate("../scan")}>Scan a receipt instead</button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
