# AirDeck Canonical Design System Specification

> **Version:** 2.1.0 (Obsidian & Champagne / Alabaster & Ink Standard)  
> **Status:** Canonical Production UI Standard  
> **Aesthetic Archetype:** Architectural, High-Density Commercial Signage Infrastructure (Dieter Rams "Less, but better" & Enterprise Hardware Console)  
> **Core Theme Strategy:** Dual-Theme (True Neutral Obsidian & Warm Alabaster) with Hairline Precision  

---

## 1. Aesthetic Direction & Architectural Philosophy

AirDeck is an enterprise-grade digital signage and autonomous broadcast infrastructure. It is engineered with the tactile precision of broadcast studio equipment, commercial panel processors, and local flash memory caches.

### 1.1 Core Tenets & Prohibitions
1. **Strictly NO Blue/Slate Undertones (True Neutral Obsidian):**
   - **FORBIDDEN:** Zero `slate-*` classes, zero `gray-*` classes, zero `blue-*` classes, and zero `#0f172a` / `#020617` tints anywhere in the codebase.
   - All dark backgrounds must be pure neutral obsidian (`#0A0A0B` page ground, `#111113` surface cards, `#161618` recessed wells).
2. **Hairline Precision over Shadows:**
   - Crisp `1px solid` hairline borders (`#222225` in dark mode, `#E2E0D8` in light mode).
   - Zero diffuse drop shadows, zero ambient neon glows, zero purple/cyan gradients, and zero AI tropes.
3. **High-Contrast Monochromatic & Champagne Telemetry:**
   - Dark Mode Primary Buttons: `#D4AF37` (Champagne Gold) with `#0A0A0B` dark text.
   - Light Mode Primary Buttons: `#141413` (Architectural Ink) with `#F6F5F0` light text.
   - Light Mode Secondary Buttons: `#FFFFFF` with `1px solid #E2E0D8` border and `#141413` text.
4. **Information Density & Technical Hierarchy:**
   - Tight headings (`Inter font-bold tracking-tight`) paired with tabular telemetry (`JetBrains Mono tabular-nums`).
5. **Universal Brand Navigation:**
   - Clicking the AirDeck logo in the top bar (public landing, login, or authenticated console) **must always navigate to `/`** (`cursor-pointer`).

---

## 2. Color Tokens (Dual Theme)

### 2.1 Dark Theme — "Obsidian & Champagne" (Default)

| Token Name | Hex Code | Purpose & Application |
| :--- | :--- | :--- |
| **Canvas Background** | `#0A0A0B` | True neutral obsidian canvas, zero blue undertones |
| **Surface Card** | `#111113` | Elevated cards, header chassis, modal containers, empty state boxes |
| **Recessed Well** | `#161618` | Recessed inputs, code blocks, spec containers |
| **Hairline Border** | `#222225` | Standard 1px solid structural hairline dividers |
| **Hairline Hover** | `#343438` | Interactive card and button hover state |
| **Brand Accent (Champagne)** | `#D4AF37` | Step numbers, spec eyebrows, active node highlights |
| **Primary Action Button** | `#D4AF37` bg / `#0A0A0B` text | High-contrast Champagne CTA (`+ Pair New Display`, `Open Studio Console →`, `Open Studio →`) |
| **Secondary Button** | Transparent / `#222225` border | Clean secondary action (`Launch Display Receiver`, `Cancel`) |
| **Primary Text** | `#F4F4F5` | Headings, active values, modal titles |
| **Secondary Text** | `#8E8E93` | Supporting descriptions, subtitle labels |
| **Muted Metadata** | `#52525B` | Telemetry specs, timestamps, hardware status |
| **Status: Online** | `#10B981` | Emerald indicator (`ACTIVE`, `IN SYNC`, `Flash Ready`) |
| **Status: Offline** | `#F59E0B` | Amber indicator for local flash cache or offline state |
| **Emergency Override** | `#DC2626` / `#EF4444` | Red warning pill, urgent fleet broadcast modal |

### 2.2 Light Theme — "Alabaster & Ink"

