import { useState } from "react";
import { LuChartBar, LuArrowRightLeft, LuArrowRight, LuCircleCheck } from "react-icons/lu";
import { useApp } from "../context/AppContext";
import { convert, fmt, personColor } from "../utils";
import { CURRENCIES } from "../constants";

function calculateSettlements(people, expenses) {
  const balances = {};
  people.forEach((p) => (balances[String(p.id)] = 0));

  expenses.forEach((exp) => {
    const amountEUR = convert(exp.amount, exp.currency, "EUR");
    balances[String(exp.paidById)] += amountEUR;
    const share = amountEUR / exp.participantIds.length;
    exp.participantIds.forEach((pid) => {
      balances[String(pid)] -= share;
    });
  });

  const creditors = Object.entries(balances)
    .filter(([, b]) => b > 0.005)
    .map(([id, amount]) => ({ id, amount }));
  const debtors = Object.entries(balances)
    .filter(([, b]) => b < -0.005)
    .map(([id, amount]) => ({ id, amount: -amount }));

  const transactions = [];
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const cred = creditors[i];
    const debt = debtors[j];
    const amount = Math.min(cred.amount, debt.amount);
    transactions.push({ from: debt.id, to: cred.id, amountEUR: amount });
    cred.amount -= amount;
    debt.amount -= amount;
    if (cred.amount < 0.005) i++;
    if (debt.amount < 0.005) j++;
  }

  return { balances, transactions };
}

export default function SettlePage() {
  const { people, expenses } = useApp();
  const [outputCurrency, setOutputCurrency] = useState("EUR");

  if (people.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon"><LuArrowRightLeft size={44} color="#ddd" /></div>
          <div>Add people and expenses to see who owes what</div>
        </div>
      </div>
    );
  }

  const { balances, transactions } = calculateSettlements(people, expenses);
  const personName = (id) => people.find((p) => String(p.id) === String(id))?.name || "?";
  const personIdx = (id) => people.findIndex((p) => String(p.id) === String(id));

  return (
    <div>
      <div className="card">
        <div className="section-header">
          <div className="section-icon" style={{ background: "linear-gradient(135deg, #4D96FF, #80B4FF)" }}>
            <LuChartBar size={20} color="white" />
          </div>
          <div>
            <div className="section-title">Balances</div>
            <div className="section-subtitle">Who paid more or less than their share</div>
          </div>
        </div>

        <div className="currency-row">
          <label>Show in</label>
          <select className="currency-select" value={outputCurrency} onChange={(e) => setOutputCurrency(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="balance-list">
          {people.map((p, i) => {
            const rawBalance = balances[String(p.id)] || 0;
            const bal = convert(rawBalance, "EUR", outputCurrency);
            const balClass =
              bal > 0.01 ? "balance-positive"
              : bal < -0.01 ? "balance-negative"
              : "balance-neutral";
            const balLabel =
              bal > 0.01 ? `gets back ${fmt(bal, outputCurrency)}`
              : bal < -0.01 ? `owes ${fmt(Math.abs(bal), outputCurrency)}`
              : "all settled";
            return (
              <div className="balance-row" key={p.id}>
                <div className="person-avatar" style={{ background: personColor(i), width: 36, height: 36, fontSize: 14 }}>
                  {p.name[0].toUpperCase()}
                </div>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                <span className={`person-balance ${balClass}`}>{balLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-icon" style={{ background: "linear-gradient(135deg, #6BCB77, #90E0A0)" }}>
            <LuArrowRightLeft size={20} color="white" />
          </div>
          <div>
            <div className="section-title">Settle Up</div>
            <div className="section-subtitle">Minimum payments to clear all debts</div>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><LuCircleCheck size={44} color="#ddd" /></div>
            <div>{expenses.length === 0 ? "No expenses yet!" : "Everything is already settled!"}</div>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.map((t, idx) => {
              const fromIdx = personIdx(t.from);
              const toIdx = personIdx(t.to);
              const amount = convert(t.amountEUR, "EUR", outputCurrency);
              return (
                <div className="transaction-card" key={idx}>
                  <div className="person-avatar" style={{ background: personColor(fromIdx), width: 36, height: 36, fontSize: 14 }}>
                    {personName(t.from)[0].toUpperCase()}
                  </div>
                  <div className="transaction-text">
                    <strong>{personName(t.from)}</strong>{" "}
                    <span className="owes-word">owes</span>{" "}
                    <strong>{personName(t.to)}</strong>
                  </div>
                  <div className="person-avatar" style={{ background: personColor(toIdx), width: 36, height: 36, fontSize: 14 }}>
                    {personName(t.to)[0].toUpperCase()}
                  </div>
                  <span className="transaction-amount">{fmt(amount, outputCurrency)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
