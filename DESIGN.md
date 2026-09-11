# inid.me Design System — Spatial v1.0.0

**Status:** Release contract for `v1.0.0-spatial`  
**Product:** One-page Smart AR Business Card  
**Production:** <https://inid.me/>

This document is the visual and interaction source of truth for the released spatial card experience. It records the intended design system—not a promise that every browser exposes hardware-specific capabilities.

---

## 1. Product principles

1. **One focused canvas.** Card Mode fits inside `100dvh`; the page itself must not scroll. Editing and QR are overlays with their own internal scroll where necessary.
2. **The card is the hero.** Brand context, card stage and the three most important actions are visible without navigating between pages.
3. **Progressive disclosure.** Creation/editing, QR generation and extended social links do not compete with the primary card view.
4. **Spatial but calm.** Depth and motion communicate the physical card; they must never compromise orientation, text legibility or accessibility.

---

## 2. Token architecture

### 2.1 Primitive tokens

| Group | Token | Value | Purpose |
|---|---|---:|---|
| Color | `--blue-400` | `#38bdf8` | Cyan brand / interactive highlight |
| Color | `--blue-500` | `#3b82f6` | Supporting gradient blue |
| Color | `--slate-950` | `#070a12` | Spatial canvas |
| Color | `--slate-900` | `#0f172a` | Card / deep surface |
| Color | `--white` | `#ffffff` | Primary brand text |
| Color | `--slate-300` | `#cbd5e1` | Supporting text |
| Radius | `--radius-sm` | `8px` | Fields / compact controls |
| Radius | `--radius-md` | `12px` | Buttons |
| Radius | `--radius-lg` | `20px` | Sheets / QR card |
| Space | `--space-1…6` | `4, 8, 12, 16, 24, 32px` | Only permitted spacing rhythm |
| Motion | `--ease-spatial` | `cubic-bezier(.16,1,.3,1)` | Sheet/card physical motion |

### 2.2 Semantic tokens

```css
:root {
  --canvas: #070a12;
  --surface: #0f172a;
  --surface-raised: #0d1320;
  --text-primary: #ffffff;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --brand: #38bdf8;
  --brand-hover: #7dd3fc;
  --border-subtle: rgba(56, 189, 248, .30);
  --badge-fill: rgba(56, 189, 248, .12);
  --focus-ring: #7dd3fc;
  --success: #10b981;
  --danger: #ef4444;
}
```

### 2.3 Component tokens

| Component | Required token use |
|---|---|
| Header tagline badge | `--badge-fill`, `--border-subtle`, `--brand`; 8px radius |
| Primary dock CTA | `--brand` fill, dark label, visible focus ring |
| Secondary dock CTA | translucent deep surface + subtle border |
| Edit Sheet | `--surface-raised`, 20px top radius on mobile, 420px desktop rail |
| Card | dark surface / cyan edge light; preserve 3D transform layer |
| Social circle | official service color only; neutral fallback for Website |

---

## 3. Layout contract

### 3.1 Header brand lockup

At upper-left, lock these elements as one unit in this order:

1. **3D Spatial Card SVG**, exactly **30×30px**.
2. Wordmark: `inid` in pure white (`#ffffff`) followed by `.me` in cyan (`#38bdf8`).
3. A separate tagline badge directly below: **`SMART AR CARD • OFFLINE QR`**. It uses cyan text, `rgba(56,189,248,.12)` fill, cyan-alpha border and an 8px radius.

The tagline is supporting brand context—not a substitute for the wordmark and not a clickable primary control.

### 3.2 One-page spatial shell

- Base shell: `100svh` fallback then `100dvh`, `overflow: hidden` / no document scroll.
- **Desktop ≥1024px:** utility header; left identity rail; centered Card Stage; right-side vertical Action Dock.
- **Mobile 360–430px:** compact utility header; centered Card Stage; three equal dock actions at bottom. Preserve safe-area padding.
- **Editor:** 420px right drawer on desktop; bottom sheet on mobile. Form body may scroll internally. Footer save action remains visible above the keyboard.
- **QR:** modal surface only on demand, never persistent in Card Mode.

### 3.3 Card Stage

