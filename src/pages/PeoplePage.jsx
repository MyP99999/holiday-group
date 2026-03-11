import { useState } from "react";
import { LuUsers, LuX, LuUserPlus } from "react-icons/lu";
import { useApp } from "../context/AppContext";
import { convert, fmt, personColor } from "../utils";

export default function PeoplePage() {
  const { people, setPeople, expenses } = useApp();
  const [name, setName] = useState("");

  const addPerson = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (people.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) return;
    setPeople((prev) => [...prev, { id: Date.now(), name: trimmed }]);
    setName("");
  };

  const removePerson = (id) => setPeople((prev) => prev.filter((p) => p.id !== id));

  function getBalance(personId) {
    let balance = 0;
    expenses.forEach((exp) => {
      const amountEUR = convert(exp.amount, exp.currency, "EUR");
      if (String(exp.paidById) === String(personId)) balance += amountEUR;
      if (exp.participantIds.map(String).includes(String(personId)))
        balance -= amountEUR / exp.participantIds.length;
    });
    return balance;
  }

  return (
    <div>
      <div className="card">
        <div className="section-header">
          <div className="section-icon" style={{ background: "linear-gradient(135deg, #4D96FF, #80B4FF)" }}>
            <LuUsers size={20} color="white" />
          </div>
          <div>
            <div className="section-title">People</div>
            <div className="section-subtitle">Add everyone joining the trip</div>
          </div>
        </div>
        <div className="input-row">
          <input
            placeholder="Enter a name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPerson()}
          />
          <button className="btn btn-primary" onClick={addPerson}>
            <LuUserPlus size={15} /> Add
          </button>
        </div>
      </div>

      {people.length > 0 && (
        <div className="card">
          <div className="people-list">
            {people.map((p, i) => {
              const balance = getBalance(p.id);
              const hasExpenses = expenses.length > 0;
              const balClass =
                balance > 0.01 ? "balance-positive"
                : balance < -0.01 ? "balance-negative"
                : "balance-neutral";
              const balLabel =
                balance > 0.01 ? `gets back ${fmt(balance, "EUR")}`
                : balance < -0.01 ? `owes ${fmt(Math.abs(balance), "EUR")}`
                : "settled";
              return (
                <div className="person-card" key={p.id}>
                  <div
                    className="person-avatar"
                    style={{ background: personColor(i), width: 40, height: 40, fontSize: 16 }}
                  >
                    {p.name[0].toUpperCase()}
                  </div>
                  <span className="person-name">{p.name}</span>
                  {hasExpenses && (
                    <span className={`person-balance ${balClass}`}>{balLabel}</span>
                  )}
                  <button className="btn btn-danger" onClick={() => removePerson(p.id)}>
                    <LuX size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {people.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"><LuUsers size={44} color="#ddd" /></div>
          <div>Add your friends to get started!</div>
        </div>
      )}
    </div>
  );
}
