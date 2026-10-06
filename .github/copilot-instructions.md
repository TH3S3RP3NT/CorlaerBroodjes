# Copilot instructions for CorlaerBroodjes

## Project commands

Use npm from the repository root. Dependencies are already described by `package-lock.json`.

```bash
npm run dev             # Start the Next.js development server at http://localhost:3000
npm run build           # Create a production build
npm start               # Serve the production build
npm run lint            # Run ESLint (the script is just `eslint`)
npm run db:push         # Push the Drizzle schema to the configured PostgreSQL database
npm run db:generate     # Generate Drizzle migrations from schema changes
npm run db:migrate      # Apply generated Drizzle migrations
```

There is currently no test script, test runner, or committed test suite, so there is no single-test command. For a focused check, run `npm run lint` and exercise the relevant route/page with the development server; use the Drizzle commands only against an intentionally configured database.

Local development needs `.env.local` (it is ignored by Git). At minimum, database access requires `DATABASE_URL`; web authentication uses `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`. The mobile API additionally uses `GOOGLE_IOS_CLIENT_ID`. Scheduling can be configured with `BREAK_TIMES`, `ORDER_LEAD_MINUTES`, and `NO_SCHOOL_DATES`. Do not commit credentials or copy `.env.local` into source control.

## Architecture

- This is a Next.js 16 App Router application using TypeScript, React 19, Tailwind CSS v4, and the React Compiler. Application code is under `src/`; route segments in `src/app` define both pages and API handlers.
- Pages are server components by default and query PostgreSQL directly through Drizzle (`src/db/index.ts`). Interactive/session-aware UI uses explicit client components such as `providers.tsx`, `header.tsx`, and the profile/order screens.
- `src/db/schema.ts` is the source of truth for the PostgreSQL schema and relations: users, locations, products, orders, order items, and daily forecasts. Order creation, cancellation, and stale-order cleanup must keep stock changes and status changes in the same Drizzle transaction.
- The browser uses NextAuth with Google at `/api/auth/[...nextauth]`. Sign-in permits only `@corlaercollege.nl` personnel or `@lln.corlaercollege.nl` student accounts, upserts the user, and enriches the session with the database user ID/name/role. The admin page enforces `session.user.role === "ADMIN"` on the server.
- The `/api/v1` surface is the mobile/iOS API. `src/lib/api.ts` issues and validates separate NextAuth JWTs marked with `kind: "app"`; do not treat a normal web session token as a mobile token. Protected handlers call `authenticate()` and return the shared `{ error: { code, message } }` shape on failures.
- API response conversion belongs in `src/lib/dto.ts`. Mobile prices are integer cents (`priceCents`, `totalCents`, and `unitPriceCents`) even though PostgreSQL stores numeric euro values.
- Order creation in `/api/v1/orders` validates limits, checks the configured pickup break and lead time, reads prices from the database, atomically decrements stock with a non-negative guard, and starts at `PENDING_PAYMENT`. Cancellation and stale-payment cleanup return reserved stock. Keep these invariants when changing order flows.
- `src/lib/schedule.ts` is the central scheduling helper. Breaks are configured as `HH:MM`, interpreted in `Europe/Amsterdam`, and can be disabled for dates listed in `NO_SCHOOL_DATES`; reuse these helpers instead of duplicating timezone arithmetic.
- The web product pages read live database rows and use dynamic `/products/[id]` routes. The admin routes read related orders/products and are server-protected; do not move authorization checks into presentation-only client code.

## Repository conventions

- Use the `@/*` TypeScript alias for imports from `src` (for example, `@/db` and `@/lib/api`), and use the existing Drizzle relation/query APIs rather than handwritten SQL unless an atomic SQL expression is required.
- Keep route handlers explicit about authentication, input validation, status codes, and localized Dutch user-facing error messages. Unexpected errors are logged with a route-specific prefix and returned through `jsonError`; preserve that pattern.
- Use `ApiError` for expected business failures inside transactions so they can be converted to the established API error response without swallowing unexpected database errors.
- Preserve ownership checks on mobile order endpoints: a user may only read, cancel, or pay their own order. Preserve status guards so retries cannot double-release stock or pay an order twice.
- Keep money arithmetic in cents at API boundaries and round database numeric prices before calculating totals. Do not trust client-supplied prices.
- Database changes start in `src/db/schema.ts`; use the Drizzle scripts in `package.json` to generate/apply schema changes rather than editing generated migration output by hand.
- Keep browser-only code behind `"use client"` and keep database/auth secrets in server code. Do not import `src/db` into client components.
- Follow the existing UI styling vocabulary in `src/app/globals.css` and the BEM-like class names used by the page components (`products-page__...`, `admin-page__...`, etc.).
- Read the relevant guide under `node_modules/next/dist/docs/` before making framework-level changes. The repository’s `AGENTS.md` records that this Next.js version has breaking changes and that its generated guidance block may be restored by `next dev`; retain that guidance.
