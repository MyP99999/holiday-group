import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import CurrencySelect from "../components/CurrencySelect";
import ChatPanel from "../components/ChatPanel";
import PersonAvatar from "../components/PersonAvatar";
import { useApp } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { createId } from "../storage/tripState";
import { convert, fmt } from "../utils";

const emptyStay = { name: "", location: "", nights: 1, price: "", currency: "EUR", splitMode: "people" };
const emptyCar = { name: "", seats: 5 };

function uniqueIds(ids = []) {
  return [...new Set(ids.map(String))];
}

function getStayShares(stay) {
  const total = Number(stay.price) || 0;
  const shares = {};
  if (stay.splitMode === "people") {
    const participants = uniqueIds(stay.participantIds);
    if (!participants.length) return shares;
    participants.forEach((id) => { shares[id] = total / participants.length; });
    return shares;
  }

  const occupiedRooms = (stay.rooms || []).filter((room) => room.occupantIds?.length);
  if (!occupiedRooms.length) return shares;
  const perRoom = total / occupiedRooms.length;
  occupiedRooms.forEach((room) => {
    const occupants = uniqueIds(room.occupantIds);
    occupants.forEach((id) => { shares[id] = (shares[id] || 0) + perRoom / occupants.length; });
  });
  return shares;
}

