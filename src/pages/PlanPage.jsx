import { useState, useMemo } from "react";
import { LuUsers, LuBed, LuTruck, LuCar, LuCalculator, LuChevronUp, LuPlus, LuX } from "react-icons/lu";
import { convert, fmt } from "../utils";
import { CURRENCIES } from "../constants";

function CurrencySelect({ value, onChange, small }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={small ? "currency-select-sm" : "currency-select"}
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}

function VoteBar({ votes, onVote }) {
  return (
    <div className="vote-bar">
      <button className="vote-btn" onClick={onVote} title="Vote">
        <LuChevronUp size={14} />
      </button>
      <span className="vote-count">{votes}</span>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, gradient }) {
  return (
    <div className="section-header">
      <div className="section-icon" style={{ background: gradient }}>{icon}</div>
      <div>
        <div className="section-title">{title}</div>
        {subtitle && <div className="section-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}

const DEFAULT_TRANSPORTS = [
  { id: "plane", label: "Plane", cost: "", currency: "EUR", votes: 0 },
  { id: "car", label: "Car", cost: "", currency: "EUR", votes: 0 },
  { id: "train", label: "Train", cost: "", currency: "EUR", votes: 0 },
  { id: "bus", label: "Bus", cost: "", currency: "EUR", votes: 0 },
];

export default function PlanPage() {
  const [participants, setParticipants] = useState(4);
  const [accommodations, setAccommodations] = useState([]);
  const [accForm, setAccForm] = useState({ name: "", link: "", cost: "", currency: "EUR" });
  const [transports, setTransports] = useState(DEFAULT_TRANSPORTS);
  const [extraTransport, setExtraTransport] = useState({ label: "", cost: "", currency: "EUR", votes: 0 });
  const [showExtraTransport, setShowExtraTransport] = useState(false);
  const [carRentalActive, setCarRentalActive] = useState(false);
  const [carRental, setCarRental] = useState({ costPerDay: "", currency: "EUR", numCars: 1, numDays: 1 });
  const [outputCurrency, setOutputCurrency] = useState("EUR");
  const [nights, setNights] = useState(1);

  const addAccommodation = () => {
    if (!accForm.name || !accForm.cost) return;
    setAccommodations((prev) => [
      ...prev,
      { ...accForm, id: Date.now(), cost: parseFloat(accForm.cost) || 0, votes: 0 },
    ]);
    setAccForm({ name: "", link: "", cost: "", currency: "EUR" });
  };

  const removeAccommodation = (id) =>
    setAccommodations((prev) => prev.filter((a) => a.id !== id));

  const voteAccommodation = (id) =>
    setAccommodations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, votes: a.votes + 1 } : a))
    );

  const updateTransport = (id, field, val) =>
    setTransports((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: val } : t)));

  const voteTransport = (id) =>
    setTransports((prev) =>
      prev.map((t) => (t.id === id ? { ...t, votes: t.votes + 1 } : t))
    );

  const addExtraTransport = () => {
    if (!extraTransport.label) return;
    setTransports((prev) => [
      ...prev,
      { ...extraTransport, id: `extra-${Date.now()}`, cost: parseFloat(extraTransport.cost) || 0 },
    ]);
    setExtraTransport({ label: "", cost: "", currency: "EUR", votes: 0 });
    setShowExtraTransport(false);
  };

  const summary = useMemo(() => {
    const cur = outputCurrency;

    const bestAcc =
      accommodations.length > 0
        ? [...accommodations].sort((a, b) => b.votes - a.votes)[0]
        : null;
    const accCostPerNight = bestAcc ? convert(bestAcc.cost, bestAcc.currency, cur) : 0;
    const totalAccommodation = accCostPerNight * nights;

    const allTransports = transports.filter((t) => parseFloat(t.cost) > 0);
    const bestTransport =
      allTransports.length > 0
        ? [...allTransports].sort((a, b) => b.votes - a.votes)[0]
        : null;
    const transportCostPP = bestTransport
      ? convert(parseFloat(bestTransport.cost), bestTransport.currency, cur)
      : 0;
    const totalTransport = transportCostPP * participants;

    const rentalTotal = carRentalActive
      ? convert(
          (parseFloat(carRental.costPerDay) || 0) * carRental.numCars * carRental.numDays,
          carRental.currency,
          cur
        )
      : 0;

    const grandTotal = totalAccommodation + totalTransport + rentalTotal;
    const perPerson = participants > 0 ? grandTotal / participants : 0;

    return {
      totalAccommodation,
      bestAcc,
      totalTransport,
      bestTransport,
      rentalTotal,
      grandTotal,
      perPerson,
    };
  }, [accommodations, transports, carRentalActive, carRental, outputCurrency, nights, participants]);

  const rentalSubtotal = useMemo(() => {
    if (!carRentalActive) return 0;
    return (parseFloat(carRental.costPerDay) || 0) * carRental.numCars * carRental.numDays;
  }, [carRental, carRentalActive]);

  return (
    <div>
      {/* Participants */}
      <div className="card">
        <SectionHeader
          icon={<LuUsers size={20} color="white" />}
          title="Participants"
          subtitle="How many friends are joining?"
          gradient="linear-gradient(135deg, #4D96FF, #80B4FF)"
        />
        <div className="participants-control">
          <button className="p-btn" onClick={() => setParticipants((p) => Math.max(1, p - 1))}>
            −
          </button>
          <div>
            <div className="p-count">{participants}</div>
            <div className="p-label">travelers</div>
          </div>
          <button className="p-btn" onClick={() => setParticipants((p) => p + 1)}>
            +
          </button>
        </div>
      </div>

      {/* Accommodation */}
      <div className="card">
        <SectionHeader
          icon={<LuBed size={20} color="white" />}
          title="Accommodation"
          subtitle="Add options and vote for your favorite"
          gradient="linear-gradient(135deg, #FF6B6B, #FFA07A)"
        />
        <div className="input-row">
          <input
            placeholder="Name"
            value={accForm.name}
            onChange={(e) => setAccForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            placeholder="Link (optional)"
            value={accForm.link}
            onChange={(e) => setAccForm((f) => ({ ...f, link: e.target.value }))}
          />
        </div>
        <div className="input-row" style={{ marginTop: 8 }}>
          <input
            placeholder="Cost / night"
            type="number"
            min="0"
            value={accForm.cost}
            onChange={(e) => setAccForm((f) => ({ ...f, cost: e.target.value }))}
          />
          <CurrencySelect
            value={accForm.currency}
            onChange={(v) => setAccForm((f) => ({ ...f, currency: v }))}
          />
          <button className="btn btn-primary" onClick={addAccommodation}>
            <LuPlus size={14} /> Add
          </button>
        </div>

        {accommodations.map((a) => (
          <div className="acc-item" key={a.id}>
            <VoteBar votes={a.votes} onVote={() => voteAccommodation(a.id)} />
            <div className="acc-info">
              <div className="acc-name">
                {a.link ? (
                  <a href={a.link} target="_blank" rel="noopener noreferrer">{a.name}</a>
                ) : (
                  a.name
                )}
              </div>
              <div className="acc-cost">{fmt(a.cost, a.currency)} / night</div>
            </div>
            <button className="btn btn-danger" onClick={() => removeAccommodation(a.id)}>
              <LuX size={14} />
            </button>
          </div>
        ))}
        {accommodations.length === 0 && (
          <p style={{ textAlign: "center", color: "#ccc", marginTop: 16, fontSize: 13 }}>
            No accommodation added yet
          </p>
        )}
      </div>

      {/* Transport */}
      <div className="card">
        <SectionHeader
          icon={<LuTruck size={20} color="white" />}
          title="Transport"
          subtitle="Vote and add cost per person for each option"
          gradient="linear-gradient(135deg, #6BCB77, #90E0A0)"
        />
        {transports.map((t) => (
          <div className="transport-item" key={t.id}>
            <VoteBar votes={t.votes} onVote={() => voteTransport(t.id)} />
            <span className="transport-label">{t.label}</span>
            <input
              placeholder="Cost / person"
              type="number"
              min="0"
              value={t.cost}
              onChange={(e) => updateTransport(t.id, "cost", e.target.value)}
              style={{ flex: 1 }}
            />
            <CurrencySelect
              small
              value={t.currency}
              onChange={(v) => updateTransport(t.id, "currency", v)}
            />
          </div>
        ))}

        {showExtraTransport ? (
          <div className="transport-item" style={{ borderLeft: "3px solid var(--mint)" }}>
            <input
              placeholder="Transport name"
              value={extraTransport.label}
              onChange={(e) => setExtraTransport((f) => ({ ...f, label: e.target.value }))}
              style={{ flex: 1 }}
            />
            <input
              placeholder="Cost / person"
              type="number"
              min="0"
              value={extraTransport.cost}
              onChange={(e) => setExtraTransport((f) => ({ ...f, cost: e.target.value }))}
              style={{ flex: 1 }}
            />
            <CurrencySelect
              small
              value={extraTransport.currency}
              onChange={(v) => setExtraTransport((f) => ({ ...f, currency: v }))}
            />
            <button className="btn btn-mint" onClick={addExtraTransport}>
              Add
            </button>
          </div>
        ) : (
          <button
            className="btn btn-secondary"
            style={{ marginTop: 10, width: "100%" }}
            onClick={() => setShowExtraTransport(true)}
          >
            <LuPlus size={14} /> Add alternative transport
          </button>
        )}
      </div>

      {/* Car Rentals */}
      <div className="card">
        <SectionHeader
          icon={<LuCar size={20} color="white" />}
          title="Car Rentals"
          subtitle="Need wheels at your destination?"
          gradient="linear-gradient(135deg, #C084FC, #F472B6)"
        />
        <div className="toggle-row">
          <button
            className={`toggle${carRentalActive ? " active" : ""}`}
            onClick={() => setCarRentalActive((v) => !v)}
          >
            <div className="toggle-knob" />
          </button>
          <span className="toggle-label">{carRentalActive ? "Enabled" : "Disabled"}</span>
        </div>

        {carRentalActive && (
          <div className="rental-grid">
            <div className="rental-field">
              <label>Cost / day / car</label>
              <div className="input-row">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={carRental.costPerDay}
                  onChange={(e) => setCarRental((r) => ({ ...r, costPerDay: e.target.value }))}
                />
                <CurrencySelect
                  small
                  value={carRental.currency}
                  onChange={(v) => setCarRental((r) => ({ ...r, currency: v }))}
                />
              </div>
            </div>
            <div className="rental-field">
              <label>Number of cars</label>
              <input
                type="number"
                min="1"
                value={carRental.numCars}
                onChange={(e) =>
                  setCarRental((r) => ({
                    ...r,
                    numCars: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
              />
            </div>
            <div className="rental-field">
              <label>Number of days</label>
              <input
                type="number"
                min="1"
                value={carRental.numDays}
                onChange={(e) =>
                  setCarRental((r) => ({
                    ...r,
                    numDays: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
              />
            </div>
            <div className="rental-field" />
            <div className="rental-subtotal">
              Rental Subtotal: {fmt(rentalSubtotal, carRental.currency)}
            </div>
          </div>
        )}
      </div>

      {/* Cost Summary */}
      <div className="card">
        <SectionHeader
          icon={<LuCalculator size={20} color="white" />}
          title="Cost Summary"
          subtitle="Your total holiday cost breakdown"
          gradient="linear-gradient(135deg, #FFD93D, #FFE57A)"
        />

        <div className="summary-controls">
          <div>
            <label>Output Currency</label>
            <CurrencySelect value={outputCurrency} onChange={setOutputCurrency} />
          </div>
          <div>
            <label>Number of Nights</label>
            <input
              type="number"
              min="1"
              value={nights}
              onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>

        <div className="summary-rows">
          <div className="summary-row">
            <div>
              <div className="summary-row-label">
                Accommodation ({nights} night{nights > 1 ? "s" : ""})
              </div>
              {summary.bestAcc && (
                <div className="summary-row-note">
                  Best voted: {summary.bestAcc.name} (
                  {fmt(summary.bestAcc.cost, summary.bestAcc.currency)}/night)
                </div>
              )}
            </div>
            <span className="summary-row-value">
              {fmt(summary.totalAccommodation, outputCurrency)}
            </span>
          </div>

          <div className="summary-row">
            <div>
              <div className="summary-row-label">Transport ({participants} pers.)</div>
              {summary.bestTransport && (
                <div className="summary-row-note">
                  Best voted: {summary.bestTransport.label} (
                  {fmt(parseFloat(summary.bestTransport.cost), summary.bestTransport.currency)}
                  /pers.)
                </div>
              )}
            </div>
            <span className="summary-row-value">
              {fmt(summary.totalTransport, outputCurrency)}
            </span>
          </div>

          {carRentalActive && (
            <div className="summary-row">
              <div>
                <div className="summary-row-label">Car Rentals</div>
                <div className="summary-row-note">
                  {carRental.numCars} car{carRental.numCars > 1 ? "s" : ""} &times;{" "}
                  {carRental.numDays} day{carRental.numDays > 1 ? "s" : ""}
                </div>
              </div>
              <span className="summary-row-value">{fmt(summary.rentalTotal, outputCurrency)}</span>
            </div>
          )}
        </div>

        <div className="summary-total">
          <div className="summary-total-label">Total Vacation Cost</div>
          <div className="summary-total-value">{fmt(summary.grandTotal, outputCurrency)}</div>
          <div className="summary-per-person">
            {fmt(summary.perPerson, outputCurrency)} per person
          </div>
        </div>

        <p className="rate-note">
          Exchange rates: 1 EUR ≈ 1.08 USD ≈ 4.97 RON (indicative — update as needed)
        </p>
      </div>
    </div>
  );
}
