import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// In action dock: add a staging button or link to ar-hands.html
const oldActionDock = `<button class="dock-btn" id="btnLaunchAr" aria-label="Xem thẻ trong không gian 3D AR">
        <span>🕶️</span> <span id="txtViewAr">Xem AR Card</span>
      </button>`;

const newActionDock = `<button class="dock-btn" id="btnLaunchAr" aria-label="Xem thẻ trong không gian 3D AR">
        <span>🕶️</span> <span id="txtViewAr">Xem AR Card</span>
      </button>
      <a href="ar-hands.html" class="dock-btn" id="btnStagingHands" style="background:rgba(244,63,94,0.15); border-color:rgba(244,63,94,0.4); color:#f43f5e; text-decoration:none;" title="Thử nghiệm công nghệ AI nhận diện bàn tay MediaPipe">
        <span>🧪</span> <span>AI Hand AR</span>
      </a>`;

if (html.includes(oldActionDock)) {
  html = html.replace(oldActionDock, newActionDock);
  console.log('✅ Added staging link to ar-hands.html in action-dock!');
} else {
  console.error('oldActionDock not found!');
}

fs.writeFileSync(p, html, 'utf8');
