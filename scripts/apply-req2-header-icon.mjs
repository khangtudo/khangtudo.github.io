import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// The brand-group in header currently:
const oldHeaderBrand = `<a href="#" class="brand-group" aria-label="inid.me Home">
        <div class="brand-title-wrap">
          <div class="brand-main-title">inid<span>.me</span></div>
          <div class="brand-tagline-prominent">Smart AR Card • Offline QR</div>
        </div>
      </a>`;

// The icon SVG (32x32) + inid.me + prominent tagline box exactly as Papa's image
const newHeaderBrand = `<a href="#" class="brand-group" aria-label="inid.me Home" style="text-decoration:none;">
        <div class="brand-title-wrap">
          <div class="brand-main-title" style="display:flex; align-items:center; gap:8px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30" fill="none" style="flex-shrink:0;">
              <defs>
                <linearGradient id="hdr-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8" />
                  <stop offset="100%" stop-color="#3b82f6" />
                </linearGradient>
                <linearGradient id="hdr-logo-card" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1e293b" />
                  <stop offset="100%" stop-color="#0f172a" />
                </linearGradient>
              </defs>
              <rect x="26" y="12" width="54" height="74" rx="10" fill="none" stroke="url(#hdr-logo-grad)" stroke-width="3.5" opacity="0.45" transform="rotate(12 53 49)"/>
              <rect x="18" y="12" width="54" height="74" rx="10" fill="url(#hdr-logo-card)" stroke="url(#hdr-logo-grad)" stroke-width="3.5"/>
              <rect x="28" y="24" width="14" height="14" rx="3" fill="#38bdf8"/>
              <circle cx="58" cy="31" r="4" fill="#60a5fa"/>
              <line x1="28" y1="52" x2="62" y2="52" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
              <line x1="28" y1="62" x2="52" y2="62" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
              <circle cx="58" cy="72" r="5" fill="#38bdf8"/>
            </svg>
            <span>inid<span style="color:#38bdf8;">.me</span></span>
          </div>
          <div class="brand-tagline-prominent">SMART AR CARD • OFFLINE QR</div>
        </div>
      </a>`;

if (html.includes(oldHeaderBrand)) {
  html = html.replace(oldHeaderBrand, newHeaderBrand);
  console.log('✅ Updated header brand-group with SVG icon + prominent tagline matching image!');
} else {
  console.error('oldHeaderBrand not found!');
}

fs.writeFileSync(p, html, 'utf8');
