import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import CurrencySelect from "../components/CurrencySelect";
import PersonAvatar from "../components/PersonAvatar";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { useCurrencyRates } from "../context/CurrencyRatesContext";
import { createId, normalizeVehicleSeats } from "../storage/tripState";
import { convert, fmt } from "../utils";
import { appendActivity, changedActivityFields, createActivityEntry } from "../utils/activityLog";
import { validateTripDates } from "../utils/tripDates";
import {
  buildLogisticsExpenses,
  getFlightShares,
  getOtherCostShares,
  getRentalShares,
  getStayShares,
  logisticsObligations,
  uniqueIds,
} from "../utils/logisticsCosts";

const emptyStay = { name: "", location: "", nights: 1, price: "", currency: "EUR", paidById: "", splitMode: "people" };
const emptyCar = { name: "", seats: 5 };
const emptyFlight = {
  airline: "", flightNumber: "", from: "", to: "",
  departureDate: "", departureTime: "", arrivalDate: "", arrivalTime: "",
  price: "", currency: "EUR", paidById: "",
};
const emptyOtherCost = { title: "", amount: "", currency: "EUR", paidById: "" };

function CommentThread({ targetType, targetId }) {
  const { t, locale } = useLanguage();
  const { comments, setComments, people, currentMemberId } = useApp();
  const [text, setText] = useState("");
  const items = comments.filter((comment) => comment.targetType === targetType && String(comment.targetId) === String(targetId));
  const authorId = currentMemberId || people[0]?.id;
  const personName = (id) => people.find((person) => String(person.id) === String(id))?.name || t("member");

  const submit = () => {
    if (!text.trim() || !authorId) return;
    setComments((current) => [...current, {
      id: createId("comment"), targetType, targetId, authorId,
      text: text.trim(), createdAt: new Date().toISOString(),
    }]);
    setText("");
  };

  return (
    <div className="comment-thread">
      <strong className="comment-title">{t("comments")}</strong>
      {items.map((comment) => (
        <p className="comment-row" key={comment.id}><strong>{personName(comment.authorId)}</strong><span>{comment.text}</span><time>{new Date(comment.createdAt).toLocaleDateString(locale, { day: "numeric", month: "short" })}</time></p>
      ))}
      <div className="comment-composer"><input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder={t("comment_placeholder")} /><button className="text-link" onClick={submit}>{t("add_comment")}</button></div>
    </div>
  );
}

