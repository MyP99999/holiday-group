import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CurrencySelect from "../components/CurrencySelect";
import PersonAvatar from "../components/PersonAvatar";
import { useApp } from "../context/AppContext";
import { fmt } from "../utils";
import { useLanguage } from "../context/LanguageContext";
import { useCurrencyRates } from "../context/CurrencyRatesContext";

const sampleItems = [
  { id: "seafood", description: "Seafood pasta", amount: 24, participantIds: [] },
  { id: "wine", description: "House wine", amount: 18, participantIds: [] },
  { id: "tiramisu", description: "Tiramisu", amount: 9, participantIds: [] },
  { id: "service", description: "Service", amount: 5.1, participantIds: [] },
];

export function ScanExpenseForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { selectedCurrency } = useCurrencyRates();
  const inputRef = useRef(null);
  const { people, setExpenses } = useApp();
  const [items, setItems] = useState([]);
  const [currency, setCurrency] = useState(selectedCurrency);
  const [paidById, setPaidById] = useState("");
  const [receiptName, setReceiptName] = useState("Lido receipt");
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (people.length && !paidById) setPaidById(String(people[0].id));
  }, [people, paidById]);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const loadExtractedItems = (file) => {
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
      setReceiptName(file.name.replace(/\.[^/.]+$/, "") || "Scanned receipt");
    }
    setStatus("processing");
    setMessage("");
    window.setTimeout(() => {
      setItems(sampleItems.map((item, index) => ({
        ...item,
        participantIds: people.length ? [people[index % people.length].id] : [],
      })));
      setStatus("ready");
    }, 650);
  };

  const toggleContributor = (itemId, personId) => {
    setItems((current) => current.map((item) => item.id === itemId ? {
      ...item,
      participantIds: item.participantIds.includes(personId)
        ? item.participantIds.filter((id) => id !== personId)
        : [...item.participantIds, personId],
    } : item));
  };

  const addItems = () => {
    const validItems = items.filter((item) => item.description.trim() && Number(item.amount) > 0 && item.participantIds.length);
    if (!paidById || validItems.length !== items.length) {
      setMessage("Choose a payer and at least one contributor for every item.");
      return;
    }
    const stamp = Date.now();
    setExpenses((current) => [...current, ...validItems.map((item, index) => ({
      id: stamp + index,
      description: item.description.trim(),
      amount: Number(item.amount),
      currency,
      paidById,
      participantIds: item.participantIds,
      source: "scan",
      receiptName,
      date: new Date().toISOString(),
    }))]);
    setMessage(`${validItems.length} receipt items added to the trip.`);
  };

  const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="expense-tool-content">
      {!people.length ? (
        <section className="surface-panel empty-copy"><h2>{t("add_group_first")}</h2><p>{t("receipt_people_desc")}</p><button className="button primary" onClick={() => navigate("../people")}>{t("add_person")}</button></section>
      ) : (
        <div className="scan-layout">
          <section className={`scan-upload surface-panel${status === "ready" ? " is-ready" : ""}`}>
            <div className="receipt-paper" aria-hidden="true"><span /><span /><span /><span /><b>€</b></div>
            <div className="scan-actions">
              <h2>{status === "processing" ? t("reading_receipt") : t("photograph_upload")}</h2>
              <p>{t("scan_prototype_note")}</p>
              <input ref={inputRef} className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={(event) => event.target.files?.[0] && loadExtractedItems(event.target.files[0])} />
              <button className="button primary" onClick={() => inputRef.current?.click()}>{t("take_photo")}</button>
              <button className="button secondary" onClick={() => inputRef.current?.click()}>{t("choose_library")}</button>
              <button className="text-link" onClick={() => loadExtractedItems()}>{t("sample_receipt")}</button>
            </div>
            {preview && <img className="receipt-preview" src={preview} alt="Uploaded receipt preview" />}
          </section>

          {status === "ready" && (
            <section className="surface-panel extracted-panel">
              <div className="panel-heading receipt-heading">
                <div><h2>{receiptName}</h2><p>{t("tap_initials")}</p></div>
                <CurrencySelect value={currency} onChange={setCurrency} />
              </div>
              <label className="paid-by-inline"><span>{t("paid_by")}</span><select value={paidById} onChange={(event) => setPaidById(event.target.value)}>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
              <div className="receipt-item-list">
                {items.map((item, itemIndex) => (
                  <div className="receipt-item" key={item.id}>
                    <input aria-label={`Item ${itemIndex + 1} description`} value={item.description} onChange={(event) => setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, description: event.target.value } : candidate))} />
                    <input aria-label={`${item.description} amount`} className="item-amount-input" type="number" step="0.01" value={item.amount} onChange={(event) => setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, amount: event.target.value } : candidate))} />
                    <div className="initial-selectors">
                      {people.map((person, index) => <button key={person.id} className={item.participantIds.includes(person.id) ? "selected" : ""} onClick={() => toggleContributor(item.id, person.id)} aria-label={`${person.name} shared ${item.description}`}><PersonAvatar person={person} people={people} index={index} size="small" inControl /></button>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="receipt-total"><span>Total</span><strong>{fmt(total, currency)}</strong></div>
              {message && <p className={message.includes("added") ? "form-success" : "form-error"}>{message}</p>}
              <button className="button primary wide" onClick={addItems}>{t("add_items_trip", { count: items.length })}</button>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function ScanPage() {
  return <Navigate to="../expenses" replace state={{ expenseMode: "scan" }} />;
}
