# HADIYANA — Corporate / Marketing Website

A premium, **multi-page** static marketing site for **HADIYANA**, the AI-powered
event-planning platform with a built-in multi-vendor marketplace, built for the
UAE. Pure HTML + CSS with vanilla-JS niceties — no framework, no build step,
no backend.

> **Owner:** Arkanet Technologies LLC

---

## Pages

| Page               | Content                                                            |
|--------------------|--------------------------------------------------------------------|
| `index.html`       | Animated hero, marquee, problem→solution, pillars, lifecycle, stats, feature teaser, CTA |
| `features.html`    | 16 platform modules, AI co-pilot, 8 signature features, event types |
| `marketplace.html` | Services & products, vendor benefits, 8-step vendor onboarding (`#vendors`) |
| `investors.html`   | UAE opportunity stats, viral-growth mechanic, 8 revenue streams     |
| `about.html`       | Why HADIYANA, audience tabs (hosts/guests/vendors/admin), Arkanet   |
| `contact.html`     | Lead form (client-side validation), contact details, FAQ accordion  |

## Run it

No server required — just open `index.html` (all pages are linked).

```bash
python3 -m http.server   # optional: http://localhost:8000
```

---

## Structure

```
hadiyana-site/
├── index.html / features.html / marketplace.html /
│   investors.html / about.html / contact.html
├── css/
│   ├── styles.css        # shared styles + :root design tokens
│   └── rtl.css           # RTL overrides (lazy-loaded when lang=ar)
├── js/
│   └── main.js           # shared: nav, reveal, counters, tilt, tabs,
│                         #   accordion, lang toggle, form validation
├── assets/img|icons/     # swap points (see READMEs inside)
└── README.md
```

## Modern UI / animation inventory

- **Aurora heroes** — drifting blurred gradient blobs + film-grain overlay
- **Staggered entrance** (`.stagger`) and **scroll reveals** (`data-reveal`,
  `data-reveal-group` for per-child stagger)
- **Shimmering gradient text** (`.grad-text`)
- **Floating glass cards** + orbiting ring + floating phone mockup (home hero)
- **Marquee strip** of event types (pauses on hover)
- **3D tilt** on cards (`data-tilt`, pointer-fine devices only)
- **Count-up stats** (`data-countup`)
- **Scroll progress bar** + glass sticky header
- All motion respects `prefers-reduced-motion`.

## Swap points

1. **Hero visual** (`index.html`, `.hero__visual`) — replace the SVG phone
   mockup with `<img src="assets/img/hero.jpg" alt="…">`.
2. **Share image** — drop a 1200×630 `assets/img/og-image.png`.
3. **Favicon** — inline SVG data-URI in each `<head>`; replace when branded.

## Lead form → real backend

`contact.html` → `#leadForm` is a client-side stub (validates, shows success).
To wire a backend: set the form `action` to your endpoint and, in `js/main.js`,
replace the success block in the submit handler with a
`fetch(form.action, { method: "POST", body: new FormData(form) })` call.

## Bilingual / RTL (v1)

- The **EN / ع** toggle flips `lang`/`dir`, lazy-loads `css/rtl.css`, and swaps
  any element carrying a `data-ar="…"` attribute (nav links ship translated).
- Layout uses CSS logical properties throughout, so RTL mirrors cleanly;
  `rtl.css` only handles explicit flips (arrows, letter-spacing, fonts).
- To go fully bilingual: add `data-ar` to more nodes, or serve `*.ar.html`.

## Conventions

- Design tokens in `:root` (`css/styles.css`) — burgundy / champagne-gold /
  cream, Cormorant Garamond + Inter (+ Noto Naskh Arabic).
- Accessibility: landmarks, one `<h1>` per page, keyboard tabs & accordion,
  focus states, skip links, reduced-motion support.
- This is a **marketing site**, not the product.