- The card is the visual focal plane and maintains 3D front/back flip behaviour.
- **Flip control:** independent pill button immediately below the physical card stage; card tap and Enter/Space remain equivalent alternatives.
- **Orientation control:** `Đổi Dọc/Ngang` is embedded at the inner lower-right card corner on both faces—not in a global overflow menu.
- Use a compact content variant under short mobile heights; prioritize identity, three contact methods and a capped social row over scaling text below readability.

### 3.4 Action Dock

Exactly three direct actions; no `More` or detached popup menu:

| Order | Action | Function | Hierarchy |
|---:|---|---|---|
| 1 | **Lưu Danh Bạ** | Export `.vcf` | Primary cyan CTA |
| 2 | **Xem AR Card** | Launch AR Quick Look / Scene Viewer / WebXR flow | Secondary |
| 3 | **Xem QR Offline** | Open offline-vCard QR modal | Secondary |

On mobile, each touch target is at least 44px high. On desktop, these controls stack vertically in the right rail and retain clear labels.

---

## 4. Dynamic Socials — Gravatar pattern

The EditSheet offers a compact dynamic row manager, rather than a fixed list of empty social fields.

1. Choose one service from a native picker: **Facebook, Zalo, Instagram, LinkedIn, YouTube, TikTok, WhatsApp, LINE, X/Twitter, Threads, GitHub, Website**.
2. Select **Thêm** to insert a row with official service icon, labelled URL/handle input and remove button.
3. Focus moves to the inserted input. Removing a row is instant and must use a meaningful accessible name: `Xóa liên kết <service>`.
4. On Save, handle-only values normalize to the service URL prefix; complete URLs remain intact.
5. The Card Stage renders the resulting services as compact circular links with accessible labels.

Do not present social icons as textless decorative graphics when they are links.

---

## 5. Contact and map content contract

| Field | Release value |
|---|---|
| Person | **Phan Mạnh Khang** |
| Role | **CGO – Giám Đốc Tăng Trưởng** |
| Organization | **Minh Tam Prolab** |
| Slogan | **Professional Digital Laboratory Since 1993** |
| Phone | `+84937550989` |
| Email | `manhkhang@minhtamprolab.com.vn` |
| Address | `40A-40B Lý Tự Trọng, Phường Sài Gòn, TPHCM` |
| Directions | `https://maps.app.goo.gl/o9mcM5eqe9qPH7f1A` |

The visible address is an accessible link to the exact Google Maps shortlink. Do not rely on a pin emoji alone to communicate that it is actionable.

---

## 6. Offline QR and NFC capability contract

- QR stores a vCard payload locally; it is designed to be scanned without network access.
- **Sao Chép Vào NFC / Copy To NFC** first tries to copy vCard UTF-8 text to Clipboard.
- On supported hardware/browser combinations it may invoke the **Web NFC API** to write an NDEF record (`text/vcard`).
- If direct NFC is not available, denied or cancelled, export `nfc-<name>.txt` as fallback.

**Truthful UI states are mandatory:** distinguish `Copied to clipboard`, `Written to NFC`, and `NFC file downloaded`. Web NFC must not be advertised as universally available; physical end-to-end verification belongs on Android Chrome with a compatible NFC tag.

---

## 7. Accessibility and interaction baseline

- Minimum target: 44×44px on touch devices; dock and persistent save CTA aim for 48px high.
- Keyboard: Card flip supports `Enter` / `Space`; menus use roving focus; overlays trap Tab/Shift+Tab, close with Escape, and restore trigger focus.
- Semantics: icon-only controls receive `aria-label`; menu controls expose `aria-expanded`, `aria-controls` and suitable popup roles; byte gauge has progressbar and live status semantics.
- Motion: respect `prefers-reduced-motion`; no 3D flip or sheet movement is required to understand a state.
- Keyboard overlay: respond to `visualViewport`; only sheet content scrolls on focused fields, never the base document.
- Contrast: normal text must target WCAG AA (4.5:1); non-text interaction outlines target 3:1.

---

## 8. Release acceptance matrix

| Scenario | Expected result |
|---|---|
| 360×640, 390×844 Card Mode | No document scroll; header/card/dock visible together |
| 1440×900 desktop | Center card, left identity rail, vertical right dock |
| New social link | Row appears, focus enters input, Save produces branded card icon |
| QR/NFC | QR opens; capability-specific completion message; fallback works |
| Reduced motion | Motion no longer communicates required information |
| Keyboard-only | Flip, language menu, EditSheet and QR modal are operable and focus-safe |
