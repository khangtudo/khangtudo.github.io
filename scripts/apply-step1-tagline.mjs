import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. In CSS, add styling for flag SVG images and enlarged brand tagline
const cssAddition = `
    /* Flag SVG Twemoji cross-platform styling */
    .flag-img {
      width: 22px;
      height: 16px;
      object-fit: contain;
      border-radius: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      vertical-align: middle;
      display: inline-block;
    }
    .flag-btn .flag-img {
      width: 24px;
      height: 18px;
    }
    .brand-title-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .brand-main-title {
      font-size: clamp(1.2rem, 3.5vw, 1.55rem);
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      line-height: 1.1;
    }
    .brand-main-title span { color: var(--primary); }
    .brand-tagline-prominent {
      font-size: clamp(0.72rem, 1.8vw, 0.85rem);
      font-weight: 700;
      letter-spacing: 1px;
      color: var(--primary);
      text-transform: uppercase;
      white-space: nowrap;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 2px 8px;
      border-radius: 6px;
      width: fit-content;
      margin-top: 2px;
    }
`;

// Insert CSS before </style>
html = html.replace('</style>', `${cssAddition}\n</style>`);

// 2. Replace the brand-group HTML in utility-header
const oldBrandGroup = `<a href="#" class="brand-group" aria-label="inid.me Home">
        <img src="assets/logo.svg" alt="inid.me">
      </a>`;

const newBrandGroup = `<a href="#" class="brand-group" aria-label="inid.me Home">
        <div class="brand-title-wrap">
          <div class="brand-main-title">inid<span>.me</span></div>
          <div class="brand-tagline-prominent">Smart AR Card • Offline QR</div>
        </div>
      </a>`;

if (html.includes(oldBrandGroup)) {
  html = html.replace(oldBrandGroup, newBrandGroup);
  console.log('✅ Replaced brand-group in header with prominent tagline!');
} else {
  console.error('oldBrandGroup not found!');
}

fs.writeFileSync(p, html, 'utf8');
console.log('Done step 1!');
