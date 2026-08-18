# SearchHub — frontend

The React client for the price-comparison platform: search products across
marketplaces, compare any product link, browse an admin-curated catalog,
keep a wishlist, set price-drop alerts, and receive them live over a push
connection.

It talks to the [price-compare backend](../mani_ravi) over HTTP. Nothing in
this repo persists data of its own.

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Testing on a phone](#testing-on-a-phone)
- [Environment variables](#environment-variables)
- [Routes](#routes)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [How this talks to the API](#how-this-talks-to-the-api)
- [Auth](#auth)
- [The admin catalog surface](#the-admin-catalog-surface)
- [Category browsing](#category-browsing)
- [Known gaps](#known-gaps)

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | react-router-dom 7 |
| Styling | Tailwind CSS v4 (CSS-first — no `tailwind.config.js`) |
| Linting | Oxlint |
| Real-time | `EventSource` (SSE) against the backend's notification stream |
| State | React context per concern (`src/context/`) — no Redux/Zustand |

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
```

The backend must be running (default `http://localhost:4995`). With no `.env`
at all, this client points at the same host it was served from, on port
`4995` — see [Environment variables](#environment-variables).

```bash
npm run build        # production bundle into dist/
npm run preview      # serve the built bundle
npm run lint         # oxlint
```

`npm run lint` currently reports **4 warnings**, all the same
`react(only-export-components)` fast-refresh rule, one per file in
`src/context/`. Each of those files exports both a provider component and its
`useX()` hook — splitting them into separate files to satisfy the rule buys
nothing but an extra import everywhere. They're expected; a *fifth* warning
is not.

## Testing on a phone

`vite.config.js` sets `server: { host: true }` and prints the LAN URL to open
on a phone, filtering out the VMware/WSL/VPN adapters that otherwise bury the
real one among five wrong candidates.

This works because `src/lib/config.js` derives the API base from
`window.location.hostname` rather than hardcoding `localhost` — open the app
at `http://192.168.1.8:5173` and it calls `http://192.168.1.8:4995`, instead
of the phone asking *itself* for the API. The backend reflects any
private-LAN origin in development for the same reason, so a DHCP lease
change doesn't break CORS.

## Environment variables

Every value has a working default; `npm run dev` needs no `.env`. See
`.env.example` for the committed template (`.env` itself is gitignored).

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_PORT` | `4995` | API port on the same host that served the app. |
| `VITE_API_BASE_URL` | *(unset)* | Full API origin. When set it wins outright and `VITE_API_PORT` is ignored — this is what a real deployment needs, where the API is on its own host/scheme. |
| `VITE_DEFAULT_SEARCH_QUERY` | `laptop` | The search run when `/search` is opened with no `?q=`. |
| `VITE_SEARCH_PAGE_SIZE` | `20` | Results per page on search. Clamped to 50 in `config.js`, because the backend's Zod schema rejects anything higher — clamping turns an over-large value into a smaller page rather than a 400. |
| `VITE_CATEGORY_PAGE_SIZE` | `20` | Products per page on category pages. Same clamp, same reason. |

> **Never put a secret in this file.** Vite substitutes `VITE_*` variables at
> **build** time, so everything here is readable in the shipped JavaScript by
> anyone who opens devtools. That specifically includes the admin API key —
> see [The admin catalog surface](#the-admin-catalog-surface).

## Routes

| Path | Page | Auth |
|---|---|---|
| `/search` | Multi-marketplace search | optional |
| `/categories` | Category browse grid | — |
| `/categories/:category` | Curated products in one category | — |
| `/categories/:category/:id` | Click-through: live listings for a catalog entry | — |
| `/compare-url` | Compare any product link | — |
| `/products/:id` | Product detail | — |
| `/login`, `/signup` | Auth | — |
| `/wishlist` | Saved products | 🔒 |
| `/alerts` | Price-drop alerts | 🔒 |
| `/notifications` | Notification inbox + live SSE stream | 🔒 |
| `/admin` | Catalog admin | 🔑 admin key |
| `*` | Falls through to `/search` | — |

🔒 wraps in `ProtectedRoute`, which redirects to `/login` when the session is
gone. 🔑 is a different scheme entirely — see below.

`/admin` is deliberately **not linked from the nav**. It authenticates with a
shared secret rather than a user login, so it isn't a destination for
shoppers; it's reached by URL by whoever holds the key.

## Project structure

```
src/
  App.jsx              Router, top nav, provider nesting
  main.jsx             Entry point
  index.css            Tailwind v4 @theme tokens + component classes

  components/
    icons.jsx          Inline SVG icon set (no emoji - see Design system)
    BottomTabBar.jsx   Mobile-only bottom nav
    ProtectedRoute.jsx
    ui/                Shared presentational components used by 2+ pages

  context/             One provider per concern: Auth, Wishlist, Alert, Notification

  lib/                 Framework-free helpers
    config.js          Every environment-dependent value, resolved once
    apiBase.js         Just the API base string, for the many api.js files
    http.js            Shared response parsing + the global 401 hook
    adminKey.js        Admin key storage (and why it is NOT an env var)
    marketplace.js     Per-marketplace badge/avatar styling registry
    formatPrice.js, decodeHtml.js, discount.js, jwt.js, timeAgo.js, categoryPath.js

  pages/<feature>/
    <Feature>Page.jsx  The route component
    api.js             Every fetch for that feature, in one file
    components/        Components used only by that feature
```

The rule that keeps this navigable: **a component lives in `pages/<feature>/
components/` until a second feature needs it, then it moves to
`components/ui/`.** Earlier versions had `Stars`, `MarketplaceBadge`,
`StateMessage` and `WishlistButton` duplicated near-identically four times
each, and restyling meant editing four copies and missing one.

## Design system

Tailwind v4 is CSS-first — there is no `tailwind.config.js`. Tokens live in
the `@theme` block in `src/index.css`, and the repeated multi-utility
patterns are component classes in `@layer components`:

- `.btn-primary` / `.btn-secondary` / `.btn-ghost` — pill buttons; primary is
  a violet→cyan gradient with a tinted glow shadow.
- `.card-surface` — the standard white panel. Radius is deliberately left to
  the call site's `rounded-*` utility, so a utility (higher cascade layer)
  never silently fights a radius declared here.
- `.aurora-bg` — the soft page wash behind every route.
- `.animate-in` — entrance fade/slide, disabled under
  `prefers-reduced-motion`.

Two conventions worth not re-litigating:

**No emoji as icons.** Everything is an inline SVG in
`src/components/icons.jsx`. Emoji render differently on every platform and
read as unfinished in a tool that's asking people to trust its prices.

**`overflow-x: clip`, never `hidden`, on `html`/`body`.** `hidden` makes
those elements scroll containers, which silently breaks `position: sticky`
for *every* descendant — that's what once made the nav drift and the sticky
product image stop sticking. `clip` prevents horizontal scroll without that
side effect. Paired with `scrollbar-gutter: stable` so the layout doesn't
shift when a scrollbar appears.

## How this talks to the API

Each feature owns an `api.js`; nothing else calls `fetch` directly. All of
them route responses through `parseResponse` in `src/lib/http.js`, which
**reads the JSON body before deciding what to throw**.

That ordering matters. This backend ships a specific, useful message on
non-2xx responses (`"A search query 'q' is required"`, `"URL not recognized.
Supported marketplaces: …"`). Several pages used to bail out on `!res.ok`
first and throw a bare `HTTP 400`, discarding exactly the text the user
needed. `parseResponse` also maps 429 to a rate-limit message and 404 to a
per-call `notFoundMessage`.

## Auth

A 15-minute JWT access token in memory, plus an HttpOnly refresh cookie the
browser handles itself. `AuthContext`:

- decodes the token's `exp` and schedules a **proactive** refresh 60 seconds
  before expiry, so a long-lived tab doesn't discover its session died only
  when the user clicks something;
- registers a global 401 handler with `lib/http.js`, so a 401 seen by *any*
  feature's `api.js` clears the dead session and lets `ProtectedRoute`
  redirect.

That second piece exists because contexts like Wishlist and Alert swallow
fetch errors non-fatally. Without a global hook, an expired session left the
app rendering a protected page with empty data instead of bouncing to a
public view.

The SSE stream is the one place the token travels as a query parameter
(`/notifications/stream?token=…`) — `EventSource` cannot set request headers.

## The admin catalog surface

`/admin` is full CRUD over the curated catalog behind category browsing:
create, edit, publish/hide, delete, filter by category, paginate.

**The admin key is typed in at runtime and held in `sessionStorage` — it is
deliberately not a `VITE_` variable.** The backend gates
`/api/admin/products/*` on a single shared secret (`ADMIN_API_KEY`, sent as
`x-admin-key`): the same secret for everyone, no per-admin account, no
expiry, no revocation short of editing the server's `.env`. A
`VITE_ADMIN_KEY` would be inlined into the bundle every anonymous visitor
downloads, publishing the master credential for the whole catalog. The cost
of the runtime prompt is retyping the key after closing the tab, which is the
right trade for a shared secret that never expires.

The gate verifies the key against the API before rendering anything, and
distinguishes the two failure modes: `401` means the key is wrong, `500`
means the server has no `ADMIN_API_KEY` set at all (the middleware fails
closed).

One subtlety in `lib/http.js`: admin calls pass
`skipUnauthorizedHandler: true`. Admin auth and user auth are separate
schemes, so a rejected admin key must **not** fire the global 401 handler —
otherwise mistyping an admin secret would log the signed-in shopper out of
the app.

## Category browsing

Three screens over the backend's admin-curated catalog:

1. **`/categories`** reads `GET /api/categories`. The grid is a view over
   real data, not a hardcoded list, so a category an admin creates appears on
   its own. `pages/categories/categoryCatalog.js` supplies an icon and tint
   per known category name but no longer decides *what exists* — an
   unrecognised name gets a fallback icon and a deterministic tint rather
   than going missing.

2. **`/categories/:category`** renders `CatalogCard`, not the shared
   `ProductCard`. A catalog entry has no marketplace, rating, stock or
   product URL — running it through `ProductCard` produced a grid of "No
   ratings yet" and dead links. Its price is labelled *indicative*, because
   it's the admin's reference figure, not a live listing.

3. **`/categories/:category/:id`** is the click-through. The entry has no
   listing behind it, so opening one triggers a genuine live
   multi-marketplace search — seconds, not milliseconds, hence a skeleton
   grid and copy that says what's happening. `marketplaceFailures` is
   surfaced in a banner: one store erroring shouldn't look like total
   failure.

The sort dropdown on screen 2 offers only **Newest / Price ↑ / Price ↓**.
`rating` is a valid `sortBy` value for that route, but a catalog entry has no
rating field, so the backend silently falls back to newest-first — shipping
the option would be a control that looks like it works and doesn't. Screen 3,
where results are real marketplace products with real ratings, does offer it.

## Known gaps

**The click-through doesn't yet read `result.comparison`.** The backend's
`GET /categories/:category/products/:id` now returns both `listings` and
`comparison`, exactly one populated depending on whether the admin gave the
entry a `url`:

- no `url` → live title search, `listings` populated, `comparison: null`
- `url` set → the real compare-url pipeline, `comparison` populated,
  `listings: null`

`CatalogProductPage.jsx` currently reads only `listings`, so an entry with a
`url` renders the empty state instead of its comparison. Every one of the 90
seeded entries is url-less, so nothing is broken today — but the admin form
has no `url` field yet, and the page won't handle one until both are wired.

**`platform` doesn't filter.** The backend accepts and records it but always
searches every marketplace, which is why search has no marketplace filter
chips — they'd change nothing.

**Description and image can't be cleared.** The backend's `PATCH` schema
types them as non-empty strings, so the admin form can overwrite either but
not erase it back to empty.
