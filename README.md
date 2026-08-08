# HolidaySplits

A local-first React app for planning group trips, tracking shared expenses, splitting restaurant bills, reviewing receipt items, converting currencies, and settling balances.

## Run locally

```bash
npm install
npm start
```

The app runs at `http://localhost:3000`.

Create a production build with:

```bash
npm run build
```

## Product modes

- **Local trip:** no account; each named trip is stored in this browser.
- **Shared room:** a free Supabase email/password or Google account is required, with database persistence and realtime room updates.

An account user can claim an unclaimed person that the organizer already added or join with a new trip-specific display name. The creator becomes the first admin. Legacy guest links redirect to the account flow and preserve the room code so the invitation can continue after sign-in.

## Supabase setup

Copy `.env.example` to `.env` and set the project URL and public anon key. The browser only reads variables prefixed with `REACT_APP_`; keep the personal access token and secret/service-role key server-side.

The database migrations are in `supabase/migrations/`. They create profiles, trips, members, expenses, stays, vehicles, flights, group decision polls, comments, chat, settlement routing/history, avatar storage, realtime publication entries, RPCs, and row-level security policies.

For a new linked Supabase project, apply migrations with the Supabase CLI:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Email/password authentication works with Supabase Auth immediately. Google login also requires enabling the Google provider, adding the app URL to the allowed redirect URLs in the Supabase dashboard, and setting `REACT_APP_GOOGLE_AUTH_ENABLED=true`.

For production email confirmations and password recovery, configure a custom SMTP provider in Supabase Authentication settings. Keep SMTP credentials out of all `REACT_APP_` variables; those variables are included in the browser bundle.

## Vercel deployment

The app is configured as a Create React App single-page application. `vercel.json` sends direct browser requests such as `/online` to `index.html`, where React Router handles them. Legacy `/guest` URLs are compatibility redirects into account creation.

- Production: <https://holidaysplits.com>
- Vercel project: <https://vercel.com/myp99999s-projects/holiday-group>

### Automatic production pipeline

The repository is connected directly to the Vercel project and `main` is its production branch. Every push to `main` triggers both the GitHub Actions build check in `.github/workflows/production.yml` and Vercel's production deployment to `https://holidaysplits.com`. Pull requests run the same build check without publishing to production. The workflow can also be run manually from GitHub's Actions tab.

Vercel's native Git integration owns the deployment step, so no `VERCEL_TOKEN` needs to be copied into GitHub Actions and a push creates only one deployment.

Add only these browser-safe variables to the Vercel project's **Production** and **Preview** environments:

```text
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
REACT_APP_GOOGLE_AUTH_ENABLED
```

Do not upload the local `.env` file or add `SUPABASE_SECRET_KEY`, `SUPABASE_ACCESS_TOKEN`, SMTP/Resend credentials, or Vercel credentials to the frontend project. `.vercelignore` provides an additional safeguard for CLI deployments. Redeploy after changing Vercel environment variables because Create React App embeds `REACT_APP_` values during the build.

Supabase Auth uses `https://holidaysplits.com` as its Site URL. Keep `http://localhost:3000/**`, the stable Vercel URL, and the required Vercel preview URL pattern in the redirect allow list for development and deployment previews.

## Features

- Equal or exact custom expense shares
- Per-item receipt contributor assignment
- Dedicated restaurant split with item assignment, tip, and tax
- Group voting for accommodations, rental cars, flights, restaurants, activities, and custom decisions
- Settlement minimization across equal and custom splits
- Alternative settlement routes through another member when a direct payment is not possible
- Confirmed payments that update balances and move into a dated settlement history
- Existing-person claiming during authenticated room join, with duplicate and already-claimed protection
- Stable, unique member colors with disambiguating 2–3 letter monograms, photo-ready avatars, and full names on hover or phone long-press
- Multiple accommodations with total prices, selected participants, room capacities, room assignments, and guest/room split modes
- Multiple cars with drivers, seat limits, passenger assignment, optional rental prices, and separate rental contributors
- Flights with airports, airline/flight number, departure and arrival details, fares, travelers, comments, and equal splitting
- Combined per-person planning totals across stays, car rentals, and flights
- Comments attached to accommodations and cars, plus a persistent group chat
- Creator/admin roles with admin promotion
- 13 currencies with automatically refreshed daily ECB reference rates, six-hour browser caching, and an offline fallback table
- English, Romanian, Spanish, French, and German interface languages
- Responsive desktop workspace and mobile receipt, restaurant, logistics, and chat flows
- Local and Supabase persistence through interchangeable storage drivers

Receipt upload/camera capture is implemented, while OCR extraction is currently simulated with editable sample data. This keeps the review and contribution workflow usable before an OCR/backend service is connected.

Currency rates are fetched from the keyless Frankfurter v2 API with the provider pinned to ECB data. The browser cache is reused for six hours and stale/fallback rates remain available when the live endpoint cannot be reached. Reference rates are informational and may differ from card or bank settlement rates.

## Architecture

```text
src/
  components/       Shared interface primitives
  context/          App, authentication, and language state
  layouts/          Responsive trip workspace shell
  pages/            Landing, lobbies, expenses, scan, restaurant, settle, logistics, chat
  storage/          Local session and Supabase room driver adapters
  constants.js      Currency metadata and reference values
  utils.js          Conversion, shares, balances, and settlement helpers
```

The UI reads and writes through a small driver contract (`read`, `write`, `subscribe`). Shared trip state contains people/roles and claim status, expenses, completed settlement payments, accommodations, vehicles, comments, chat messages, and payment-route preferences. Supabase rooms use authenticated RPCs and realtime subscriptions; local trips keep the same page-level workflows with browser storage.

Design references generated for this redesign are kept in `design-references/`. The production landing image is in `public/images/`.

## MCP server

The existing Model Context Protocol server remains under `server/`. Its package and configuration are independent from the React app.
