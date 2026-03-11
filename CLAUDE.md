# Holiday Group

## Commands
- `npm install` - Install dependencies
- `npm start` - Start dev server on port 3000
- `npm run build` - Production build

## Architecture
- React 18 with Create React App
- Single-file component in `src/App.jsx`
- MCP server in `server/mcp-server.js` (ES modules, uses @modelcontextprotocol/sdk)

## Key Features
- Group vacation cost calculator with participants, accommodation, transport, car rentals
- Currency support: EUR, USD, RON with conversion
- Voting system for accommodation and transport options
- Cost summary with per-person breakdown

## Conventions
- All UI text in English
- Bright, colorful theme (coral, peach, mint, sky, lilac)
- Font: Outfit + Caveat (loaded from Google Fonts CDN)
- CSS-in-JS via style tag in App component
