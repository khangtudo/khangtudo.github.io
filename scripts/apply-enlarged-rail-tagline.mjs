import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. In identity-rail (Desktop Left): Change Logo to only icon and large prominent text
const oldIdentityLogo = `<div class="big-logo">
          <img src="assets/logo.svg" alt="inid.me logo" style="height:90px; width:auto;">
        </div>`;

const newIdentityLogo = `<div class="big-logo">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="56" height="56" fill="none">
              <defs>
                <linearGradient id="id-rail-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8" />
                  <stop offset="100%" stop-color="#3b82f6" />
                </linearGradient>
                <linearGradient id="id-rail-card" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#1e293b" />
                  <stop offset="100%" stop-color="#0f172a" />
                </linearGradient>
              </defs>
              <rect x="26" y="12" width="54" height="74" rx="10" fill="none" stroke="url(#id-rail-grad)" stroke-width="3" opacity="0.4" transform="rotate(12 53 49)"/>
              <rect x="18" y="12" width="54" height="74" rx="10" fill="url(#id-rail-card)" stroke="url(#id-rail-grad)" stroke-width="3"/>
              <rect x="28" y="24" width="14" height="14" rx="3" fill="#38bdf8"/>
              <circle cx="58" cy="31" r="4" fill="#60a5fa"/>
              <line x1="28" y1="52" x2="62" y2="52" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
              <line x1="28" y1="62" x2="52" y2="62" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="58" cy="72" r="5" fill="#38bdf8"/>
            </svg>
            <div style="font-size:2.2rem; font-weight:900; color:#fff; letter-spacing:-1px; line-height:1;">inid<span style="color:#38bdf8;">.me</span></div>
          </div>
          <div style="font-size:0.92rem; font-weight:700; color:#38bdf8; letter-spacing:1px; text-transform:uppercase; background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3); padding:4px 12px; border-radius:8px; width:fit-content; margin-bottom:14px;">
            Smart AR Card • Offline QR
          </div>
        </div>`;

if (html.includes(oldIdentityLogo)) {
  html = html.replace(oldIdentityLogo, newIdentityLogo);
  console.log('✅ Replaced identity-rail logo with large vector icon and separate bold tagline!');
} else {
  console.error('oldIdentityLogo not found!');
}

fs.writeFileSync(p, html, 'utf8');
