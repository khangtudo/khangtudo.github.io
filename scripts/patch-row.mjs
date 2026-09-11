import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

const oldStructure = `    <!-- Utility Header -->
    <header class="utility-header">
      <a href="#" class="brand-group" aria-label="inid.me Home">
        <img src="assets/logo.svg" alt="inid.me">
      </a>
      <div class="header-actions">
        <button class="btn-create-sheet" id="btnOpenEdit" aria-haspopup="dialog" aria-expanded="false" aria-controls="editSheet">
          <span>✨</span> <span id="txtCreateNew">+ Tạo mới</span>
        </button>
        <div class="flag-wrap">
          <button class="flag-btn" id="flagBtn" aria-haspopup="true" aria-expanded="false" aria-controls="flagMenu" aria-label="Chọn ngôn ngữ">
            <span id="currentFlag">🇻🇳</span> <span style="font-size:0.65rem; opacity:0.6;">▼</span>
          </button>
          <div class="flag-menu" id="flagMenu" role="menu"></div>
        </div>
      </div>
    </header>

    <!-- Desktop Identity Rail (Hidden on Mobile) -->
    <aside class="identity-rail">
      <div class="big-logo">
        <img src="assets/logo.svg" alt="inid.me logo" style="height:110px; width:auto;">
      </div>
      <div class="badge-chip">⚡ SPATIAL AR VCARD</div>
      <p id="txtHeroSlogan" style="font-size:1.05rem; font-weight:500; color:#cbd5e1; line-height:1.6;">
        Smart AR VCard & Offline QR.<br>
        <span style="font-size:0.88rem; color:var(--muted);">Một chạm lưu danh bạ không mạng, mở rộng không gian 3D AR đa chiều.</span>
      </p>
    </aside>

    <!-- Center Card Stage -->
    <main class="card-stage">`;

const newStructure = `    <!-- Utility Header -->
    <header class="utility-header">
      <a href="#" class="brand-group" aria-label="inid.me Home">
        <img src="assets/logo.svg" alt="inid.me">
      </a>
      <div class="header-actions">
        <button class="btn-create-sheet" id="btnOpenEdit" aria-haspopup="dialog" aria-expanded="false" aria-controls="editSheet">
          <span>✨</span> <span id="txtCreateNew">+ Tạo mới</span>
        </button>
        <div class="flag-wrap">
          <button class="flag-btn" id="flagBtn" aria-haspopup="true" aria-expanded="false" aria-controls="flagMenu" aria-label="Chọn ngôn ngữ">
            <span id="currentFlag">🇻🇳</span> <span style="font-size:0.65rem; opacity:0.6;">▼</span>
          </button>
          <div class="flag-menu" id="flagMenu" role="menu"></div>
        </div>
      </div>
    </header>

    <!-- Main Canvas Row: Desktop Left Rail + Center Card Stage -->
    <div class="main-canvas-row">
      <!-- Desktop Identity Rail (Hidden on Mobile) -->
      <aside class="identity-rail">
        <div class="big-logo">
          <img src="assets/logo.svg" alt="inid.me logo" style="height:90px; width:auto;">
        </div>
        <div class="badge-chip">⚡ SPATIAL AR VCARD</div>
        <p id="txtHeroSlogan" style="font-size:1.05rem; font-weight:500; color:#cbd5e1; line-height:1.6;">
          Smart AR VCard & Offline QR.<br>
          <span style="font-size:0.88rem; color:var(--muted);">Một chạm lưu danh bạ không mạng, mở rộng không gian 3D AR đa chiều.</span>
        </p>
      </aside>

      <!-- Center Card Stage -->
      <main class="card-stage">`;

const oldCloseMain = `      <!-- Nút Chạm để lật thẻ nằm ngay bên dưới thẻ -->
      <div class="flip-hint-wrap">
        <button type="button" class="btn-flip-below" id="btnFlipBelow" aria-label="Chạm để lật thẻ 3D">
          <span>🔄</span> <span id="txtFlipBelow">Chạm để lật thẻ 3D</span>
        </button>
      </div>
    </main>

  <!-- Action Dock: 3 Main Direct Buttons (Save VCF | View AR | View QR Offline) -->`;

const newCloseMain = `      <!-- Nút Chạm để lật thẻ nằm ngay bên dưới thẻ -->
      <div class="flip-hint-wrap">
        <button type="button" class="btn-flip-below" id="btnFlipBelow" aria-label="Chạm để lật thẻ 3D">
          <span>🔄</span> <span id="txtFlipBelow">Chạm để lật thẻ 3D</span>
        </button>
      </div>
      </main>
    </div>

  <!-- Action Dock: 3 Main Direct Buttons (Save VCF | View AR | View QR Offline) -->`;

html = html.replace(oldStructure, newStructure);
html = html.replace(oldCloseMain, newCloseMain);

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Wrapped main-canvas-row successfully!');