export default function PlanPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    rateDate,
    selectedCurrency: outputCurrency, setSelectedCurrency: setOutputCurrency,
  } = useCurrencyRates();
  const {
    people, tripStartDate, tripEndDate, accommodations, setAccommodations, vehicles, setVehicles, flights, setFlights,
    otherCosts, setOtherCosts, logisticsPayments, setLogisticsPayments, settlementPayments,
    currentMemberId, currentPerson, canManageMembers, updateTripState,
  } = useApp();
  const [showStayForm, setShowStayForm] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [showOtherForm, setShowOtherForm] = useState(false);
  const [stayForm, setStayForm] = useState(() => ({ ...emptyStay, currency: outputCurrency }));
  const [carForm, setCarForm] = useState(emptyCar);
  const [flightForm, setFlightForm] = useState(() => ({ ...emptyFlight, currency: outputCurrency }));
  const [otherForm, setOtherForm] = useState(() => ({ ...emptyOtherCost, currency: outputCurrency }));
  const [paymentDraft, setPaymentDraft] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [tripDateForm, setTripDateForm] = useState({ startDate: tripStartDate || "", endDate: tripEndDate || "" });
  const [tripDateMessage, setTripDateMessage] = useState("");
  const [stayEdit, setStayEdit] = useState(null);
  const [carEdit, setCarEdit] = useState(null);
  const defaultPayerId = String(currentMemberId || people[0]?.id || "");

  const personName = (id) => people.find((person) => String(person.id) === String(id))?.name || t("unassigned");
  const personById = (id) => people.find((person) => String(person.id) === String(id));
  const personIndex = (id) => people.findIndex((person) => String(person.id) === String(id));
  const startDecision = (category, question, option) => navigate("../decisions", {
    state: {
      decisionRequest: { id: createId("decision-request"), category, question, option },
    },
  });

  const logisticsExpenses = useMemo(() => buildLogisticsExpenses({ accommodations, vehicles, flights, otherCosts }), [accommodations, vehicles, flights, otherCosts]);
  const obligations = useMemo(
    () => logisticsObligations(logisticsExpenses, logisticsPayments, outputCurrency, settlementPayments),
    [logisticsExpenses, logisticsPayments, settlementPayments, outputCurrency, rateDate]
  );

  const costSummary = useMemo(() => {
    const rows = Object.fromEntries(people.map((person) => [String(person.id), {
      stays: 0, rentals: 0, flights: 0, others: 0, paid: 0, remaining: 0, payeeIds: [],
    }]));
    let accommodationTotal = 0;
    let rentalTotal = 0;
    let flightTotal = 0;
    let otherTotal = 0;

    accommodations.forEach((stay) => {
      accommodationTotal += convert(Number(stay.price) || 0, stay.currency, outputCurrency);
      Object.entries(getStayShares(stay)).forEach(([id, amount]) => {
        if (rows[id]) rows[id].stays += convert(amount, stay.currency, outputCurrency);
      });
    });

    vehicles.filter((vehicle) => vehicle.rentalEnabled).forEach((vehicle) => {
      rentalTotal += convert(Number(vehicle.rentalPrice) || 0, vehicle.rentalCurrency, outputCurrency);
      Object.entries(getRentalShares(vehicle)).forEach(([id, amount]) => {
        if (rows[id]) rows[id].rentals += convert(amount, vehicle.rentalCurrency, outputCurrency);
      });
    });

    flights.forEach((flight) => {
      flightTotal += convert(Number(flight.price) || 0, flight.currency, outputCurrency);
      Object.entries(getFlightShares(flight)).forEach(([id, amount]) => {
        if (rows[id]) rows[id].flights += convert(amount, flight.currency, outputCurrency);
      });
    });

    otherCosts.forEach((cost) => {
      otherTotal += convert(Number(cost.amount) || 0, cost.currency, outputCurrency);
      Object.entries(getOtherCostShares(cost)).forEach(([id, amount]) => {
        if (rows[id]) rows[id].others += convert(amount, cost.currency, outputCurrency);
      });
    });

    obligations.forEach((obligation) => {
      const row = rows[obligation.personId];
      if (!row) return;
      row.paid += Math.min(obligation.paid, obligation.due);
      row.remaining += obligation.remaining;
      if (obligation.remaining > 0.005 && !row.payeeIds.includes(obligation.payeeId)) row.payeeIds.push(obligation.payeeId);
    });

    return {
      rows, accommodationTotal, rentalTotal, flightTotal, otherTotal,
      grandTotal: accommodationTotal + rentalTotal + flightTotal + otherTotal,
    };
  }, [people, accommodations, vehicles, flights, otherCosts, obligations, outputCurrency, rateDate]);

  const showFlightAllocation = costSummary.flightTotal > 0.005;
  const showOtherAllocation = otherCosts.length > 0;
  const allocationCostColumnCount = 2 + Number(showFlightAllocation) + Number(showOtherAllocation);
  const allocationGridStyle = {
    minWidth: `${760 + allocationCostColumnCount * 70}px`,
    gridTemplateColumns: `minmax(145px, 1.25fr) repeat(${allocationCostColumnCount}, minmax(68px, .55fr)) minmax(82px, .65fr) minmax(74px, .6fr) minmax(82px, .65fr) minmax(105px, .85fr) minmax(105px, .8fr)`,
  };

  const openStayForm = () => {
    setStayForm((current) => ({
      ...current,
      currency: current.name || current.price ? current.currency : outputCurrency,
      paidById: current.paidById || defaultPayerId,
    }));
    setShowStayForm(true);
  };

  const openFlightForm = () => {
    setFlightForm((current) => ({
      ...current,
      currency: current.from || current.to || current.price ? current.currency : outputCurrency,
      paidById: current.paidById || defaultPayerId,
    }));
    setShowFlightForm(true);
  };

  const openOtherForm = () => {
    setOtherForm((current) => ({
      ...current,
      currency: current.title || current.amount ? current.currency : outputCurrency,
      paidById: current.paidById || defaultPayerId,
    }));
    setShowOtherForm(true);
  };

  useEffect(() => {
    if (!stayEdit && !carEdit) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setStayEdit(null);
      setCarEdit(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [stayEdit, carEdit]);

  useEffect(() => {
    setTripDateForm({ startDate: tripStartDate || "", endDate: tripEndDate || "" });
  }, [tripStartDate, tripEndDate]);

  const saveTripDates = (event) => {
    event.preventDefault();
    const result = validateTripDates(tripDateForm.startDate, tripDateForm.endDate);
    if (result.error) {
      setTripDateMessage(t(result.error === "range" ? "trip_date_range_invalid" : "trip_date_invalid"));
      return;
    }
    updateTripState((current) => ({
      ...current,
      tripStartDate: result.value.startDate,
      tripEndDate: result.value.endDate,
    }));
    setTripDateMessage(t("trip_dates_saved"));
  };

  const createStay = () => {
    if (!stayForm.name.trim()) return;
    setAccommodations((current) => [...current, {
      id: createId("stay"),
      name: stayForm.name.trim(),
      location: stayForm.location.trim(),
      nights: Math.max(1, Number(stayForm.nights) || 1),
      price: Number(stayForm.price) || 0,
      currency: stayForm.currency,
      paidById: stayForm.paidById || defaultPayerId,
      splitMode: stayForm.splitMode,
      participantIds: [],
      rooms: [],
      createdAt: new Date().toISOString(),
    }]);
    setStayForm({ ...emptyStay, currency: outputCurrency, paidById: defaultPayerId });
    setShowStayForm(false);
  };

  const updateStay = (stayId, updater) => setAccommodations((current) => current.map((stay) =>
    String(stay.id) === String(stayId) ? updater(stay) : stay
  ));

  const openStayEditor = (stay) => setStayEdit({
    id: stay.id,
    name: stay.name || "",
    location: stay.location || "",
    nights: stay.nights || 1,
    price: stay.price ?? "",
    currency: stay.currency || "EUR",
    paidById: stay.paidById || "",
    splitMode: stay.splitMode === "rooms" ? "rooms" : "people",
  });

  const saveStayEdit = (event) => {
    event.preventDefault();
    const stay = accommodations.find((item) => String(item.id) === String(stayEdit?.id));
    if (!stay || !stayEdit?.name.trim()) return;
    const nextStay = {
      ...stay,
      name: stayEdit.name.trim(),
      location: stayEdit.location.trim(),
      nights: Math.max(1, Math.trunc(Number(stayEdit.nights) || 1)),
      price: Math.max(0, Number(stayEdit.price) || 0),
      currency: stayEdit.currency,
      paidById: stayEdit.paidById,
      splitMode: stayEdit.splitMode,
    };
    const fields = changedActivityFields(stay, nextStay, {
      name: "name", location: "location", nights: "nights", price: "amount",
      currency: "currency", paidById: "payer", splitMode: "split",
    });
    if (!fields.length) {
      setStayEdit(null);
      return;
    }
    updateTripState((current) => appendActivity({
      ...current,
      accommodations: current.accommodations.map((item) => String(item.id) === String(stay.id) ? nextStay : item),
    }, createActivityEntry({ type: "stay_edited", actor: currentPerson, subject: stay, fields })));
    setStayEdit(null);
  };

  const addRoom = (stayId) => updateStay(stayId, (stay) => ({
    ...stay,
    rooms: [...stay.rooms, {
      id: createId("room"),
      name: `${t("room")} ${stay.rooms.length + 1}`,
      capacity: 2,
      cost: "",
      currency: stay.currency,
      occupantIds: [],
    }],
  }));

  const toggleStayParticipant = (stayId, personId) => updateStay(stayId, (stay) => {
    const selected = stay.participantIds.map(String).includes(String(personId));
    return {
      ...stay,
      participantIds: selected
        ? stay.participantIds.filter((id) => String(id) !== String(personId))
        : [...stay.participantIds, personId],
      rooms: selected
        ? stay.rooms.map((room) => ({ ...room, occupantIds: room.occupantIds.filter((id) => String(id) !== String(personId)) }))
        : stay.rooms,
    };
  });

  const updateRoom = (stayId, roomId, fields) => updateStay(stayId, (stay) => ({
    ...stay,
    rooms: stay.rooms.map((room) => String(room.id) === String(roomId) ? { ...room, ...fields } : room),
  }));

  const toggleRoomGuest = (stayId, roomId, personId) => updateStay(stayId, (stay) => {
    const target = stay.rooms.find((room) => String(room.id) === String(roomId));
    const selected = target.occupantIds.map(String).includes(String(personId));
    if (!selected && target.occupantIds.length >= Number(target.capacity || 1)) return stay;
    return {
      ...stay,
      participantIds: !selected && !stay.participantIds.map(String).includes(String(personId))
        ? [...stay.participantIds, personId]
        : stay.participantIds,
      rooms: stay.rooms.map((room) => {
        const withoutPerson = room.occupantIds.filter((id) => String(id) !== String(personId));
        return String(room.id) === String(roomId) && !selected
          ? { ...room, occupantIds: [...withoutPerson, personId] }
          : { ...room, occupantIds: withoutPerson };
      }),
    };
  });

  const createCar = () => {
    if (!carForm.name.trim()) return;
    setVehicles((current) => [...current, {
      id: createId("vehicle"),
      name: carForm.name.trim(),
      seats: normalizeVehicleSeats(carForm.seats),
      driverId: "",
      passengerIds: [],
      rentalEnabled: false,
      rentalPrice: "",
      rentalCurrency: outputCurrency,
      rentalPaidById: defaultPayerId,
      rentalParticipantIds: [],
      createdAt: new Date().toISOString(),
    }]);
    setCarForm(emptyCar);
    setShowCarForm(false);
  };

  const openCarEditor = (vehicle) => setCarEdit({
    id: vehicle.id,
    name: vehicle.name || "",
    seats: vehicle.seats || 1,
    rentalPrice: vehicle.rentalPrice ?? "",
    rentalCurrency: vehicle.rentalCurrency || "EUR",
    rentalPaidById: vehicle.rentalPaidById || "",
  });

  const saveCarEdit = (event) => {
    event.preventDefault();
    const vehicle = vehicles.find((item) => String(item.id) === String(carEdit?.id));
    if (!vehicle || !carEdit?.name.trim()) return;
    const occupiedSeats = Math.max(1, (vehicle.driverId ? 1 : 0) + vehicle.passengerIds.length);
    const nextVehicle = {
      ...vehicle,
      name: carEdit.name.trim(),
      seats: normalizeVehicleSeats(carEdit.seats, occupiedSeats),
      ...(vehicle.rentalEnabled ? {
        rentalPrice: Math.max(0, Number(carEdit.rentalPrice) || 0),
        rentalCurrency: carEdit.rentalCurrency,
        rentalPaidById: carEdit.rentalPaidById,
      } : {}),
    };
    const fields = changedActivityFields(vehicle, nextVehicle, {
      name: "name", seats: "seats", rentalPrice: "amount",
      rentalCurrency: "currency", rentalPaidById: "payer",
    });
    if (!fields.length) {
      setCarEdit(null);
      return;
    }
    updateTripState((current) => appendActivity({
      ...current,
      vehicles: current.vehicles.map((item) => String(item.id) === String(vehicle.id) ? nextVehicle : item),
    }, createActivityEntry({ type: "car_edited", actor: currentPerson, subject: vehicle, fields })));
    setCarEdit(null);
  };

  const setDriver = (vehicleId, driverId) => setVehicles((current) => current.map((vehicle) => {
    const cleaned = { ...vehicle, passengerIds: vehicle.passengerIds.filter((id) => String(id) !== String(driverId)) };
    if (String(vehicle.id) === String(vehicleId)) return { ...cleaned, driverId };
    return String(vehicle.driverId) === String(driverId) ? { ...cleaned, driverId: "" } : cleaned;
  }));

  const togglePassenger = (vehicleId, personId) => setVehicles((current) => {
    const target = current.find((vehicle) => String(vehicle.id) === String(vehicleId));
    if (String(target.driverId) === String(personId)) return current;
    const selected = target.passengerIds.map(String).includes(String(personId));
    const occupied = (target.driverId ? 1 : 0) + target.passengerIds.length;
    if (!selected && occupied >= Number(target.seats || 1)) return current;
    return current.map((vehicle) => {
      const withoutPerson = vehicle.passengerIds.filter((id) => String(id) !== String(personId));
      return String(vehicle.id) === String(vehicleId) && !selected
        ? { ...vehicle, passengerIds: [...withoutPerson, personId] }
        : { ...vehicle, passengerIds: withoutPerson };
    });
  });

  const toggleRental = (vehicleId) => setVehicles((current) => current.map((vehicle) => {
    if (String(vehicle.id) !== String(vehicleId)) return vehicle;
    const participantIds = uniqueIds([vehicle.driverId, ...vehicle.passengerIds].filter(Boolean));
    return {
      ...vehicle,
      rentalEnabled: !vehicle.rentalEnabled,
      rentalParticipantIds: vehicle.rentalParticipantIds.length ? vehicle.rentalParticipantIds : participantIds,
    };
  }));

  const toggleRentalParticipant = (vehicleId, personId) => setVehicles((current) => current.map((vehicle) => {
    if (String(vehicle.id) !== String(vehicleId)) return vehicle;
    const selected = vehicle.rentalParticipantIds.map(String).includes(String(personId));
    return {
      ...vehicle,
      rentalParticipantIds: selected
        ? vehicle.rentalParticipantIds.filter((id) => String(id) !== String(personId))
        : [...vehicle.rentalParticipantIds, personId],
    };
  }));

  const createFlight = () => {
    if (!flightForm.from.trim() || !flightForm.to.trim()) return;
    setFlights((current) => [...current, {
      id: createId("flight"),
      ...flightForm,
      from: flightForm.from.trim().toUpperCase(),
      to: flightForm.to.trim().toUpperCase(),
      airline: flightForm.airline.trim(),
      flightNumber: flightForm.flightNumber.trim().toUpperCase(),
      price: Number(flightForm.price) || 0,
      paidById: flightForm.paidById || defaultPayerId,
      participantIds: [],
      createdAt: new Date().toISOString(),
    }]);
    setFlightForm({ ...emptyFlight, currency: outputCurrency, paidById: defaultPayerId });
    setShowFlightForm(false);
  };

  const updateFlight = (flightId, fields) => setFlights((current) => current.map((flight) =>
    String(flight.id) === String(flightId) ? { ...flight, ...fields } : flight
  ));

  const toggleFlightParticipant = (flightId, personId) => setFlights((current) => current.map((flight) => {
    if (String(flight.id) !== String(flightId)) return flight;
    const selected = flight.participantIds.map(String).includes(String(personId));
    return {
      ...flight,
      participantIds: selected
        ? flight.participantIds.filter((id) => String(id) !== String(personId))
        : [...flight.participantIds, personId],
    };
  }));

  const createOtherCost = () => {
    if (!otherForm.title.trim() || !Number(otherForm.amount)) return;
    setOtherCosts((current) => [...current, {
      id: createId("other-cost"),
      title: otherForm.title.trim(),
      amount: Number(otherForm.amount),
      currency: otherForm.currency,
      paidById: otherForm.paidById || defaultPayerId,
      participantIds: people.map((person) => person.id),
      createdAt: new Date().toISOString(),
    }]);
    setOtherForm({ ...emptyOtherCost, currency: outputCurrency, paidById: defaultPayerId });
    setShowOtherForm(false);
  };

  const updateOtherCost = (costId, fields) => setOtherCosts((current) => current.map((cost) =>
    String(cost.id) === String(costId) ? { ...cost, ...fields } : cost
  ));

  const toggleOtherParticipant = (costId, personId) => setOtherCosts((current) => current.map((cost) => {
    if (String(cost.id) !== String(costId)) return cost;
    const selected = cost.participantIds.map(String).includes(String(personId));
    return {
      ...cost,
      participantIds: selected
        ? cost.participantIds.filter((id) => String(id) !== String(personId))
        : [...cost.participantIds, personId],
    };
  }));

  const openPaymentEditor = (personId) => {
    if (!canManageMembers) return;
    const firstObligation = obligations.find((item) => item.personId === String(personId) && item.remaining > 0.005);
    setPaymentError("");
    setPaymentDraft({ personId: String(personId), logisticsExpenseId: firstObligation?.logisticsExpenseId || "", amount: "" });
  };

  const recordLogisticsPayment = () => {
    if (!canManageMembers || !paymentDraft) return;
    const obligation = obligations.find((item) =>
      item.personId === paymentDraft.personId && item.logisticsExpenseId === paymentDraft.logisticsExpenseId
    );
    const amount = Number(paymentDraft.amount);
    if (!obligation || !amount || amount <= 0 || amount - obligation.remaining > 0.01) {
      setPaymentError(t("payment_amount_invalid"));
      return;
    }
    const from = personById(obligation.personId);
    const to = personById(obligation.payeeId);
    setLogisticsPayments((current) => [...current, {
      id: createId("logistics-payment"),
      source: "logistics",
      logisticsExpenseId: obligation.logisticsExpenseId,
      logisticsType: obligation.logisticsType,
      logisticsId: obligation.logisticsId,
      logisticsTitle: obligation.title,
      fromId: obligation.personId,
      fromName: from?.name || personName(obligation.personId),
      fromColor: from?.color || "",
      toId: obligation.payeeId,
      toName: to?.name || personName(obligation.payeeId),
      toColor: to?.color || "",
      amountEUR: convert(amount, outputCurrency, "EUR"),
      originalAmount: amount,
      originalCurrency: outputCurrency,
      recordedById: currentMemberId || "",
      paidAt: new Date().toISOString(),
    }]);
    setPaymentDraft(null);
    setPaymentError("");
  };

  const editedVehicle = carEdit ? vehicles.find((vehicle) => String(vehicle.id) === String(carEdit.id)) : null;
  const minimumEditedCarSeats = editedVehicle
    ? Math.max(1, (editedVehicle.driverId ? 1 : 0) + editedVehicle.passengerIds.length)
    : 1;

  return (
    <div className="page-stack logistics-page">
      <PageHeader
        title={t("trip_logistics")}
        description={t("logistics_desc")}
        actions={<><CurrencySelect value={outputCurrency} onChange={setOutputCurrency} /><button className="button primary" onClick={openStayForm}>{t("add_accommodation")}</button></>}
      />

      <section className="trip-dates-panel surface-panel">
        <div className="trip-dates-copy"><h2>{t("trip_dates")}</h2><p>{t("trip_dates_desc")}</p></div>
        <form className="trip-dates-form" onSubmit={saveTripDates}>
          <label><span>{t("trip_start_date")}</span><input type="date" value={tripDateForm.startDate} onChange={(event) => { setTripDateForm((current) => ({ ...current, startDate: event.target.value })); setTripDateMessage(""); }} /></label>
          <label><span>{t("trip_end_date")}</span><input type="date" value={tripDateForm.endDate} onChange={(event) => { setTripDateForm((current) => ({ ...current, endDate: event.target.value })); setTripDateMessage(""); }} /></label>
          <div className="trip-dates-actions"><button type="submit" className="button primary small-button">{t("save_trip_dates")}</button>{tripDateMessage && <small role="status">{tripDateMessage}</small>}</div>
        </form>
      </section>

      {showStayForm && (
        <section className="creator-panel surface-panel">
          <label className="field-group"><span className="field-label">{t("stay_name")}</span><input autoFocus value={stayForm.name} onChange={(event) => setStayForm((current) => ({ ...current, name: event.target.value }))} placeholder="Villa Belvedere" /></label>
          <label className="field-group"><span className="field-label">{t("location")}</span><input value={stayForm.location} onChange={(event) => setStayForm((current) => ({ ...current, location: event.target.value }))} placeholder="Tuscany, Italy" /></label>
          <label className="field-group"><span className="field-label">{t("nights")}</span><input type="number" min="1" value={stayForm.nights} onChange={(event) => setStayForm((current) => ({ ...current, nights: event.target.value }))} /></label>
          <label className="field-group"><span className="field-label">{t("stay_price")}</span><input type="number" min="0" step="0.01" value={stayForm.price} onChange={(event) => setStayForm((current) => ({ ...current, price: event.target.value }))} placeholder="0.00" /></label>
          <label className="field-group"><span className="field-label">{t("currency")}</span><CurrencySelect value={stayForm.currency} onChange={(currency) => setStayForm((current) => ({ ...current, currency }))} /></label>
          <label className="field-group"><span className="field-label">{t("payer")}</span><select value={stayForm.paidById} onChange={(event) => setStayForm((current) => ({ ...current, paidById: event.target.value }))}><option value="">{t("choose_payer")}</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
          <label className="field-group"><span className="field-label">{t("split_method")}</span><select value={stayForm.splitMode} onChange={(event) => setStayForm((current) => ({ ...current, splitMode: event.target.value }))}><option value="people">{t("split_by_people")}</option><option value="rooms">{t("split_by_rooms")}</option></select></label>
          <button className="button primary" onClick={createStay}>{t("create_stay")}</button>
          <button className="text-link" onClick={() => setShowStayForm(false)}>{t("cancel")}</button>
        </section>
      )}

      <div className="logistics-layout logistics-layout-full">
        <div className="logistics-board">
          <section className="allocation-summary allocation-summary-top">
            <header><div><h2>{t("planned_split")}</h2><p>{t("planned_split_desc")}</p></div><strong>{fmt(costSummary.grandTotal, outputCurrency)}</strong></header>
            <div className="allocation-table">
              <div className="allocation-table-head" style={allocationGridStyle}>
                <span>{t("people")}</span>
                <span>{t("stays")}</span>
                <span>{t("rentals")}</span>
                {showFlightAllocation && <span>{t("flights")}</span>}
                {showOtherAllocation && <span>{t("others")}</span>}
                <span>{t("total")}</span>
                <span>{t("paid")}</span>
                <span>{t("left_to_pay")}</span>
                <span className="allocation-left-cell">{t("pay_to")}</span>
                <span className="allocation-left-cell">{t("status")}</span>
              </div>
              {people.map((person, index) => {
                const row = costSummary.rows[String(person.id)];
                const plannedTotal = row.stays + row.rentals + row.flights + row.others;
                const personObligations = obligations.filter((item) => item.personId === String(person.id) && item.remaining > 0.005);
                const selectedObligation = paymentDraft?.personId === String(person.id)
                  ? personObligations.find((item) => item.logisticsExpenseId === paymentDraft.logisticsExpenseId)
                  : null;
                return (
                  <Fragment key={person.id}>
                    <div className={`allocation-table-row${row.remaining > 0.005 ? " has-amount-due" : plannedTotal > 0 ? " is-fully-settled" : ""}`} style={allocationGridStyle}>
                      <span><PersonAvatar person={person} people={people} index={index} size="small" /><strong>{person.name}</strong></span>
                      <span>{fmt(row.stays, outputCurrency)}</span>
                      <span>{fmt(row.rentals, outputCurrency)}</span>
                      {showFlightAllocation && <span>{fmt(row.flights, outputCurrency)}</span>}
                      {showOtherAllocation && <span>{fmt(row.others, outputCurrency)}</span>}
                      <strong>{fmt(plannedTotal, outputCurrency)}</strong>
                      <span className="money-positive">{fmt(row.paid, outputCurrency)}</span>
                      <strong className={`allocation-remaining ${row.remaining > 0.005 ? "money-negative" : "money-muted"}`}>{fmt(row.remaining, outputCurrency)}</strong>
                      <span className="allocation-payees">{row.payeeIds.length ? row.payeeIds.map(personName).join(", ") : "—"}</span>
                      <span className="allocation-status">{canManageMembers ? <button className="button secondary table-payment-button" disabled={!personObligations.length} onClick={() => openPaymentEditor(person.id)}>{t("record_payment")}</button> : <small className="read-only-label">{t("read_only")}</small>}</span>
                    </div>
                    {paymentDraft?.personId === String(person.id) && canManageMembers && (
                      <div className="allocation-payment-editor" style={{ minWidth: allocationGridStyle.minWidth }}>
                        <div><strong>{t("record_payment_for", { name: person.name })}</strong><span>{t("admin_payment_note")}</span></div>
                        <label><span>{t("cost")}</span><select value={paymentDraft.logisticsExpenseId} onChange={(event) => { setPaymentDraft((current) => ({ ...current, logisticsExpenseId: event.target.value, amount: "" })); setPaymentError(""); }}><option value="">{t("choose_cost")}</option>{personObligations.map((item) => <option key={item.logisticsExpenseId} value={item.logisticsExpenseId}>{item.title} · {t("pay_to")} {personName(item.payeeId)} · {fmt(item.remaining, outputCurrency)}</option>)}</select></label>
                        <label><span>{t("amount")}</span><input type="number" min="0" max={selectedObligation?.remaining || undefined} step="0.01" value={paymentDraft.amount} onChange={(event) => { setPaymentDraft((current) => ({ ...current, amount: event.target.value })); setPaymentError(""); }} placeholder="0.00" /></label>
                        <div className="allocation-payment-actions">{paymentError && <p className="form-error">{paymentError}</p>}<button className="text-link" onClick={() => setPaymentDraft(null)}>{t("cancel")}</button><button className="button primary small-button" onClick={recordLogisticsPayment}>{t("confirm_paid")}</button></div>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </section>

          <section className="logistics-section">
            <div className="logistics-section-heading"><div><h2>{t("stays_rooms")}</h2><p>{t("stays_help")}</p></div><strong>{fmt(costSummary.accommodationTotal, outputCurrency)} <span>{t("accommodation_total")}</span></strong></div>
            {accommodations.length ? accommodations.map((stay) => {
              const stayTotal = Number(stay.price) || 0;
              const stayShares = getStayShares(stay);
              const occupiedRooms = stay.rooms.filter((room) => room.occupantIds.length);
              const roomShare = stay.splitMode === "rooms" && occupiedRooms.length ? stayTotal / occupiedRooms.length : 0;
              return (
                <article className="stay-block" key={stay.id}>
                  <header className="stay-heading">
                    <div><h3>{stay.name}</h3><p>{stay.location || "—"} · {stay.nights} {t("nights").toLowerCase()}</p></div>
                    <div><strong>{fmt(stayTotal, stay.currency)}</strong><button className="decision-link" onClick={() => startDecision("accommodation", t("choose_accommodation_vote"), { title: stay.name, detail: [stay.location, `${stay.nights} ${t("nights").toLowerCase()}`].filter(Boolean).join(" · "), price: stay.price, currency: stay.currency })}>{t("vote_on_this")}</button><button className="row-action" onClick={() => openStayEditor(stay)}>{t("edit")}</button><button className="row-action" onClick={() => setAccommodations((current) => current.filter((item) => item.id !== stay.id))}>{t("remove")}</button></div>
                  </header>

                  <div className="stay-cost-controls logistics-financial-summary">
                    <div><span className="field-label">{t("stay_price")}</span><strong>{fmt(stayTotal, stay.currency)}</strong></div>
                    <div><span className="field-label">{t("payer")}</span><strong>{personName(stay.paidById)}</strong></div>
                    <div><span className="field-label">{t("split_method")}</span><strong>{t(stay.splitMode === "rooms" ? "split_by_rooms" : "split_by_people")}</strong></div>
                    <button className="button secondary small-button" onClick={() => openStayEditor(stay)}>{t("edit_stay_details")}</button>
                  </div>

                  <div className="participation-block">
                    <div><strong>{t("who_stayed")}</strong><span>{t("who_stayed_help")}</span></div>
                    <div className="participant-buttons">{people.map((person) => {
                      const selected = stay.participantIds.map(String).includes(String(person.id));
                      return <button className={selected ? "selected" : ""} key={person.id} onClick={() => toggleStayParticipant(stay.id, person.id)}><PersonAvatar person={person} people={people} index={personIndex(person.id)} size="small" inControl />{person.name}</button>;
                    })}</div>
                  </div>

                  <div className="split-preview">
                    <strong>{t("split_preview")}</strong>
                    <div>{Object.keys(stayShares).length ? Object.entries(stayShares).map(([id, share]) => <span key={id}><b>{personName(id)}</b>{fmt(share, stay.currency)}</span>) : <small>{t("select_participants_first")}</small>}</div>
                  </div>

                  <div className="room-list">
                    {stay.rooms.map((room) => {
                      const split = room.occupantIds.length ? roomShare / room.occupantIds.length : 0;
                      return (
                        <div className="room-row" key={room.id}>
                          <div className="room-fields">
                            <label><span>{t("room")}</span><input value={room.name} onChange={(event) => updateRoom(stay.id, room.id, { name: event.target.value })} /></label>
                            <label><span>{t("capacity")}</span><input type="number" min="1" value={room.capacity} onChange={(event) => updateRoom(stay.id, room.id, { capacity: Math.max(1, Number(event.target.value) || 1), occupantIds: room.occupantIds.slice(0, Math.max(1, Number(event.target.value) || 1)) })} /></label>
                            <div className="room-share-field"><span>{t("room_share")}</span><strong>{stay.splitMode === "rooms" ? fmt(roomShare, stay.currency) : t("included_guest_split")}</strong></div>
                            <button className="row-action" onClick={() => updateStay(stay.id, (current) => ({ ...current, rooms: current.rooms.filter((item) => item.id !== room.id) }))}>{t("remove")}</button>
                          </div>
                          <div className="assignment-row">
                            <span>{t("assigned")}</span>
                            <div>{people.map((person) => {
                              const selected = room.occupantIds.map(String).includes(String(person.id));
                              return <button className={selected ? "selected" : ""} key={person.id} onClick={() => toggleRoomGuest(stay.id, room.id, person.id)}><PersonAvatar person={person} people={people} index={personIndex(person.id)} size="small" inControl />{person.name}</button>;
                            })}</div>
                            <small>{stay.splitMode === "rooms" && room.occupantIds.length ? t("room_split", { amount: fmt(split, stay.currency) }) : stay.splitMode === "people" ? t("included_guest_split") : t("room_empty")}</small>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="text-link add-open-row" onClick={() => addRoom(stay.id)}>+ {t("add_room")}</button>
                  <CommentThread targetType="accommodation" targetId={stay.id} />
                </article>
              );
            }) : <div className="open-empty"><strong>{t("no_stays")}</strong><span>{t("no_stays_desc")}</span><button className="text-link" onClick={openStayForm}>{t("add_stay")}</button></div>}
          </section>

          <section className="logistics-section cars-section">
            <div className="logistics-section-heading"><div><h2>{t("cars_seats")}</h2><p>{t("cars_help")}</p></div><div className="section-heading-actions"><strong>{fmt(costSummary.rentalTotal, outputCurrency)}<span>{t("car_rental_total")}</span></strong><button className="button secondary small-button" onClick={() => setShowCarForm(true)}>{t("add_car")}</button></div></div>
            {showCarForm && (
              <div className="car-creator">
                <label><span>{t("car_name")}</span><input autoFocus value={carForm.name} onChange={(event) => setCarForm((current) => ({ ...current, name: event.target.value }))} placeholder="Fiat 500X" /></label>
                <label><span>{t("seats")}</span><input type="number" min="1" max="60" value={carForm.seats} onChange={(event) => setCarForm((current) => ({ ...current, seats: event.target.value }))} /></label>
                <button className="button primary small-button" onClick={createCar}>{t("create_car")}</button>
                <button className="text-link" onClick={() => setShowCarForm(false)}>{t("cancel")}</button>
              </div>
            )}
            {vehicles.length ? vehicles.map((vehicle) => {
              const openSeats = Math.max(0, Number(vehicle.seats) - (vehicle.driverId ? 1 : 0) - vehicle.passengerIds.length);
              const rentalShares = getRentalShares(vehicle);
              return (
                <article className="vehicle-block" key={vehicle.id}>
                  <header><div><h3>{vehicle.name}</h3><span>{vehicle.seats} {t("seats").toLowerCase()}</span></div><div className="logistics-item-actions"><button className="row-action" onClick={() => openCarEditor(vehicle)}>{t("edit")}</button><button className="row-action" onClick={() => setVehicles((current) => current.filter((item) => item.id !== vehicle.id))}>{t("remove")}</button></div></header>
                  <div className="vehicle-grid">
                    <label><span>{t("driver")}</span><select value={vehicle.driverId} onChange={(event) => setDriver(vehicle.id, event.target.value)}><option value="">{t("choose_driver")}</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
                    <div className="passenger-control"><span>{t("passengers")}</span><div>{people.filter((person) => String(person.id) !== String(vehicle.driverId)).map((person) => <button className={vehicle.passengerIds.map(String).includes(String(person.id)) ? "selected" : ""} key={person.id} onClick={() => togglePassenger(vehicle.id, person.id)}>{person.name}</button>)}</div></div>
                    <strong className={openSeats ? "seats-available" : "seats-full"}>{openSeats === 0 ? t("car_full") : openSeats === 1 ? t("seat_open") : t("seats_open", { count: openSeats })}</strong>
                  </div>
                  {vehicle.driverId && <p className="driver-summary"><span>{t("driver")}</span><PersonAvatar person={personById(vehicle.driverId)} people={people} index={personIndex(vehicle.driverId)} size="small" /><strong>{personName(vehicle.driverId)}</strong></p>}
                  <section className={`rental-panel${vehicle.rentalEnabled ? " active" : ""}`}>
                    <div className="rental-panel-heading">
                      <div><strong>{t("rental_car")}</strong><span>{t("rental_help")}</span></div>
                      <div className="rental-heading-actions">{vehicle.rentalEnabled && <button className="decision-link" onClick={() => startDecision("rental_car", t("choose_rental_vote"), { title: vehicle.name, detail: `${vehicle.seats} ${t("seats").toLowerCase()}`, price: vehicle.rentalPrice, currency: vehicle.rentalCurrency })}>{t("vote_on_this")}</button>}<button className={`rental-toggle${vehicle.rentalEnabled ? " active" : ""}`} onClick={() => toggleRental(vehicle.id)}><span />{vehicle.rentalEnabled ? t("rental_enabled") : t("not_rental")}</button></div>
                    </div>
                    {vehicle.rentalEnabled && (
                      <>
                        <div className="rental-cost-row logistics-financial-summary">
                          <div><span className="field-label">{t("rental_price")}</span><strong>{fmt(Number(vehicle.rentalPrice) || 0, vehicle.rentalCurrency)}</strong></div>
                          <div><span className="field-label">{t("payer")}</span><strong>{personName(vehicle.rentalPaidById)}</strong></div>
                          <div className="rental-per-person"><strong>{vehicle.rentalParticipantIds.length ? fmt((Number(vehicle.rentalPrice) || 0) / vehicle.rentalParticipantIds.length, vehicle.rentalCurrency) : fmt(0, vehicle.rentalCurrency)}</strong><span>{t("per_participant")}</span></div>
                          <button className="button secondary small-button" onClick={() => openCarEditor(vehicle)}>{t("edit_car_details")}</button>
                        </div>
                        <div className="participation-block rental-participation">
                          <div><strong>{t("rental_participants")}</strong><span>{t("rental_participants_help")}</span></div>
                          <div className="participant-buttons">{people.map((person) => {
                            const selected = vehicle.rentalParticipantIds.map(String).includes(String(person.id));
                            return <button className={selected ? "selected" : ""} key={person.id} onClick={() => toggleRentalParticipant(vehicle.id, person.id)}><PersonAvatar person={person} people={people} index={personIndex(person.id)} size="small" inControl />{person.name}</button>;
                          })}</div>
                        </div>
                        <div className="split-preview rental-preview"><strong>{t("rental_split")}</strong><div>{Object.keys(rentalShares).length ? Object.entries(rentalShares).map(([id, share]) => <span key={id}><b>{personName(id)}</b>{fmt(share, vehicle.rentalCurrency)}</span>) : <small>{t("select_participants_first")}</small>}</div></div>
                      </>
                    )}
                  </section>
                  <CommentThread targetType="vehicle" targetId={vehicle.id} />
                </article>
              );
            }) : !showCarForm && <div className="open-empty"><strong>{t("no_cars")}</strong><span>{t("no_cars_desc")}</span></div>}
          </section>

          <section className="logistics-section flights-section">
            <div className="logistics-section-heading">
              <div><h2>{t("flights")}</h2><p>{t("flights_help")}</p></div>
              <div className="section-heading-actions"><strong>{fmt(costSummary.flightTotal, outputCurrency)}<span>{t("flight_total")}</span></strong><button className="button secondary small-button" onClick={openFlightForm}>{t("add_flight")}</button></div>
            </div>

            {showFlightForm && (
              <div className="flight-creator">
                <label><span>{t("from_airport")}</span><input autoFocus maxLength={4} value={flightForm.from} onChange={(event) => setFlightForm((current) => ({ ...current, from: event.target.value.toUpperCase() }))} placeholder="OTP" /></label>
                <label><span>{t("to_airport")}</span><input maxLength={4} value={flightForm.to} onChange={(event) => setFlightForm((current) => ({ ...current, to: event.target.value.toUpperCase() }))} placeholder="BCN" /></label>
                <label><span>{t("airline")}</span><input value={flightForm.airline} onChange={(event) => setFlightForm((current) => ({ ...current, airline: event.target.value }))} placeholder="TAROM" /></label>
                <label><span>{t("flight_number")}</span><input value={flightForm.flightNumber} onChange={(event) => setFlightForm((current) => ({ ...current, flightNumber: event.target.value }))} placeholder="RO 421" /></label>
                <label><span>{t("departure")}</span><input type="date" value={flightForm.departureDate} onChange={(event) => setFlightForm((current) => ({ ...current, departureDate: event.target.value }))} /></label>
                <label><span>{t("total_fare")}</span><div className="price-with-currency"><input type="number" min="0" step="0.01" value={flightForm.price} onChange={(event) => setFlightForm((current) => ({ ...current, price: event.target.value }))} placeholder="0.00" /><CurrencySelect value={flightForm.currency} onChange={(currency) => setFlightForm((current) => ({ ...current, currency }))} /></div></label>
                <label><span>{t("payer")}</span><select value={flightForm.paidById} onChange={(event) => setFlightForm((current) => ({ ...current, paidById: event.target.value }))}><option value="">{t("choose_payer")}</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
                <button className="button primary small-button" onClick={createFlight}>{t("create_flight")}</button>
                <button className="text-link" onClick={() => setShowFlightForm(false)}>{t("cancel")}</button>
              </div>
            )}

            {flights.length ? flights.map((flight) => {
              const flightShares = getFlightShares(flight);
              return (
                <article className="flight-block" key={flight.id}>
                  <header className="flight-heading">
                    <div><span>{flight.flightNumber || flight.airline || t("flight")}</span><h3>{flight.from} <b>â†’</b> {flight.to}</h3><small>{[flight.airline, flight.departureDate].filter(Boolean).join(" Â· ")}</small></div>
                    <div><strong>{fmt(flight.price, flight.currency)}</strong><button className="decision-link" onClick={() => startDecision("flight", t("choose_flight_vote"), { title: `${flight.from} → ${flight.to}`, detail: [flight.airline, flight.flightNumber, flight.departureDate].filter(Boolean).join(" · "), price: flight.price, currency: flight.currency })}>{t("vote_on_this")}</button><button className="row-action" onClick={() => setFlights((current) => current.filter((item) => item.id !== flight.id))}>{t("remove")}</button></div>
                  </header>

                  <div className="flight-details-grid">
                    <label><span>{t("airline")}</span><input value={flight.airline} onChange={(event) => updateFlight(flight.id, { airline: event.target.value })} /></label>
                    <label><span>{t("flight_number")}</span><input value={flight.flightNumber} onChange={(event) => updateFlight(flight.id, { flightNumber: event.target.value.toUpperCase() })} /></label>
                    <label><span>{t("departure")}</span><div className="date-time-fields"><input type="date" value={flight.departureDate} onChange={(event) => updateFlight(flight.id, { departureDate: event.target.value })} /><input type="time" value={flight.departureTime} onChange={(event) => updateFlight(flight.id, { departureTime: event.target.value })} /></div></label>
                    <label><span>{t("arrival")}</span><div className="date-time-fields"><input type="date" value={flight.arrivalDate} onChange={(event) => updateFlight(flight.id, { arrivalDate: event.target.value })} /><input type="time" value={flight.arrivalTime} onChange={(event) => updateFlight(flight.id, { arrivalTime: event.target.value })} /></div></label>
                    <label><span>{t("total_fare")}</span><div className="price-with-currency"><input type="number" min="0" step="0.01" value={flight.price} onChange={(event) => updateFlight(flight.id, { price: event.target.value })} /><CurrencySelect value={flight.currency} onChange={(currency) => updateFlight(flight.id, { currency })} /></div></label>
                    <label><span>{t("payer")}</span><select value={flight.paidById || ""} onChange={(event) => updateFlight(flight.id, { paidById: event.target.value })}><option value="">{t("choose_payer")}</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
                  </div>

                  <div className="participation-block flight-participation">
                    <div><strong>{t("who_is_flying")}</strong><span>{t("flight_participants_help")}</span></div>
                    <div className="participant-buttons">{people.map((person) => {
                      const selected = flight.participantIds.map(String).includes(String(person.id));
                      return <button className={selected ? "selected" : ""} key={person.id} onClick={() => toggleFlightParticipant(flight.id, person.id)}><PersonAvatar person={person} people={people} index={personIndex(person.id)} size="small" inControl />{person.name}</button>;
                    })}</div>
                  </div>
                  <div className="split-preview"><strong>{t("flight_split")}</strong><div>{Object.keys(flightShares).length ? Object.entries(flightShares).map(([id, share]) => <span key={id}><b>{personName(id)}</b>{fmt(share, flight.currency)}</span>) : <small>{t("select_participants_first")}</small>}</div></div>
                  <CommentThread targetType="flight" targetId={flight.id} />
                </article>
              );
            }) : !showFlightForm && <div className="open-empty"><strong>{t("no_flights")}</strong><span>{t("no_flights_desc")}</span></div>}
          </section>

          <section className="logistics-section other-costs-section">
            <div className="logistics-section-heading">
              <div><h2>{t("other_costs")}</h2><p>{t("other_costs_help")}</p></div>
              <div className="section-heading-actions"><strong>{fmt(costSummary.otherTotal, outputCurrency)}<span>{t("other_total")}</span></strong><button className="button secondary small-button" onClick={openOtherForm}>{t("add_other_cost")}</button></div>
            </div>

            {showOtherForm && (
              <div className="other-cost-creator">
                <label><span>{t("title")}</span><input autoFocus value={otherForm.title} onChange={(event) => setOtherForm((current) => ({ ...current, title: event.target.value }))} placeholder={t("other_cost_example")} /></label>
                <label><span>{t("amount")}</span><input type="number" min="0" step="0.01" value={otherForm.amount} onChange={(event) => setOtherForm((current) => ({ ...current, amount: event.target.value }))} placeholder="0.00" /></label>
                <label><span>{t("currency")}</span><CurrencySelect value={otherForm.currency} onChange={(currency) => setOtherForm((current) => ({ ...current, currency }))} /></label>
                <label><span>{t("payer")}</span><select value={otherForm.paidById} onChange={(event) => setOtherForm((current) => ({ ...current, paidById: event.target.value }))}><option value="">{t("choose_payer")}</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
                <button className="button primary small-button" onClick={createOtherCost}>{t("add")}</button>
                <button className="text-link" onClick={() => setShowOtherForm(false)}>{t("cancel")}</button>
              </div>
            )}

            {otherCosts.length ? otherCosts.map((cost) => {
              const costShares = getOtherCostShares(cost);
              return (
                <article className="other-cost-block" key={cost.id}>
                  <header><div><span>{t("other_cost")}</span><h3>{cost.title}</h3></div><button className="row-action" onClick={() => setOtherCosts((current) => current.filter((item) => item.id !== cost.id))}>{t("remove")}</button></header>
                  <div className="other-cost-grid">
                    <label><span>{t("title")}</span><input value={cost.title} onChange={(event) => updateOtherCost(cost.id, { title: event.target.value })} /></label>
                    <label><span>{t("amount")}</span><div className="price-with-currency"><input type="number" min="0" step="0.01" value={cost.amount} onChange={(event) => updateOtherCost(cost.id, { amount: event.target.value })} /><CurrencySelect value={cost.currency} onChange={(currency) => updateOtherCost(cost.id, { currency })} /></div></label>
                    <label><span>{t("payer")}</span><select value={cost.paidById || ""} onChange={(event) => updateOtherCost(cost.id, { paidById: event.target.value })}><option value="">{t("choose_payer")}</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
                  </div>
                  <div className="participation-block">
                    <div><strong>{t("shared_with")}</strong><span>{t("other_participants_help")}</span></div>
                    <div className="participant-buttons">{people.map((person) => {
                      const selected = cost.participantIds.map(String).includes(String(person.id));
                      return <button className={selected ? "selected" : ""} key={person.id} onClick={() => toggleOtherParticipant(cost.id, person.id)}><PersonAvatar person={person} people={people} index={personIndex(person.id)} size="small" inControl />{person.name}</button>;
                    })}</div>
                  </div>
                  <div className="split-preview"><strong>{t("other_split")}</strong><div>{Object.keys(costShares).length ? Object.entries(costShares).map(([id, share]) => <span key={id}><b>{personName(id)}</b>{fmt(share, cost.currency)}</span>) : <small>{t("select_participants_first")}</small>}</div></div>
                  <CommentThread targetType="other" targetId={cost.id} />
                </article>
              );
            }) : !showOtherForm && <div className="open-empty"><strong>{t("no_other_costs")}</strong><span>{t("no_other_costs_desc")}</span></div>}
          </section>

          <p className="auto-save-note">{t("logistics_saved")}</p>
        </div>

      </div>

      {stayEdit && (
        <div className="confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && setStayEdit(null)}>
          <form className="confirm-dialog logistics-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-stay-title" aria-describedby="edit-stay-description" onSubmit={saveStayEdit}>
            <h2 id="edit-stay-title">{t("edit_stay")}</h2>
            <p id="edit-stay-description">{t("edit_logistics_financial_desc")}</p>
            <div className="logistics-edit-grid">
              <label><span>{t("stay_name")}</span><input autoFocus required value={stayEdit.name} onChange={(event) => setStayEdit((current) => ({ ...current, name: event.target.value }))} /></label>
              <label><span>{t("location")}</span><input value={stayEdit.location} onChange={(event) => setStayEdit((current) => ({ ...current, location: event.target.value }))} /></label>
              <label><span>{t("nights")}</span><input type="number" min="1" required value={stayEdit.nights} onChange={(event) => setStayEdit((current) => ({ ...current, nights: event.target.value }))} /></label>
              <label><span>{t("stay_price")}</span><input type="number" min="0" step="0.01" required value={stayEdit.price} onChange={(event) => setStayEdit((current) => ({ ...current, price: event.target.value }))} /></label>
              <label><span>{t("currency")}</span><CurrencySelect value={stayEdit.currency} onChange={(currency) => setStayEdit((current) => ({ ...current, currency }))} /></label>
              <label><span>{t("payer")}</span><select value={stayEdit.paidById} onChange={(event) => setStayEdit((current) => ({ ...current, paidById: event.target.value }))}><option value="">{t("choose_payer")}</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
              <label><span>{t("split_method")}</span><select value={stayEdit.splitMode} onChange={(event) => setStayEdit((current) => ({ ...current, splitMode: event.target.value }))}><option value="people">{t("split_by_people")}</option><option value="rooms">{t("split_by_rooms")}</option></select></label>
            </div>
            <p className="edit-balance-warning">{t("edit_logistics_balance_warning")}</p>
            <div className="confirm-actions"><button type="button" className="button secondary" onClick={() => setStayEdit(null)}>{t("cancel")}</button><button type="submit" className="button primary">{t("confirm_changes")}</button></div>
          </form>
        </div>
      )}

      {carEdit && editedVehicle && (
        <div className="confirm-overlay" onMouseDown={(event) => event.target === event.currentTarget && setCarEdit(null)}>
          <form className="confirm-dialog logistics-edit-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-car-title" aria-describedby="edit-car-description" onSubmit={saveCarEdit}>
            <h2 id="edit-car-title">{t("edit_car")}</h2>
            <p id="edit-car-description">{t("edit_logistics_financial_desc")}</p>
            <div className="logistics-edit-grid">
              <label><span>{t("car_name")}</span><input autoFocus required value={carEdit.name} onChange={(event) => setCarEdit((current) => ({ ...current, name: event.target.value }))} /></label>
              <label><span>{t("seats")}</span><input type="number" min={minimumEditedCarSeats} max="60" required value={carEdit.seats} onChange={(event) => setCarEdit((current) => ({ ...current, seats: event.target.value }))} /><small>{t("seat_limit_help", { minimum: minimumEditedCarSeats })}</small></label>
              {editedVehicle.rentalEnabled && <>
                <label><span>{t("rental_price")}</span><input type="number" min="0" step="0.01" required value={carEdit.rentalPrice} onChange={(event) => setCarEdit((current) => ({ ...current, rentalPrice: event.target.value }))} /></label>
                <label><span>{t("currency")}</span><CurrencySelect value={carEdit.rentalCurrency} onChange={(rentalCurrency) => setCarEdit((current) => ({ ...current, rentalCurrency }))} /></label>
                <label><span>{t("payer")}</span><select value={carEdit.rentalPaidById} onChange={(event) => setCarEdit((current) => ({ ...current, rentalPaidById: event.target.value }))}><option value="">{t("choose_payer")}</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
              </>}
            </div>
            <p className="edit-balance-warning">{t("edit_logistics_balance_warning")}</p>
            <div className="confirm-actions"><button type="button" className="button secondary" onClick={() => setCarEdit(null)}>{t("cancel")}</button><button type="submit" className="button primary">{t("confirm_changes")}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
