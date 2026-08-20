# Personal Portfolio — sreeabiram

Static single-page portfolio deployed to GitHub Pages at `Abiram116.github.io`.
No build step, no framework, no dependencies: `index.html` + `assets/css/style.css`
+ `assets/js/script.js`. Serve locally with `./run_all.sh` (default port 8123).

Every change to this site must be checked against the design handbook below.

---

## Design handbook (Ran Segall / Flux Academy)

**Goal:** a portfolio's job is to build *trust* and *preference* so people want to
hire me. Everything on the page must serve that. If a section doesn't build trust
or preference, it doesn't belong.

### The 15-second test

A visitor must be able to answer three questions without scrolling:

1. **Whose site is this?** — name/logo, top-left.
2. **What do they do?** — the role, stated or clearly implied.
3. **Why should I care?** — the value proposition.

### Home page structure (in this order)

1. **Hero** — name/logo, role, value-prop headline, one clear CTA button.
   Must be fully visible without scrolling.
2. **Trust-building** — social proof: testimonials, company/institution logos,
   awards, numbers (years, projects shipped). With no client work yet, get
   creative — a quote from a professor or past manager, a university or
   certification logo, anything that signals credibility.
3. **Why work with me** — services/process and what makes me different.
   State a clear, even bold, point of view.
4. **The work** — curate **4–6 best projects** (2–4 is fine when starting out),
   not everything ever made. Quality > quantity > "real client work."
   Thumbnails must be *designed* — proper mockups, never raw screenshots.
   Each links to a full case study. Mind context (show apps in device mockups),
   focus (don't clutter), and art direction (one consistent style).
5. **About** — a real photo, personality, what I'm like to work with. People hire
   people. Naming specific interests helps attract the right kind of employer.
6. **Call to action** — always close with a clear next step (contact button,
   email, booking link). Never leave a visitor at a dead end.

### Case study pages

- **Lead with the bottom line** — final result first, process after.
- Structure: **Hero (final design) → Project description (client, problem, my
  role) → Process → Outcomes.**
- Keep it skimmable: short sections, clear headers, 1–2 paragraphs max per
  section. People skim; they don't read essays.
- Explain the **problem solved**, not "made it pretty" — critical for UX/product
  work where visuals alone don't prove value.

### Copy and language

Write for the target audience (AI engineering hiring managers and recruiters),
not a generic default. Match their vocabulary.

---

## Checklist — verify before shipping any change

- [ ] Clear name/logo in the nav
- [ ] Clear value prop in the hero
- [ ] Easy-to-find contact button
- [ ] Photo and intro of me
- [ ] Some form of social proof
- [ ] ~4 curated best projects (not a dump of everything)
- [ ] Mobile responsive
- [ ] Scannable homepage — no unnecessary clicks to learn who I am / what I do
- [ ] Professional mockups, not raw screenshots
- [ ] Own domain

---

## Current gaps against the handbook

Known deviations, kept here so they aren't rediscovered each session:

- **No trust/social-proof section.** AWS certs and the LogIQids rank exist but sit
  buried in Toolkit and Milestones instead of a dedicated proof block near the top.
- **No photo of me.** "Off the clock" is rich on personality but has no face.
- **No "why work with me"** section stating a point of view.
- **No case studies.** Projects link straight to GitHub; Jignasa in particular
  deserves a problem → process → outcome page.
- **Project thumbnails are absent** — cards are text-only, no mockups.
- **No résumé/CV download.**
- **No Open Graph / Twitter card tags** — bare link previews on LinkedIn.
- **Own domain** — currently `Abiram116.github.io`.

## Conventions

- Palette and type live in `:root` in `style.css`; reuse those custom properties
  rather than hard-coding colours.
- The sky → cobalt → coral tri-stripe is the recurring brand motif (top bar,
  nav hover underline, feature-card top edge). Keep it consistent.
- Preserve accessibility: real `alt` text, `aria-hidden` on decorative elements,
  `:focus-visible` outlines, and the `prefers-reduced-motion` block that disables
  every animation.
- Add explicit `width`/`height` to new images to avoid layout shift.