function getRentalShares(vehicle) {
  const participants = uniqueIds(vehicle.rentalParticipantIds);
  const total = Number(vehicle.rentalPrice) || 0;
  if (!vehicle.rentalEnabled || !participants.length) return {};
  return Object.fromEntries(participants.map((id) => [id, total / participants.length]));
}

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
  const { t } = useLanguage();
  const { people, accommodations, setAccommodations, vehicles, setVehicles } = useApp();
  const [showStayForm, setShowStayForm] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [stayForm, setStayForm] = useState(emptyStay);
  const [carForm, setCarForm] = useState(emptyCar);
  const [outputCurrency, setOutputCurrency] = useState("EUR");

  const personName = (id) => people.find((person) => String(person.id) === String(id))?.name || t("unassigned");
  const personById = (id) => people.find((person) => String(person.id) === String(id));
  const personIndex = (id) => people.findIndex((person) => String(person.id) === String(id));

  const costSummary = useMemo(() => {
    const rows = Object.fromEntries(people.map((person) => [String(person.id), { stays: 0, rentals: 0 }]));
    let accommodationTotal = 0;
    let rentalTotal = 0;

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

    return { rows, accommodationTotal, rentalTotal, grandTotal: accommodationTotal + rentalTotal };
  }, [people, accommodations, vehicles, outputCurrency]);

  const createStay = () => {
    if (!stayForm.name.trim()) return;
    setAccommodations((current) => [...current, {
      id: createId("stay"),
      name: stayForm.name.trim(),
      location: stayForm.location.trim(),
      nights: Math.max(1, Number(stayForm.nights) || 1),
      price: Number(stayForm.price) || 0,
      currency: stayForm.currency,
      splitMode: stayForm.splitMode,
      participantIds: [],
      rooms: [],
      createdAt: new Date().toISOString(),
    }]);
    setStayForm(emptyStay);
    setShowStayForm(false);
  };

  const updateStay = (stayId, updater) => setAccommodations((current) => current.map((stay) =>
    String(stay.id) === String(stayId) ? updater(stay) : stay
  ));

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
      seats: Math.max(1, Number(carForm.seats) || 1),
      driverId: "",
      passengerIds: [],
      rentalEnabled: false,
      rentalPrice: "",
      rentalCurrency: "EUR",
      rentalParticipantIds: [],
      createdAt: new Date().toISOString(),
    }]);
    setCarForm(emptyCar);
    setShowCarForm(false);
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

  return (
    <div className="page-stack logistics-page">
      <PageHeader
        title={t("trip_logistics")}
        description={t("logistics_desc")}
        actions={<><CurrencySelect value={outputCurrency} onChange={setOutputCurrency} /><button className="button primary" onClick={() => setShowStayForm(true)}>{t("add_accommodation")}</button></>}
      />

      {showStayForm && (
        <section className="creator-panel surface-panel">
          <label className="field-group"><span className="field-label">{t("stay_name")}</span><input autoFocus value={stayForm.name} onChange={(event) => setStayForm((current) => ({ ...current, name: event.target.value }))} placeholder="Villa Belvedere" /></label>
          <label className="field-group"><span className="field-label">{t("location")}</span><input value={stayForm.location} onChange={(event) => setStayForm((current) => ({ ...current, location: event.target.value }))} placeholder="Tuscany, Italy" /></label>
          <label className="field-group"><span className="field-label">{t("nights")}</span><input type="number" min="1" value={stayForm.nights} onChange={(event) => setStayForm((current) => ({ ...current, nights: event.target.value }))} /></label>
          <label className="field-group"><span className="field-label">{t("stay_price")}</span><input type="number" min="0" step="0.01" value={stayForm.price} onChange={(event) => setStayForm((current) => ({ ...current, price: event.target.value }))} placeholder="0.00" /></label>
          <label className="field-group"><span className="field-label">{t("currency")}</span><CurrencySelect value={stayForm.currency} onChange={(currency) => setStayForm((current) => ({ ...current, currency }))} /></label>
          <label className="field-group"><span className="field-label">{t("split_method")}</span><select value={stayForm.splitMode} onChange={(event) => setStayForm((current) => ({ ...current, splitMode: event.target.value }))}><option value="people">{t("split_by_people")}</option><option value="rooms">{t("split_by_rooms")}</option></select></label>
          <button className="button primary" onClick={createStay}>{t("create_stay")}</button>
          <button className="text-link" onClick={() => setShowStayForm(false)}>{t("cancel")}</button>
        </section>
      )}

      <div className="logistics-layout">
        <div className="logistics-board">
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
                    <div><strong>{fmt(stayTotal, stay.currency)}</strong><button className="row-action" onClick={() => setAccommodations((current) => current.filter((item) => item.id !== stay.id))}>{t("remove")}</button></div>
                  </header>

                  <div className="stay-cost-controls">
                    <label className="field-group"><span className="field-label">{t("stay_price")}</span><div className="price-with-currency"><input type="number" min="0" step="0.01" value={stay.price} onChange={(event) => updateStay(stay.id, (current) => ({ ...current, price: event.target.value }))} /><CurrencySelect value={stay.currency} onChange={(currency) => updateStay(stay.id, (current) => ({ ...current, currency }))} /></div></label>
                    <div className="stay-split-choice"><span className="field-label">{t("split_method")}</span><div><button className={stay.splitMode === "people" ? "active" : ""} onClick={() => updateStay(stay.id, (current) => ({ ...current, splitMode: "people" }))}>{t("split_by_people")}</button><button className={stay.splitMode === "rooms" ? "active" : ""} onClick={() => updateStay(stay.id, (current) => ({ ...current, splitMode: "rooms" }))}>{t("split_by_rooms")}</button></div></div>
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
            }) : <div className="open-empty"><strong>{t("no_stays")}</strong><span>{t("no_stays_desc")}</span><button className="text-link" onClick={() => setShowStayForm(true)}>{t("add_stay")}</button></div>}
          </section>

          <section className="logistics-section cars-section">
            <div className="logistics-section-heading"><div><h2>{t("cars_seats")}</h2><p>{t("cars_help")}</p></div><div className="section-heading-actions"><strong>{fmt(costSummary.rentalTotal, outputCurrency)}<span>{t("car_rental_total")}</span></strong><button className="button secondary small-button" onClick={() => setShowCarForm(true)}>{t("add_car")}</button></div></div>
            {showCarForm && (
              <div className="car-creator">
                <label><span>{t("car_name")}</span><input autoFocus value={carForm.name} onChange={(event) => setCarForm((current) => ({ ...current, name: event.target.value }))} placeholder="Fiat 500X" /></label>
                <label><span>{t("seats")}</span><input type="number" min="1" value={carForm.seats} onChange={(event) => setCarForm((current) => ({ ...current, seats: event.target.value }))} /></label>
                <button className="button primary small-button" onClick={createCar}>{t("create_car")}</button>
                <button className="text-link" onClick={() => setShowCarForm(false)}>{t("cancel")}</button>
              </div>
            )}
            {vehicles.length ? vehicles.map((vehicle) => {
              const openSeats = Math.max(0, Number(vehicle.seats) - (vehicle.driverId ? 1 : 0) - vehicle.passengerIds.length);
              const rentalShares = getRentalShares(vehicle);
              return (
                <article className="vehicle-block" key={vehicle.id}>
                  <header><div><h3>{vehicle.name}</h3><span>{vehicle.seats} {t("seats").toLowerCase()}</span></div><button className="row-action" onClick={() => setVehicles((current) => current.filter((item) => item.id !== vehicle.id))}>{t("remove")}</button></header>
                  <div className="vehicle-grid">
                    <label><span>{t("driver")}</span><select value={vehicle.driverId} onChange={(event) => setDriver(vehicle.id, event.target.value)}><option value="">{t("choose_driver")}</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
                    <div className="passenger-control"><span>{t("passengers")}</span><div>{people.filter((person) => String(person.id) !== String(vehicle.driverId)).map((person) => <button className={vehicle.passengerIds.map(String).includes(String(person.id)) ? "selected" : ""} key={person.id} onClick={() => togglePassenger(vehicle.id, person.id)}>{person.name}</button>)}</div></div>
                    <strong className={openSeats ? "seats-available" : "seats-full"}>{openSeats === 0 ? t("car_full") : openSeats === 1 ? t("seat_open") : t("seats_open", { count: openSeats })}</strong>
                  </div>
                  {vehicle.driverId && <p className="driver-summary"><span>{t("driver")}</span><PersonAvatar person={personById(vehicle.driverId)} people={people} index={personIndex(vehicle.driverId)} size="small" /><strong>{personName(vehicle.driverId)}</strong></p>}
                  <section className={`rental-panel${vehicle.rentalEnabled ? " active" : ""}`}>
                    <div className="rental-panel-heading">
                      <div><strong>{t("rental_car")}</strong><span>{t("rental_help")}</span></div>
                      <button className={`rental-toggle${vehicle.rentalEnabled ? " active" : ""}`} onClick={() => toggleRental(vehicle.id)}><span />{vehicle.rentalEnabled ? t("rental_enabled") : t("not_rental")}</button>
                    </div>
                    {vehicle.rentalEnabled && (
                      <>
                        <div className="rental-cost-row">
                          <label className="field-group"><span className="field-label">{t("rental_price")}</span><div className="price-with-currency"><input type="number" min="0" step="0.01" value={vehicle.rentalPrice} onChange={(event) => setVehicles((current) => current.map((item) => item.id === vehicle.id ? { ...item, rentalPrice: event.target.value } : item))} placeholder="0.00" /><CurrencySelect value={vehicle.rentalCurrency} onChange={(rentalCurrency) => setVehicles((current) => current.map((item) => item.id === vehicle.id ? { ...item, rentalCurrency } : item))} /></div></label>
                          <div><strong>{vehicle.rentalParticipantIds.length ? fmt((Number(vehicle.rentalPrice) || 0) / vehicle.rentalParticipantIds.length, vehicle.rentalCurrency) : fmt(0, vehicle.rentalCurrency)}</strong><span>{t("per_participant")}</span></div>
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

          <section className="allocation-summary">
            <header><div><h2>{t("planned_split")}</h2><p>{t("planned_split_desc")}</p></div><strong>{fmt(costSummary.grandTotal, outputCurrency)}</strong></header>
            <div className="allocation-table">
              <div className="allocation-table-head"><span>{t("people")}</span><span>{t("stays")}</span><span>{t("rentals")}</span><span>{t("total")}</span></div>
              {people.map((person, index) => {
                const row = costSummary.rows[String(person.id)];
                return (
                  <div className="allocation-table-row" key={person.id}>
                    <span><PersonAvatar person={person} people={people} index={index} size="small" /><strong>{person.name}</strong></span>
                    <span>{fmt(row.stays, outputCurrency)}</span>
                    <span>{fmt(row.rentals, outputCurrency)}</span>
                    <strong>{fmt(row.stays + row.rentals, outputCurrency)}</strong>
                  </div>
                );
              })}
            </div>
          </section>
          <p className="auto-save-note">{t("logistics_saved")}</p>
        </div>

        <aside className="logistics-chat-rail"><ChatPanel compact /></aside>
      </div>
    </div>
  );
}
