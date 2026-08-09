import { supabase } from "../lib/supabase";
import { packOnlineTripState, unpackOnlineTripState } from "./onlineStateCodec";

function friendlyError(error) {
  const message = error?.message || "Something went wrong. Please try again.";
  if (message.includes("ROOM_NOT_FOUND_OR_FORBIDDEN") || message.includes("ROOM_NOT_FOUND")) {
    return new Error("Room not found, or you no longer have access.");
  }
  if (message.includes("PERSON_ALREADY_CLAIMED")) {
    return new Error("That person has already been claimed. Refresh and choose another name.");
  }
  if (message.includes("ALREADY_IN_TRIP")) {
    return new Error("You already joined this trip.");
  }
  return new Error(message);
}

async function rpc(name, params = {}) {
  const { data, error } = await supabase.rpc(name, params);
  if (error) throw friendlyError(error);
  return data;
}

export async function createOnlineRoom(name, creatorName) {
  return rpc("create_trip", { p_name: name, p_creator_name: creatorName });
}

export async function listOnlineRooms() {
  const rooms = await rpc("list_my_trips");
  return (rooms || []).map((room) => ({
    tripId: room.trip_id,
    code: room.code,
    name: room.name,
    memberId: room.member_id,
    role: room.member_role,
    updatedAt: room.updated_at,
  }));
}

export async function previewOnlineRoom(code) {
  return rpc("preview_trip", { p_code: code });
}

export async function joinOnlineRoom(code, name) {
  return rpc("join_trip", { p_code: code, p_name: name });
}

export async function claimOnlineRoomMember(code, memberId) {
  return rpc("claim_trip_member", { p_code: code, p_member_id: memberId });
}

const realtimeTables = [
  "trip_members",
  "expenses",
  "accommodations",
  "vehicles",
  "flights",
  "trip_polls",
  "trip_comments",
  "chat_messages",
  "payment_routes",
  "settlement_payments",
];

export function supabaseRoomDriver(roomCode) {
  const code = String(roomCode || "").trim().toUpperCase();
  let tripId = "";
  let writeQueue = Promise.resolve();

  const driver = {
    isAsync: true,

    async read() {
      const state = await rpc("get_trip_state", { p_code: code });
      tripId = state?.tripId || tripId;
      return unpackOnlineTripState(state);
    },

    write(state) {
      writeQueue = writeQueue
        .catch(() => undefined)
        .then(() => rpc("save_trip_state", { p_code: code, p_state: packOnlineTripState(state) }));
      return writeQueue;
    },

    writeMemberProfile(memberId, details) {
      return rpc("update_trip_member_payment_details", {
        p_code: code,
        p_member_id: memberId,
        p_account_holder: details.accountHolder || "",
        p_iban: details.iban || "",
        p_payment_methods: details.paymentMethods || [],
        p_payment_note: details.paymentNote || "",
      });
    },

    subscribe(callback) {
      if (!tripId) return () => {};

      let refreshTimer = null;
      let disposed = false;
      const refresh = () => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(async () => {
          try {
            const state = await driver.read();
            if (!disposed) callback(state);
          } catch {
            // A later local action or page load will surface connection errors.
          }
        }, 180);
      };

      let channel = supabase.channel(`trip:${tripId}:${crypto.randomUUID()}`);
      channel = channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips", filter: `id=eq.${tripId}` },
        refresh
      );
      realtimeTables.forEach((table) => {
        channel = channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table, filter: `trip_id=eq.${tripId}` },
          refresh
        );
      });
      channel.subscribe();

      return () => {
        disposed = true;
        window.clearTimeout(refreshTimer);
        supabase.removeChannel(channel);
      };
    },
  };

  return driver;
}
