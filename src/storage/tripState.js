import { PERSON_COLORS } from "../constants";

export function createId(prefix = "item") {
  const random = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return `${prefix}-${random}`;
}

function stringHash(value = "") {
  return [...String(value)].reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0, 0);
}

export function nextPersonColor(people = [], seed = "") {
  const used = new Set(people.map((person) => person.color).filter(Boolean));
  const paletteColor = PERSON_COLORS.find((color) => !used.has(color));
  if (paletteColor) return paletteColor;

  const base = Math.abs(stringHash(seed));
  for (let offset = 0; offset < 36; offset += 1) {
    const hue = Math.round((base + (people.length + offset) * 137.508) % 360);
    const color = `hsl(${hue} 42% 43%)`;
    if (!used.has(color)) return color;
  }
  return `hsl(${people.length * 37 % 360} 42% 43%)`;
}

export function normalizePaymentDetails(person = {}) {
  return {
    accountHolder: typeof person.accountHolder === "string" ? person.accountHolder : "",
    iban: typeof person.iban === "string" ? person.iban : "",
    paymentMethods: Array.isArray(person.paymentMethods)
      ? person.paymentMethods
        .filter((method) => method && typeof method === "object")
        .map((method, index) => ({
          id: method.id || `payment-method-${index}`,
          type: method.type || "other",
          value: typeof method.value === "string" ? method.value : "",
        }))
      : [],
    paymentNote: typeof person.paymentNote === "string" ? person.paymentNote : "",
  };
}

export function createDefaultTripState(tripName = "Untitled trip", creatorName = "") {
  const creatorId = createId("person");
  const createdAt = new Date().toISOString();
  const creator = creatorName.trim()
    ? { id: creatorId, name: creatorName.trim(), role: "admin", color: nextPersonColor([], creatorId), joinedAt: createdAt, claimedAt: createdAt }
    : null;

  return {
    tripName,
    people: creator ? [creator] : [],
    expenses: [],
    accommodations: [],
    vehicles: [],
    flights: [],
    polls: [],
    comments: [],
    chatMessages: [],
    paymentRoutes: {},
    settlementPayments: [],
  };
}

export function normalizeTripState(raw, fallbackName = "Untitled trip") {
  const source = raw || {};
  let people = [];
  if (Array.isArray(source.people)) {
    source.people.forEach((person) => {
      const color = person.color && !people.some((existing) => existing.color === person.color)
        ? person.color
        : nextPersonColor(people, person.id || person.name);
      people.push({
        ...person,
        ...normalizePaymentDetails(person),
        color,
        role: person.role === "admin" ? "admin" : "member",
        claimedAt: person.claimedAt || null,
      });
    });
  }

  if (people.length && !people.some((person) => person.role === "admin")) {
    people = people.map((person, index) => index === 0 ? { ...person, role: "admin" } : person);
  }

  return {
    ...source,
    tripName: source.tripName || fallbackName,
    people,
    expenses: Array.isArray(source.expenses) ? source.expenses : [],
    accommodations: Array.isArray(source.accommodations) ? source.accommodations.map((stay) => {
      const rooms = Array.isArray(stay.rooms)
        ? stay.rooms.map((room) => ({ ...room, occupantIds: room.occupantIds || [] }))
        : [];
      const roomParticipants = [...new Set(rooms.flatMap((room) => room.occupantIds || []))];
      const legacyRoomTotal = rooms.reduce((sum, room) => sum + (Number(room.cost) || 0), 0);
      return {
        ...stay,
        price: stay.price ?? legacyRoomTotal,
        splitMode: stay.splitMode === "people" ? "people" : "rooms",
        participantIds: Array.isArray(stay.participantIds) ? stay.participantIds : roomParticipants,
        rooms,
      };
    }) : [],
    vehicles: Array.isArray(source.vehicles) ? source.vehicles.map((vehicle) => ({
      ...vehicle,
      passengerIds: vehicle.passengerIds || [],
      rentalEnabled: Boolean(vehicle.rentalEnabled),
      rentalPrice: vehicle.rentalPrice ?? "",
      rentalCurrency: vehicle.rentalCurrency || "EUR",
      rentalParticipantIds: Array.isArray(vehicle.rentalParticipantIds) ? vehicle.rentalParticipantIds : [],
    })) : [],
    flights: Array.isArray(source.flights) ? source.flights.map((flight) => ({
      ...flight,
      airline: flight.airline || "",
      flightNumber: flight.flightNumber || "",
      from: flight.from || "",
      to: flight.to || "",
      departureDate: flight.departureDate || "",
      departureTime: flight.departureTime || "",
      arrivalDate: flight.arrivalDate || "",
      arrivalTime: flight.arrivalTime || "",
      price: flight.price ?? "",
      currency: flight.currency || "EUR",
      participantIds: Array.isArray(flight.participantIds) ? flight.participantIds : [],
    })) : [],
    polls: Array.isArray(source.polls) ? source.polls.map((poll, pollIndex) => ({
      ...poll,
      id: poll.id || `poll-${pollIndex}`,
      category: ["accommodation", "rental_car", "flight", "restaurant", "activity", "other"].includes(poll.category) ? poll.category : "other",
      question: poll.question || "Group decision",
      status: poll.status === "closed" ? "closed" : "open",
      createdBy: poll.createdBy || "",
      options: Array.isArray(poll.options) ? poll.options.map((option, optionIndex) => ({
        ...option,
        id: option.id || `${poll.id || `poll-${pollIndex}`}-choice-${optionIndex}`,
        title: option.title || `Choice ${optionIndex + 1}`,
        detail: option.detail || "",
        price: option.price ?? "",
        currency: option.currency || "EUR",
        url: option.url || "",
        voterIds: Array.isArray(option.voterIds) ? [...new Set(option.voterIds.map(String))] : [],
      })) : [],
    })) : [],
    comments: Array.isArray(source.comments) ? source.comments : [],
    chatMessages: Array.isArray(source.chatMessages) ? source.chatMessages : [],
    paymentRoutes: source.paymentRoutes && typeof source.paymentRoutes === "object" ? source.paymentRoutes : {},
    settlementPayments: Array.isArray(source.settlementPayments) ? source.settlementPayments : [],
  };
}
