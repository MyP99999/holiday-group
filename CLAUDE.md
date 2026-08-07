# Holiday Group

## Commands

- `npm install` — install dependencies
- `npm start` — start the React development server on port 3000
- `npm run build` — create a production build

## Architecture

- React 18 with Create React App and React Router
- Page-level features under `src/pages`
- Shared product shell in `src/layouts/AppLayout.jsx`
- Shared calculation helpers in `src/utils.js`
- Local persistence behind interchangeable drivers in `src/storage`
- MCP server in `server/mcp-server.js`

## Product state

- Local trips and prototype rooms persist in `localStorage`.
- Guest rooms do not require an account.
- Guest nicknames are added to People automatically; creators are admins and can promote members.
- Accommodations, rooms, cars, comments, chat, and alternate settlement routes persist in the trip state.
- Receipt OCR is simulated; the upload, review, contributor, and save flows are real local UI.
- Supabase is the planned backend for authentication, database persistence, and realtime rooms.

## UI conventions

- Core product flows are available in English, Romanian, Spanish, French, and German through `LanguageContext`.
- Editorial travel aesthetic: off-white canvas, ink text, terracotta action color, sage positive state.
- DM Serif Display for major headings and Manrope for UI text.
- Navigation is text-first and icon use is intentionally restrained.
