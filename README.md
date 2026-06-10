# Convene — Event Management UI

A calm, modern event-management dashboard built in **plain HTML + CSS** (with a
sprinkle of vanilla JS), styled in the clean, generous-whitespace aesthetic
showcased on [refero.design](https://refero.design).

## What's inside

- **`index.html`** — full dashboard markup: sidebar nav, top bar with search,
  KPI stat cards, an upcoming-events list, today's schedule timeline, and an
  activity feed.
- **`styles.css`** — the design system: warm neutral surfaces, an indigo
  accent, Inter + Fraunces type pairing, soft shadows, rounded cards, and a
  responsive layout (sidebar collapses to a drawer on mobile).
- **`app.js`** — light interactions: event-type filtering, the mobile sidebar
  toggle, segmented time-range switching, and `⌘K` / `Ctrl+K` to focus search.

## Run it

No build step. Just open the file:

```bash
open index.html          # macOS
# or serve it
python3 -m http.server   # then visit http://localhost:8000
```

## Design notes

- **Palette** — warm off-white canvas (`#f6f5f2`), white surfaces, indigo
  accent, with green/rose/amber accents for status.
- **Type** — Inter for UI text, Fraunces for display headings and figures.
- **Motion** — subtle lift-on-hover for cards using an ease-out curve.
- Avatar images load from `pravatar.cc`; swap for real assets in production.