| Token Name | Hex Code | Purpose & Application |
| :--- | :--- | :--- |
| **Canvas Background** | `#F6F5F0` | Warm limestone/alabaster matte drafting canvas |
| **Surface Card** | `#FFFFFF` | Crisp white elevated cards, headers, dialogs |
| **Recessed Well** | `#EFECE6` | Recessed telemetry wells, spec boxes, inputs |
| **Hairline Border** | `#E2E0D8` | Structural hairline dividers (1px solid) |
| **Hairline Hover** | `#C8C5BA` | Interactive hover state |
| **Brand Accent** | `#9A7B2C` | Warm architectural gold for eyebrows and badges |
| **Primary Action Button** | `#141413` bg / `#F6F5F0` text | High-contrast Architectural Ink CTA |
| **Secondary Action Button** | `#FFFFFF` bg / `#E2E0D8` border | Crisp legible secondary button with `#141413` text |
| **Primary Text** | `#141413` | Deep architectural ink for headings and titles |
| **Secondary Text** | `#5C5B57` | Supporting interface descriptions |
| **Muted Metadata** | `#8F8D86` | Secondary specs, timestamps |
| **Status: Online** | `#059669` | Emerald indicator |
| **Status: Offline** | `#D97706` | Amber indicator |
| **Emergency Override** | `#B91C1C` | Red warning pill and action |

---

## 3. Root Theme-Switching Contract

To ensure the root wrapper and `document.documentElement` dynamically switch ALL background, surface, border, and text colors cleanly without breaking contrast:

1. **CSS Variables Defined at Root (`src/index.css`):**
   - `:root, html.dark, body.dark` declare `--bg-page: #0A0A0B`, `--bg-surface: #111113`, `--border-hairline: #222225`, `--text-primary: #F4F4F5`, `--btn-primary-bg: #D4AF37`, etc.
   - `html.light, body.light` declare `--bg-page: #F6F5F0`, `--bg-surface: #FFFFFF`, `--border-hairline: #E2E0D8`, `--text-primary: #141413`, `--btn-primary-bg: #141413`, `--btn-secondary-bg: #FFFFFF`, etc.
2. **Body Reset in `index.html`:**
   - `<body>` must never have hardcoded dark background utility classes like `class="bg-[#0A0A0B]"`.
   - `body` style is governed by `background-color: var(--bg-page); color: var(--text-primary); transition: background-color 150ms ease, color 150ms ease;`.
3. **ThemeContext Synchronization:**
   - `ThemeContext` toggles both `document.documentElement.classList` and `document.body.classList` (`dark` vs `light`), guaranteeing immediate synchronous updates across all DOM subtrees.
4. **Icon-Only Theme Toggle (`36px × 36px`):**
   - Square button (`.theme-toggle-btn`) with 1px border.
   - Dark Mode: Renders a crisp Sun icon (`#D4AF37`) on `#111113` surface.
   - Light Mode: Renders a crisp Moon icon (`#141413`) on `#FFFFFF` surface.

---

## 4. Typography & Scale

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Inter             │ Display Headlines, Body & Controls   │
│ 2. JetBrains Mono    │ Telemetry, Code PINs, Spec Labels    │
└─────────────────────────────────────────────────────────────┘
```

* **Hero Headline:** `font-bold tracking-tight text-4xl sm:text-6xl leading-tight text-primary-token`
* **Eyebrows:** `font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-brand-accent font-semibold`
* **Section Headers:** `font-semibold text-base sm:text-lg tracking-tight text-primary-token`
* **Body / Subtitles:** `text-xs sm:text-sm text-secondary-token leading-relaxed font-sans`
* **Telemetry & Specs:** `font-mono text-[11px] tabular-nums tracking-wider text-secondary-token`
* **Pairing PINs:** `font-mono font-bold tracking-[0.22em] tabular-nums text-sm sm:text-base`

---

## 5. Geometry & Component Rules

1. **Sharp Architectural Corners:**
   - `rounded` (`4px`) for buttons, inputs, pills, timecode badges.
   - `rounded-md` (`6px`) for cards, empty state boxes, dialogs.
   - `rounded-lg` (`8px`) max for outer 16:9 monitor frames.
   - **PROHIBITED:** Never use `rounded-2xl`, `rounded-3xl`, or pill cards.
2. **AirDeck Logo Navigation:**
   - Both public and authenticated navigation headers wrap the geometric AirDeck square chassis and wordmark in `<Link to="/" className="cursor-pointer">`.
3. **Brand Logo Mark & Favicon:**
   - Preserved unmodified (geometric square chassis with inner `Cast` icon; favicon SVG `%236366f1`).
