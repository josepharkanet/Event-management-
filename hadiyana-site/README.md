# HADIYANA — Corporate / Marketing Website

A premium, static marketing site for **HADIYANA**, the AI-powered event-planning
platform with a built-in multi-vendor marketplace, built for the UAE.

Built per the PRD as a single long landing page in **pure HTML + CSS** with a
little vanilla JS for niceties. No framework, no build step, no backend.

> **Owner:** Arkanet Technologies LLC · **Built by:** Arkanet Technologies LLC

---

## Run it

No server required — just open the file:

```bash
open index.html          # macOS
xdg-open index.html      # Linux
# or double-click index.html in your file manager
```

To run it over a local server (handy for testing fonts / share links):

```bash
python3 -m http.server   # then visit http://localhost:8000
```

---

## File structure

```
hadiyana-site/
├── index.html            # the whole site, one semantic page
├── css/
│   ├── styles.css        # main styles + :root design tokens (PRD §2)
│   └── rtl.css           # RTL overrides, loaded by JS when lang=ar
├── js/
│   └── main.js           # nav, tabs, accordion, scroll-reveal, count-up,
│                         #   lang toggle, form validation
├── assets/
│   ├── img/              # image swap points (see below)
│   └── icons/            # icons are inline SVG in the HTML (no icon font)
└── README.md
```

---

## Where to swap images

The site ships **image-free** so it works fully offline — the hero "phone" and
all icons are inline SVG/CSS. There are two documented swap points:

1. **Hero visual** — `index.html`, the `.hero__visual` block (look for the
   `SWAP POINT` comment). Replace the SVG phone mockup with:
   ```html
   <img src="assets/img/hero.jpg" alt="HADIYANA event page on a phone, UAE setting" />
   ```
2. **Social share image** — drop a `1200×630` image at
   `assets/img/og-image.png` (already referenced by the Open Graph / Twitter
   meta tags in `<head>`).

A favicon placeholder is inlined as an SVG data-URI in `<head>`; replace with a
real `favicon.ico`/`.svg` when available.

---

## Wiring the lead form to a real backend

The contact form (`#leadForm`) is a **client-side-only stub**: it validates,
then shows a success state. It does not send anything.

To connect a real endpoint, in `index.html`:

```html
<form id="leadForm" action="https://your-endpoint.example/submit" method="post" ...>
```

…and in `js/main.js`, inside the `form.addEventListener("submit", …)` handler,
**remove the `e.preventDefault()` line** (or replace the success block with a
`fetch(form.action, { method: "POST", body: new FormData(form) })` call and
handle the response). The current `action="mailto:info@arkanet.ae"` is a
no-backend fallback.

---

## Bilingual / RTL (v1)

- Default is `<html lang="en" dir="ltr">`.
- The **EN / ع** toggle in the nav flips `lang`/`dir`, lazy-loads `css/rtl.css`,
  and swaps a **documented subset** of nav strings (the `AR_STRINGS` map in
  `main.js`) — this is the intentional v1 stub.
- The layout uses CSS **logical properties** throughout (`margin-inline`,
  `padding-inline`, `inset-inline`, `text-align: start`), so it mirrors cleanly
  in RTL; `rtl.css` only handles the few things that need an explicit flip
  (directional arrows, the mobile nav slide direction, Arabic letter-spacing).
- To go fully bilingual: add `data-i18n` keys to translatable nodes and expand
  the string map, or serve a separate `index.ar.html`.

---

## Notes & conventions

- **Design tokens** live in `:root` in `styles.css` (burgundy / champagne-gold /
  cream palette, serif + sans type stack). Change the brand there.
- **Accessibility**: semantic landmarks, one `<h1>`, keyboard-accessible tabs &
  accordion (`aria-expanded`, arrow keys), visible focus states, skip link,
  `prefers-reduced-motion` respected, AA-minded contrast.
- **SEO**: title, meta description, Open Graph + Twitter cards, favicon.
- This is a **marketing site**, not the product — no functional dashboards
  beyond the static hero mockup.
```
