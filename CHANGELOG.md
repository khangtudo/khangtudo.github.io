# Changelog

All notable release milestones for **inid.me** are recorded here.

## [v1.0.0-spatial] — 2026-09-12

**Release status:** GOAL MET  
**Release commit:** [`97ef47f`](https://github.com/khangtudo/khangtudo.github.io/commit/97ef47f)  
**Git tag:** [`v1.0.0-spatial`](https://github.com/khangtudo/khangtudo.github.io/releases/tag/v1.0.0-spatial)  
**Production:** <https://inid.me/>

### Spatial one-page experience

- Released a zero-document-scroll `100dvh` card canvas for desktop and mobile.
- Consolidated the former viewer and editor flow into Card Mode plus responsive EditSheet and QR overlays.
- Locked the final Card Stage interactions: direct flip control below the card, in-card portrait/landscape control and two-sided spatial presentation.

### Brand and hierarchy

- Released the Header Brand Lockup: 30×30 SVG Spatial Card icon, white `inid`, cyan `.me`, and separate **SMART AR CARD • OFFLINE QR** badge.
- Finalized direct Action Dock controls: **Lưu Danh Bạ**, **Xem AR Card**, **Xem QR Offline**. Removed the displaced More popup route.

### Personalization and offline workflows

- Added Gravatar-style dynamic social link manager for 12 services: Facebook, Zalo, Instagram, LinkedIn, YouTube, TikTok, WhatsApp, LINE, X/Twitter, Threads, GitHub and Website.
- Added offline vCard QR generation and `.vcf` export.
- Added NFC helper flow: clipboard vCard copy, conditional Web NFC NDEF write, and TXT fallback download.

### Content and directions

- Set released profile data for **Phan Mạnh Khang**, **CGO – Giám Đốc Tăng Trưởng**, Minh Tam Prolab.
- Set slogan to **Professional Digital Laboratory Since 1993**.
- Linked the address directly to Google Maps: <https://maps.app.goo.gl/o9mcM5eqe9qPH7f1A>.

### Accessibility and resilience

- Added focus handling, modal focus trapping/restoration, keyboard card/menu operation, ARIA byte gauge and reduced-motion support.
- Kept the language catalogue inline to avoid dependency/cache lag in production.

### Known platform condition

Web NFC direct writing is conditional on compatible hardware, browser and user permission. All non-Web-NFC paths must communicate clipboard copy or downloaded fallback accurately; validate physical NFC writing on Android Chrome and a compatible tag.

## Documentation

- [Design System contract](./DESIGN.md)
