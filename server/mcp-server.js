#!/usr/bin/env node

/**
 * Holiday Group — MCP Server
 * 
 * This is a Model Context Protocol (MCP) server that exposes
 * holiday cost calculation tools to any MCP-compatible client
 * (Claude Desktop, Claude Code, Cursor, etc.).
 * 
 * Tools provided:
 *   1. calculate_holiday_cost  — Full vacation cost breakdown
 *   2. convert_currency        — Currency conversion (EUR/USD/RON)
 *   3. split_cost              — Quick per-person split
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ── Exchange rates (base: EUR) ──────────────────────────────────
// For a production app you'd fetch live rates from an API.
const RATES = {
  EUR: { EUR: 1, USD: 1.08, RON: 4.97 },
  USD: { EUR: 0.926, USD: 1, RON: 4.60 },
  RON: { EUR: 0.201, USD: 0.217, RON: 1 },
};

function convert(amount, from, to) {
  if (!RATES[from] || !RATES[from][to]) {
    throw new Error(`Unsupported currency pair: ${from} → ${to}`);
  }
  return amount * RATES[from][to];
}

// ── Server setup ────────────────────────────────────────────────
const server = new Server(
  { name: "holiday-group", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ── List tools ──────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "calculate_holiday_cost",
      description:
        "Calculate the total cost of a group vacation including accommodation, transport, and car rentals. Returns totals in the requested output currency.",
      inputSchema: {
        type: "object",
        properties: {
          participants: {
            type: "number",
            description: "Number of people in the group",
          },
          nights: {
            type: "number",
            description: "Number of nights for the stay",
          },
          output_currency: {
            type: "string",
            enum: ["EUR", "USD", "RON"],
            description: "Currency for the final totals",
          },
          accommodation: {
            type: "object",
            description: "Chosen accommodation option",
            properties: {
              name: { type: "string" },
              cost_per_night: { type: "number" },
              currency: { type: "string", enum: ["EUR", "USD", "RON"] },
            },
            required: ["cost_per_night", "currency"],
          },
          transport: {
            type: "object",
            description: "Chosen transport option",
            properties: {
              mode: { type: "string" },
              cost_per_person: { type: "number" },
              currency: { type: "string", enum: ["EUR", "USD", "RON"] },
            },
            required: ["cost_per_person", "currency"],
          },
          car_rental: {
            type: "object",
            description: "Car rental details (omit if not needed)",
            properties: {
              cost_per_day: { type: "number" },
              currency: { type: "string", enum: ["EUR", "USD", "RON"] },
              num_cars: { type: "number" },
              num_days: { type: "number" },
            },
            required: ["cost_per_day", "currency", "num_cars", "num_days"],
          },
        },
        required: ["participants", "nights", "output_currency"],
      },
    },
    {
      name: "convert_currency",
      description: "Convert an amount between EUR, USD, and RON.",
      inputSchema: {
        type: "object",
        properties: {
          amount: { type: "number", description: "Amount to convert" },
          from: { type: "string", enum: ["EUR", "USD", "RON"] },
          to: { type: "string", enum: ["EUR", "USD", "RON"] },
        },
        required: ["amount", "from", "to"],
      },
    },
    {
      name: "split_cost",
      description: "Split a total cost equally among a group of people.",
      inputSchema: {
        type: "object",
        properties: {
          total: { type: "number", description: "Total amount" },
          participants: { type: "number", description: "Number of people" },
          currency: { type: "string", enum: ["EUR", "USD", "RON"] },
        },
        required: ["total", "participants"],
      },
    },
  ],
}));

// ── Call tool ────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    // ── calculate_holiday_cost ──
    case "calculate_holiday_cost": {
      const { participants, nights, output_currency, accommodation, transport, car_rental } = args;
      const cur = output_currency;

      let accTotal = 0;
      let accNote = "No accommodation selected";
      if (accommodation) {
        accTotal = convert(accommodation.cost_per_night, accommodation.currency, cur) * nights;
        accNote = `${accommodation.name || "Accommodation"}: ${accommodation.cost_per_night} ${accommodation.currency}/night × ${nights} nights`;
      }

      let transportTotal = 0;
      let transportNote = "No transport selected";
      if (transport) {
        transportTotal = convert(transport.cost_per_person, transport.currency, cur) * participants;
        transportNote = `${transport.mode || "Transport"}: ${transport.cost_per_person} ${transport.currency}/person × ${participants} people`;
      }

      let rentalTotal = 0;
      let rentalNote = "No car rental";
      if (car_rental) {
        const rentalRaw = car_rental.cost_per_day * car_rental.num_cars * car_rental.num_days;
        rentalTotal = convert(rentalRaw, car_rental.currency, cur);
        rentalNote = `${car_rental.num_cars} car(s) × ${car_rental.num_days} days × ${car_rental.cost_per_day} ${car_rental.currency}/day`;
      }

      const grandTotal = accTotal + transportTotal + rentalTotal;
      const perPerson = participants > 0 ? grandTotal / participants : 0;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                summary: {
                  accommodation: { total: +accTotal.toFixed(2), note: accNote },
                  transport: { total: +transportTotal.toFixed(2), note: transportNote },
                  car_rental: { total: +rentalTotal.toFixed(2), note: rentalNote },
                },
                grand_total: +grandTotal.toFixed(2),
                per_person: +perPerson.toFixed(2),
                currency: cur,
                participants,
                nights,
                exchange_rates_used: RATES[cur],
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // ── convert_currency ──
    case "convert_currency": {
      const result = convert(args.amount, args.from, args.to);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              original: { amount: args.amount, currency: args.from },
              converted: { amount: +result.toFixed(2), currency: args.to },
              rate: RATES[args.from][args.to],
            }),
          },
        ],
      };
    }

    // ── split_cost ──
    case "split_cost": {
      const each = args.participants > 0 ? args.total / args.participants : 0;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              total: args.total,
              participants: args.participants,
              per_person: +each.toFixed(2),
              currency: args.currency || "EUR",
            }),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// ── Start ───────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Holiday Group MCP server running on stdio");
}

main().catch(console.error);
