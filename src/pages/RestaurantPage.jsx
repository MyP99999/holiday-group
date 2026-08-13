import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CurrencySelect from "../components/CurrencySelect";
import { useApp } from "../context/AppContext";
import { fmt } from "../utils";
import { useLanguage } from "../context/LanguageContext";
import { useCurrencyRates } from "../context/CurrencyRatesContext";

function starterItems(people) {
  if (!people.length) return [];
  return [
    { id: 1, name: "Margherita", amount: 14, participantIds: [people[0].id] },
    { id: 2, name: "Seafood pasta", amount: 24, participantIds: people.slice(1, 3).map((person) => person.id) },
    { id: 3, name: "Sparkling water", amount: 8, participantIds: people.map((person) => person.id) },
  ];
}

export function RestaurantExpenseForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { selectedCurrency } = useCurrencyRates();
  const { people, setExpenses } = useApp();
  const [restaurantName, setRestaurantName] = useState("Restaurant bill");
  const [currency, setCurrency] = useState(selectedCurrency);
  const [paidById, setPaidById] = useState("");
  const [items, setItems] = useState([]);
  const [tip, setTip] = useState(10);
  const [tax, setTax] = useState(5.4);
  const [message, setMessage] = useState("");
  const initializedItems = useRef(false);

  useEffect(() => {
    if (people.length && !paidById) setPaidById(String(people[0].id));
    if (people.length && !initializedItems.current) {
      setItems(starterItems(people));
      initializedItems.current = true;
    }
  }, [people, paidById]);

  const allocations = useMemo(() => {
    const base = Object.fromEntries(people.map((person) => [String(person.id), 0]));
    items.forEach((item) => {
      const amount = Number(item.amount) || 0;
      const recipients = item.participantIds || [];
      if (!recipients.length) return;
      recipients.forEach((id) => { base[String(id)] += amount / recipients.length; });
    });
    const subtotal = Object.values(base).reduce((sum, amount) => sum + amount, 0);
    const extras = subtotal * ((Number(tip) || 0) / 100) + (Number(tax) || 0);
    const activeIds = Object.keys(base).filter((id) => base[id] > 0);
    activeIds.forEach((id) => {
      base[id] += subtotal > 0 ? extras * (base[id] / subtotal) : extras / activeIds.length;
    });
    return base;
  }, [items, people, tip, tax]);

  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const total = subtotal + subtotal * ((Number(tip) || 0) / 100) + (Number(tax) || 0);

  const toggleParticipant = (itemId, personId) => setItems((current) => current.map((item) => item.id === itemId ? {
    ...item,
    participantIds: item.participantIds.includes(personId)
      ? item.participantIds.filter((id) => id !== personId)
      : [...item.participantIds, personId],
  } : item));

  const addItem = () => setItems((current) => [...current, { id: Date.now(), name: "", amount: "", participantIds: [] }]);

  const saveRestaurantSplit = () => {
    if (!paidById || !restaurantName.trim() || items.some((item) => !item.name.trim() || !Number(item.amount) || !item.participantIds.length)) {
      setMessage("Complete every item and choose who shared it.");
      return;
    }
    const shares = Object.fromEntries(Object.entries(allocations).filter(([, amount]) => amount > 0).map(([id, amount]) => [id, Number(amount.toFixed(2))]));
    const roundedTotal = Object.values(shares).reduce((sum, amount) => sum + amount, 0);
    const difference = Number((total - roundedTotal).toFixed(2));
    const firstId = Object.keys(shares)[0];
    if (firstId && difference) shares[firstId] = Number((shares[firstId] + difference).toFixed(2));

    setExpenses((current) => [...current, {
      id: Date.now(),
      description: restaurantName.trim(),
      amount: Number(total.toFixed(2)),
      currency,
      paidById,
      participantIds: Object.keys(shares),
      shares,
      source: "restaurant",
      date: new Date().toISOString(),
      restaurantItems: items,
    }]);
    setMessage("Restaurant split saved to the trip.");
  };

  return (
    <div className="expense-tool-content">
      {!people.length ? (
        <section className="surface-panel empty-copy"><h2>{t("add_group_first")}</h2><p>{t("restaurant_people_desc")}</p><button className="button primary" onClick={() => navigate("../people")}>{t("add_person")}</button></section>
      ) : (
        <section className="surface-panel restaurant-panel">
          <div className="restaurant-toolbar">
            <label className="field-group restaurant-name"><span className="field-label">{t("restaurant")}</span><input value={restaurantName} onChange={(event) => setRestaurantName(event.target.value)} /></label>
            <label className="field-group"><span className="field-label">{t("paid_by")}</span><select value={paidById} onChange={(event) => setPaidById(event.target.value)}>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
            <label className="field-group"><span className="field-label">{t("currency")}</span><CurrencySelect value={currency} onChange={setCurrency} /></label>
          </div>

          <div className="guest-key">{people.map((person) => <span key={person.id}>{person.name}</span>)}</div>

          <div className="restaurant-table">
            <div className="restaurant-table-head"><span>{t("item")}</span><span>{t("amount")}</span><span>{t("shared_with")}</span><span /></div>
            {items.map((item) => (
              <div className="restaurant-row" key={item.id}>
                <input aria-label="Dish name" value={item.name} onChange={(event) => setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, name: event.target.value } : candidate))} placeholder="Dish or drink" />
                <input aria-label={`${item.name || "Item"} amount`} type="number" step="0.01" min="0" value={item.amount} onChange={(event) => setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, amount: event.target.value } : candidate))} placeholder="0.00" />
                <div className="name-selectors">{people.map((person) => <button key={person.id} className={item.participantIds.includes(person.id) ? "selected" : ""} onClick={() => toggleParticipant(item.id, person.id)}>{person.name}</button>)}</div>
                <button className="row-action" onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))}>{t("remove")}</button>
              </div>
            ))}
            <button className="text-link add-row-link" onClick={addItem}>+ {t("add_item")}</button>
          </div>

          <div className="restaurant-footer">
            <div className="restaurant-extras">
              <label><span>{t("tip")}</span><span className="suffix-input"><input type="number" min="0" value={tip} onChange={(event) => setTip(event.target.value)} /><b>%</b></span></label>
              <label><span>{t("tax")}</span><input type="number" min="0" step="0.01" value={tax} onChange={(event) => setTax(event.target.value)} /></label>
            </div>
            <div className="restaurant-summary">
              <div className="table-total"><span>{t("table_total")}</span><strong>{fmt(total, currency)}</strong></div>
              <p>{people.filter((person) => allocations[String(person.id)] > 0).map((person) => `${person.name} ${fmt(allocations[String(person.id)], currency)}`).join(" · ")}</p>
              {message && <p className={message.includes("saved") ? "form-success" : "form-error"}>{message}</p>}
              <button className="button primary" onClick={saveRestaurantSplit}>{t("save_restaurant")}</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function RestaurantPage() {
  return <Navigate to="../expenses" replace state={{ expenseMode: "restaurant" }} />;
}
