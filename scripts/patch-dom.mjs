import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Replace front face card-bottom
const oldFrontBottom = `<div class="card-bottom">
              <div class="social-icons-box" id="cardSocials" aria-label="Liên kết mạng xã hội"></div>
              <span class="flip-tag" id="txtFlipTag">Chạm lật 🔄</span>
            </div>`;

const newFrontBottom = `<div class="card-bottom">
              <div class="social-icons-box" id="cardSocials" aria-label="Liên kết mạng xã hội"></div>
              <button type="button" class="btn-toggle-orient-card" id="btnOrientInside" aria-label="Đổi hướng thẻ Dọc hoặc Ngang">
                <span>📐</span> <span id="txtOrientInside">Đổi Dọc/Ngang</span>
              </button>
            </div>`;

// 2. Replace back face bottom
const oldBackBottom = `<div style="font-size:0.72rem; color:var(--muted); text-align:center;">Chạm để lật thẻ 🔄</div>`;

const newBackBottom = `<div class="card-bottom" style="justify-content: flex-end;">
              <button type="button" class="btn-toggle-orient-card" id="btnOrientInsideBack" aria-label="Đổi hướng thẻ Dọc hoặc Ngang">
                <span>📐</span> <span>Đổi Dọc/Ngang</span>
              </button>
            </div>`;

// 3. Add dedicated flip button below card
const oldCardPerspectiveEnd = `</div>
      </div>
    </main>`;

const newCardPerspectiveEnd = `</div>
      </div>
      <!-- Nút Chạm để lật thẻ nằm ngay bên dưới thẻ -->
      <div class="flip-hint-wrap">
        <button type="button" class="btn-flip-below" id="btnFlipBelow" aria-label="Chạm để lật thẻ 3D">
          <span>🔄</span> <span id="txtFlipBelow">Chạm để lật thẻ 3D</span>
        </button>
      </div>
    </main>`;

// 4. Action Dock: 3 direct buttons (Save VCF | View AR | View QR Offline)
const oldDock = `<footer class="action-dock">
      <button class="dock-btn dock-btn-primary" id="btnSaveVcf" aria-label="Lưu danh bạ vCard vào máy">
        <span>💾</span> <span id="txtSaveVcf">Lưu Danh Bạ</span>
      </button>
      <button class="dock-btn" id="btnLaunchAr" aria-label="Xem thẻ trong không gian 3D AR">
        <span>🕶️</span> <span id="txtViewAr">Xem AR</span>
      </button>
      <button class="dock-btn" id="btnMoreActions" aria-haspopup="menu" aria-expanded="false" aria-controls="moreMenu" aria-label="Các tùy chọn khác">
        <span>⚙️</span> <span id="txtMore">Thêm</span>
      </button>
    </footer>`;

const newDock = `<footer class="action-dock">
      <button class="dock-btn dock-btn-primary" id="btnSaveVcf" aria-label="Lưu danh bạ vCard vào máy">
        <span>💾</span> <span id="txtSaveVcf">Lưu Danh Bạ .vcf</span>
      </button>
      <button class="dock-btn" id="btnLaunchAr" aria-label="Xem thẻ trong không gian 3D AR">
        <span>🕶️</span> <span id="txtViewAr">Xem AR Card</span>
      </button>
      <button class="dock-btn" id="btnOpenQrDirect" aria-label="Xem mã QR Offline">
        <span>📱</span> <span id="txtViewQr">Xem QR Offline</span>
      </button>
    </footer>`;

// 5. Remove more-menu-modal entirely from HTML
const oldMoreMenu = `<div class="more-menu-modal" id="moreMenu" role="menu">
    <button class="more-item" id="btnMenuQr" role="menuitem"><span>📱</span> <span>Xem Mã QR Offline</span></button>
    <button class="more-item" id="btnMenuToggleOrient" role="menuitem"><span>📐</span> <span>Đổi Dọc / Ngang</span></button>
    <button class="more-item" id="btnMenuSample" role="menuitem"><span>✨</span> <span>Nạp Mẫu Minh Tâm</span></button>
  </div>`;

html = html.replace(oldFrontBottom, newFrontBottom);
html = html.replace(oldBackBottom, newBackBottom);
html = html.replace(oldCardPerspectiveEnd, newCardPerspectiveEnd);
html = html.replace(oldDock, newDock);
html = html.replace(oldMoreMenu, '');

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Updated HTML DOM structure successfully!');
