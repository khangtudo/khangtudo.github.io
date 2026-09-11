import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Replace CSS styles for App Shell, Identity Rail, Card Stage, and Action Dock
const oldCssBlock = `    /* Base 1-Page App Shell */
    .app-shell {
      position: relative;
      z-index: 1;
      height: 100svh;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: max(10px, var(--safe-t)) clamp(16px, 4vw, 32px) max(16px, var(--safe-b));
      max-width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      overflow: hidden;
    }
    .main-canvas-row {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex: 1;
      min-height: 0;
      position: relative;
    }
    @media (min-width: 1024px) {
      .main-canvas-row {
        display: grid;
        grid-template-columns: 320px minmax(380px, 1fr);
        gap: 40px;
        align-items: center;
      }
    }`;

const newCssBlock = `    /* Base 1-Page App Shell */
    .app-shell {
      position: relative;
      z-index: 1;
      height: 100svh;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: max(10px, var(--safe-t)) clamp(16px, 3vw, 32px) max(16px, var(--safe-b));
      max-width: 1280px;
      margin: 0 auto;
      box-sizing: border-box;
      overflow: hidden;
      width: 100%;
    }
    .main-canvas-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex: 1;
      min-height: 0;
      position: relative;
    }
    @media (min-width: 1024px) {
      .main-canvas-row {
        display: grid;
        grid-template-columns: 340px 1fr 260px;
        gap: 32px;
        align-items: center;
        max-width: 1240px;
        margin: 0 auto;
      }
    }`;

html = html.replace(oldCssBlock, newCssBlock);

