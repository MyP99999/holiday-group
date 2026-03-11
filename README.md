# 🌴 Holiday Group

A web app for planning and calculating group vacation costs, with an integrated **MCP (Model Context Protocol) server** so Claude Code can help you plan trips through natural conversation.

---

## 📁 Project Structure

```
holiday-group/
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── App.jsx            ← Main React application
├── server/
│   ├── mcp-server.js      ← MCP server (tools for Claude Code)
│   ├── package.json
│   └── claude_desktop_config.json  ← Example config for Claude Desktop
├── package.json
├── CLAUDE.md               ← Project context for Claude Code
└── README.md
```

---

## 🚀 Part 1 — Run the React App

### Prerequisites

- **Node.js** >= 18 (download from https://nodejs.org)
- **npm** (comes with Node.js)

### Steps

```bash
# 1. Navigate to the project root
cd holiday-group

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000**.

---

## 🤖 Part 2 — Install Claude Code and Use It from VS Code Terminal

Claude Code is Anthropic's CLI coding agent that runs directly in your terminal. You can use it inside VS Code's integrated terminal.

### Prerequisites

- A **Claude Pro, Max, Team, or Enterprise** subscription (the free plan does NOT include Claude Code)
- **Node.js** >= 18 installed

### Step 1 — Install Claude Code

Open a terminal (either your system terminal or VS Code's integrated terminal) and run:

**macOS / Linux:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://claude.ai/install.ps1 | iex
```

> After installation, **close and reopen your terminal** so the `claude` command is recognized.

Verify it works:
```bash
claude --version
```

### Step 2 — Authenticate

Run `claude` for the first time — it will open your browser to log in:

```bash
claude
```

Choose your authentication method:
1. **Claude account with subscription** (Pro, Max, Team, or Enterprise)
2. **Anthropic Console account** (API usage billing)

Follow the browser prompts, then return to the terminal.

### Step 3 — Open the project in VS Code and start Claude Code

```bash
# Open the project folder in VS Code
code holiday-group

# In VS Code, open the integrated terminal:
#   Menu -> Terminal -> New Terminal
#   Or shortcut: Ctrl+` (backtick)

# Navigate to the project root (if not already there)
cd holiday-group

# Start Claude Code
claude
```

That's it! Claude Code is now running inside your VS Code terminal, with full context of the Holiday Group project.

### Step 4 — (Optional) Install the VS Code Extension

For a nicer GUI experience with inline diffs:

1. Open VS Code -> Extensions tab (Ctrl+Shift+X)
2. Search for **"Claude Code"** by Anthropic
3. Install it
4. Click the Claude icon that appears in the top-right of VS Code

The extension connects to your existing Claude Code CLI installation — no extra configuration needed.

---

## 🔧 Part 3 — Set Up the MCP Server (Holiday Tools for Claude Code)

The MCP server gives Claude Code 3 vacation-planning tools:

| Tool                     | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| `calculate_holiday_cost` | Full breakdown (accommodation + transport + rental)   |
| `convert_currency`       | Convert between EUR, USD, RON                         |
| `split_cost`             | Quick per-person split                                |

### Step 1 — Install MCP server dependencies

```bash
cd holiday-group/server
npm install
```

### Step 2 — Register the MCP server with Claude Code

From your terminal, run:

```bash
claude mcp add holiday-group node /FULL/PATH/TO/holiday-group/server/mcp-server.js
```

> Replace `/FULL/PATH/TO/` with the actual absolute path on your machine.
> Example macOS: `claude mcp add holiday-group node /Users/alex/projects/holiday-group/server/mcp-server.js`
> Example Windows (WSL): `claude mcp add holiday-group node /home/alex/projects/holiday-group/server/mcp-server.js`

### Step 3 — Verify the tools are available

Start Claude Code and ask it to list its tools, or just try a prompt:

```bash
claude
```

Then type something like:

> "Calculate the cost for a 5-night trip to Greece for 6 people. Accommodation is 120 EUR/night, flights are 250 EUR/person, and we need 2 rental cars at 45 EUR/day for 5 days. Show me everything in RON."

### Alternative: Connect to Claude Desktop App

If you prefer the Claude Desktop app instead of the CLI:

1. Open **Claude Desktop** -> **Settings** -> **Developer** -> **Edit Config**
2. The config file is at:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
3. Add this:

```json
{
  "mcpServers": {
    "holiday-group": {
      "command": "node",
      "args": ["/FULL/PATH/TO/holiday-group/server/mcp-server.js"]
    }
  }
}
```

4. **Restart Claude Desktop** completely.
5. Look for the tools icon in the chat input.

---

## 💬 Example Prompts

Once the MCP server is connected, try asking Claude:

- "Calculate the cost for a 5-night trip to Greece for 6 people. Accommodation is 120 EUR/night, flights are 250 EUR/person, and we need 2 rental cars at 45 EUR/day for 5 days. Show me everything in RON."
- "Convert 500 RON to EUR."
- "We spent 3200 EUR total. Split it between 8 people."

---

## 💱 Exchange Rates

The app uses **fixed indicative rates**:

| From | To EUR | To USD | To RON |
| ---- | ------ | ------ | ------ |
| EUR  | 1.00   | 1.08   | 4.97   |
| USD  | 0.926  | 1.00   | 4.60   |
| RON  | 0.201  | 0.217  | 1.00   |

To use live rates, integrate an API like exchangerate.host or Open Exchange Rates into both `App.jsx` and `mcp-server.js`.

---

## 📝 License

MIT — free to use and modify.
