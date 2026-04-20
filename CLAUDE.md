# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FINEX PRO is a single-page marketing website for a printing and visual communication company based in Lomé, Togo. The site is in French and serves as a landing page driving leads via WhatsApp.

## Stack

Pure vanilla HTML/CSS/JS — no build tools, no package manager, no framework. Served via WAMP (local Apache). Open `index.html` directly in a browser or visit `http://localhost/HTML projects/finex-printing-platform/`.

## File Structure

- `index.html` — entire page structure (single file, all sections inline)
- `style.css` — all styles; uses CSS custom properties defined in `:root`
- `script.js` — all interactivity (no external JS libraries)
- `assets/images/` — logo and portfolio images

## Architecture

### CSS Design Tokens (`style.css` `:root`)
All colors, spacing, shadows, and transitions are defined as CSS variables. Primary palette: `--blue` (`rgb(20,164,255)`), `--blue-deep` (`rgb(0,0,255)`), `--blue-dark` (`#0a0f2e`). Always use these tokens rather than raw values.

### Page Sections (in order)
`#home` hero → `#services` → why-us → `#portfolio` → testimonials → partners ticker → `#about` → CTA → `#contact` → footer

### JS Interaction Patterns (`script.js`)
- **Reveal animations**: Elements with class `.reveal` animate in via `IntersectionObserver`/scroll; add `.visible` to trigger. Use `data-delay="100|200|300"` for stagger.
- **Contact form**: Submits by opening a WhatsApp deep-link (`wa.me/22897511723`) with a pre-filled message — there is no backend.
- **Portfolio filter**: `data-category` attribute on `.portfolio-item` elements drives the filter buttons.
- **Hero text rotator**: Cycles through the `words` array in `script.js:80` every 2.4 s.

### WhatsApp Number
`+228 97 51 17 23` (`22897511723`) — appears in many href attributes throughout `index.html`. Update all occurrences if the number changes.

### Fonts
`Syne` (headings, buttons) and `DM Sans` (body) loaded from Google Fonts.