// Update HTML structure so action-dock is INSIDE main-canvas-row on Desktop (3 columns: Identity Left | Card Center | Dock Right)
// On Mobile it stacks naturally!
const oldCanvasHtml = `    <!-- Main Canvas Row: Desktop Left Rail + Center Card Stage -->
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
      <main class="card-stage">
      <div class="card-perspective" id="cardPerspective">
        <div class="card-3d" id="card3d" role="button" tabindex="0" aria-pressed="false" aria-label="Danh thiếp 3D hai mặt. Nhấn Enter hoặc Space để lật sang mặt sau." title="Chạm để lật thẻ 🔄">
          
          <!-- Front Face -->
          <div class="card-face card-front" aria-label="Mặt trước cá nhân">
            <div class="person-row">
              <img id="cardAvatar" class="card-avatar" src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23131b2e%22 stroke=%22%2338bdf8%22 stroke-width=%223%22/><text x=%2250%22 y=%2258%22 font-size=%2232%22 text-anchor=%22middle%22 fill=%22%2338bdf8%22>PMK</text></svg>" alt="Avatar">
              <div class="person-text">
                <h2 id="cardFn">Phan Mạnh Khang</h2>
                <p id="cardTitle">Kỹ Thuật Viên Trưởng</p>
                <p id="cardOrg" style="font-size:0.75rem; color:var(--muted)">Minh Tam Prolab</p>
              </div>
            </div>

            <div class="contacts-stack">
              <a id="cardTelLink" href="tel:+84901112233" class="contact-badge" aria-label="Gọi điện thoại">📞 <span id="cardTel">+84 90 111 2233</span></a>
              <a id="cardEmailLink" href="mailto:khang@minhtamprolab.com.vn" class="contact-badge" aria-label="Gửi email">✉️ <span id="cardEmail">khang@minhtamprolab.com.vn</span></a>
              <a id="cardUrlLink" href="https://minhtamprolab.com.vn" target="_blank" class="contact-badge" aria-label="Mở trang web doanh nghiệp">🌐 <span id="cardUrl">minhtamprolab.com.vn</span></a>
            </div>

            <div class="card-bottom">
              <div class="social-icons-box" id="cardSocials" aria-label="Liên kết mạng xã hội"></div>
              <button type="button" class="btn-toggle-orient-card" id="btnOrientInside" aria-label="Đổi hướng thẻ Dọc hoặc Ngang">
                <span>📐</span> <span id="txtOrientInside">Đổi Dọc/Ngang</span>
              </button>
            </div>
          </div>

          <!-- Back Face -->
          <div class="card-face card-back" aria-label="Mặt sau doanh nghiệp">
            <div class="company-stack">
              <img id="cardLogo" class="company-logo" src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2218%22 fill=%22%23131b2e%22 stroke=%22%2338bdf8%22 stroke-width=%222%22/><text x=%2250%22 y=%2260%22 font-size=%2232%22 text-anchor=%22middle%22 font-weight=%22bold%22 fill=%22%2338bdf8%22>MT</text></svg>" alt="Logo">
              <h3 id="cardBackOrg">Minh Tam Prolab</h3>
              <p class="slogan" id="cardSlogan">Professional Digital Laboratory</p>
              <p class="address" id="cardAdr">40A-40B Lý Tự Trọng, Phường Sài Gòn, TPHCM</p>
            </div>
            <div class="card-bottom" style="justify-content: flex-end;">
              <button type="button" class="btn-toggle-orient-card" id="btnOrientInsideBack" aria-label="Đổi hướng thẻ Dọc hoặc Ngang">
                <span>📐</span> <span>Đổi Dọc/Ngang</span>
              </button>
            </div>
          </div>

        </div>
      </div>
      <!-- Nút Chạm để lật thẻ nằm ngay bên dưới thẻ -->
      <div class="flip-hint-wrap">
        <button type="button" class="btn-flip-below" id="btnFlipBelow" aria-label="Chạm để lật thẻ 3D">
          <span>🔄</span> <span id="txtFlipBelow">Chạm để lật thẻ 3D</span>
        </button>
      </div>
      </main>
    </div>

  <!-- Action Dock: 3 Main Direct Buttons (Save VCF | View AR | View QR Offline) -->
  <footer class="action-dock">
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

const newCanvasHtml = `    <!-- Main Canvas Row: Desktop 3 Columns (Left Identity Rail | Center Card Stage | Right Action Dock) -->
    <div class="main-canvas-row">
      <!-- Desktop Identity Rail (Hidden on Mobile) -->
      <aside class="identity-rail">
        <div class="big-logo">
          <img src="assets/logo.svg" alt="inid.me logo" style="height:84px; width:auto;">
        </div>
        <div class="badge-chip">⚡ SPATIAL AR VCARD</div>
        <p id="txtHeroSlogan" style="font-size:1rem; font-weight:500; color:#cbd5e1; line-height:1.6;">
          Smart AR VCard & Offline QR.<br>
          <span style="font-size:0.84rem; color:var(--muted);">Một chạm lưu danh bạ không mạng, mở rộng không gian 3D AR đa chiều.</span>
        </p>
      </aside>

      <!-- Center Card Stage -->
      <main class="card-stage">
        <div class="card-perspective" id="cardPerspective">
          <div class="card-3d" id="card3d" role="button" tabindex="0" aria-pressed="false" aria-label="Danh thiếp 3D hai mặt. Nhấn Enter hoặc Space để lật sang mặt sau." title="Chạm để lật thẻ 🔄">
            
            <!-- Front Face -->
            <div class="card-face card-front" aria-label="Mặt trước cá nhân">
              <div class="person-row">
                <img id="cardAvatar" class="card-avatar" src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23131b2e%22 stroke=%22%2338bdf8%22 stroke-width=%223%22/><text x=%2250%22 y=%2258%22 font-size=%2232%22 text-anchor=%22middle%22 fill=%22%2338bdf8%22>PMK</text></svg>" alt="Avatar">
                <div class="person-text">
                  <h2 id="cardFn">Phan Mạnh Khang</h2>
                  <p id="cardTitle">Kỹ Thuật Viên Trưởng</p>
                  <p id="cardOrg" style="font-size:0.75rem; color:var(--muted)">Minh Tam Prolab</p>
                </div>
              </div>

              <div class="contacts-stack">
                <a id="cardTelLink" href="tel:+84901112233" class="contact-badge" aria-label="Gọi điện thoại">📞 <span id="cardTel">+84 90 111 2233</span></a>
                <a id="cardEmailLink" href="mailto:khang@minhtamprolab.com.vn" class="contact-badge" aria-label="Gửi email">✉️ <span id="cardEmail">khang@minhtamprolab.com.vn</span></a>
                <a id="cardUrlLink" href="https://minhtamprolab.com.vn" target="_blank" class="contact-badge" aria-label="Mở trang web doanh nghiệp">🌐 <span id="cardUrl">minhtamprolab.com.vn</span></a>
              </div>

              <div class="card-bottom">
                <div class="social-icons-box" id="cardSocials" aria-label="Liên kết mạng xã hội"></div>
                <button type="button" class="btn-toggle-orient-card" id="btnOrientInside" aria-label="Đổi hướng thẻ Dọc hoặc Ngang">
                  <span>📐</span> <span id="txtOrientInside">Đổi Dọc/Ngang</span>
                </button>
              </div>
            </div>

            <!-- Back Face -->
            <div class="card-face card-back" aria-label="Mặt sau doanh nghiệp">
              <div class="company-stack">
                <img id="cardLogo" class="company-logo" src="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2218%22 fill=%22%23131b2e%22 stroke=%22%2338bdf8%22 stroke-width=%222%22/><text x=%2250%22 y=%2260%22 font-size=%2232%22 text-anchor=%22middle%22 font-weight=%22bold%22 fill=%22%2338bdf8%22>MT</text></svg>" alt="Logo">
                <h3 id="cardBackOrg">Minh Tam Prolab</h3>
                <p class="slogan" id="cardSlogan">Professional Digital Laboratory</p>
                <p class="address" id="cardAdr">40A-40B Lý Tự Trọng, Phường Sài Gòn, TPHCM</p>
              </div>
              <div class="card-bottom" style="justify-content: flex-end;">
                <button type="button" class="btn-toggle-orient-card" id="btnOrientInsideBack" aria-label="Đổi hướng thẻ Dọc hoặc Ngang">
                  <span>📐</span> <span>Đổi Dọc/Ngang</span>
                </button>
              </div>
            </div>

          </div>
        </div>
        <!-- Nút Chạm để lật thẻ nằm ngay bên dưới thẻ -->
        <div class="flip-hint-wrap">
          <button type="button" class="btn-flip-below" id="btnFlipBelow" aria-label="Chạm để lật thẻ 3D">
            <span>🔄</span> <span id="txtFlipBelow">Chạm để lật thẻ 3D</span>
          </button>
        </div>
      </main>

      <!-- Action Dock: Placed in Right Column on Desktop, Bottom Dock on Mobile -->
      <footer class="action-dock">
        <button class="dock-btn dock-btn-primary" id="btnSaveVcf" aria-label="Lưu danh bạ vCard vào máy">
          <span>💾</span> <span id="txtSaveVcf">Lưu Danh Bạ .vcf</span>
        </button>
        <button class="dock-btn" id="btnLaunchAr" aria-label="Xem thẻ trong không gian 3D AR">
          <span>🕶️</span> <span id="txtViewAr">Xem AR Card</span>
        </button>
        <button class="dock-btn" id="btnOpenQrDirect" aria-label="Xem mã QR Offline">
          <span>📱</span> <span id="txtViewQr">Xem QR Offline</span>
        </button>
      </footer>
    </div>`;

html = html.replace(oldCanvasHtml, newCanvasHtml);

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Re-architected Desktop 3-column layout successfully!');
