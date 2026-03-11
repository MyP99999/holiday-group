import { useState } from "react";
import { LuReceipt, LuList, LuX, LuPlus } from "react-icons/lu";
import { useApp } from "../context/AppContext";
import { personColor, fmt } from "../utils";
import { CURRENCIES, CURRENCY_SYMBOLS } from "../constants";

function CurrencySelect({ value, onChange }) {
  return (
    <select className="currency-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  );
}

export default function ExpensesPage() {
  const { people, expenses, setExpenses } = useApp();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    currency: "EUR",
    paidById: "",
    participantIds: [],
  });

  const toggleParticipant = (id) =>
    setForm((f) => ({
      ...f,
      participantIds: f.participantIds.includes(id)
        ? f.participantIds.filter((p) => p !== id)
        : [...f.participantIds, id],
    }));

  const selectAll = () => setForm((f) => ({ ...f, participantIds: people.map((p) => p.id) }));

  const addExpense = () => {
    if (!form.description.trim() || !form.amount || !form.paidById || form.participantIds.length === 0)
      return;
    setExpenses((prev) => [
      ...prev,
      {
        id: Date.now(),
        description: form.description.trim(),
        amount: parseFloat(form.amount) || 0,
        currency: form.currency,
        paidById: form.paidById,
        participantIds: form.participantIds,
        date: new Date().toLocaleDateString(),
      },
    ]);
    setForm((f) => ({ ...f, description: "", amount: "" }));
  };

  const removeExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  const personName = (id) => people.find((p) => String(p.id) === String(id))?.name || "?";
  const personIdx = (id) => people.findIndex((p) => String(p.id) === String(id));

  if (people.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon"><LuReceipt size={44} color="#ddd" /></div>
          <div>Add people first before tracking expenses</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="section-header">
          <div className="section-icon" style={{ background: "linear-gradient(135deg, #FF6B6B, #FFA07A)" }}>
            <LuReceipt size={20} color="white" />
          </div>
          <div>
            <div className="section-title">Add Expense</div>
            <div className="section-subtitle">Track who paid and for whom</div>
          </div>
        </div>

        <div className="expense-form">
          <div>
            <span className="form-label">Description</span>
            <input
              placeholder="e.g. Dinner, Hotel, Gas..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              style={{ width: "100%" }}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <span className="form-label">Amount</span>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="form-field" style={{ flex: "0 0 auto" }}>
              <span className="form-label">Currency</span>
              <CurrencySelect value={form.currency} onChange={(v) => setForm((f) => ({ ...f, currency: v }))} />
            </div>
          </div>

          <div>
            <span className="form-label">Paid by</span>
            <select
              value={form.paidById}
              onChange={(e) => setForm((f) => ({ ...f, paidById: e.target.value }))}
              style={{ width: "100%" }}
            >
              <option value="">Select who paid...</option>
              {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span className="form-label" style={{ margin: 0 }}>Split between</span>
              <button className="btn btn-secondary" style={{ padding: "4px 12px", fontSize: 12 }} onClick={selectAll}>
                Select all
              </button>
            </div>
            <div className="participant-selector">
              {people.map((p, i) => {
                const selected = form.participantIds.includes(p.id);
                const color = personColor(i);
                return (
                  <div
                    key={p.id}
                    className={`participant-chip${selected ? " selected" : ""}`}
                    style={selected ? { color, borderColor: color } : {}}
                    onClick={() => toggleParticipant(p.id)}
                  >
                    <span className="chip-dot" style={{ background: color }} />
                    {p.name}
                  </div>
                );
              })}
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: "100%" }} onClick={addExpense}>
            <LuPlus size={15} /> Add Expense
          </button>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="card">
          <div className="section-header">
            <div className="section-icon" style={{ background: "linear-gradient(135deg, #6BCB77, #90E0A0)" }}>
              <LuList size={20} color="white" />
            </div>
            <div>
              <div className="section-title">All Expenses</div>
              <div className="section-subtitle">
                {expenses.length} expense{expenses.length !== 1 ? "s" : ""} recorded
              </div>
            </div>
          </div>

          <div className="expense-list">
            {[...expenses].reverse().map((exp) => {
              const idx = personIdx(exp.paidById);
              const color = personColor(idx);
              const splitNames = exp.participantIds.map(personName).join(", ");
              const perPerson = exp.amount / exp.participantIds.length;
              return (
                <div className="expense-item" key={exp.id}>
                  <div className="person-avatar" style={{ background: color, width: 36, height: 36, fontSize: 14 }}>
                    {personName(exp.paidById)[0]?.toUpperCase()}
                  </div>
                  <div className="expense-info">
                    <div className="expense-desc">{exp.description}</div>
                    <div className="expense-meta">
                      Paid by <strong>{personName(exp.paidById)}</strong>
                    </div>
                    <div className="expense-meta">
                      Split with {splitNames} &middot; {CURRENCY_SYMBOLS[exp.currency]}{perPerson.toFixed(2)}/person
                    </div>
                    {exp.date && <div className="expense-meta">{exp.date}</div>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span className="expense-amount">
                      {CURRENCY_SYMBOLS[exp.currency]}{exp.amount.toFixed(2)}
                    </span>
                    <button className="btn btn-danger" style={{ padding: "4px 8px" }} onClick={() => removeExpense(exp.id)}>
                      <LuX size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {expenses.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><LuReceipt size={44} color="#ddd" /></div>
          <div>No expenses yet — add your first one!</div>
        </div>
      )}
    </div>
  );
}
