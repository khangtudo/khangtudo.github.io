import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Add camera toggle button to HUD controls
const oldHudControls = `    <div class="hud-controls">
      <button class="btn-ar-ctrl" id="btnToggleMesh">🦴 Khớp Xương: BẬT</button>
      <button class="btn-ar-ctrl" id="btnFlipCard">🔄 Lật Thẻ</button>
      <a href="index.html" class="btn-ar-ctrl" style="text-decoration:none; max-width: 90px;">✕ Thoát</a>
    </div>`;

const newHudControls = `    <div class="hud-controls">
      <button class="btn-ar-ctrl" id="btnSwitchCam">📷 Đổi Cam</button>
      <button class="btn-ar-ctrl" id="btnToggleMesh">🦴 Khớp Xương: BẬT</button>
      <button class="btn-ar-ctrl" id="btnFlipCard">🔄 Lật Thẻ</button>
      <a href="index.html" class="btn-ar-ctrl" style="text-decoration:none; max-width: 80px;">✕ Thoát</a>
    </div>`;

if (html.includes(oldHudControls)) {
  html = html.replace(oldHudControls, newHudControls);
  console.log('✅ Added btnSwitchCam to HUD controls!');
} else {
  console.error('oldHudControls not found!');
}

// 2. Add camera switching logic in JS
const oldCamSetup = `    // Camera setup
    const cameraFeed = new Camera(videoElement, {
      onFrame: async () => {
        lastInferenceStart = performance.now();
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720
    });`;

const newCamSetup = `    let currentFacingMode = 'user'; // 'user' (selfie/front) | 'environment' (rear)
    let cameraFeed = null;

    function initCamera(facing) {
      if (cameraFeed) {
        try { cameraFeed.stop(); } catch(e){}
      }

      currentFacingMode = facing;
      // Mirror video only when using front camera
      if (currentFacingMode === 'user') {
        videoElement.style.transform = 'scaleX(-1)';
        skeletonCanvas.style.transform = 'scaleX(-1)';
      } else {
        videoElement.style.transform = 'none';
        skeletonCanvas.style.transform = 'none';
      }

      cameraFeed = new Camera(videoElement, {
        onFrame: async () => {
          lastInferenceStart = performance.now();
          await hands.send({ image: videoElement });
        },
        facingMode: currentFacingMode,
        width: 1280,
        height: 720
      });

      return cameraFeed.start();
    }`;

if (html.includes(oldCamSetup)) {
  html = html.replace(oldCamSetup, newCamSetup);
  console.log('✅ Updated Camera setup with facingMode support!');
} else {
  console.error('oldCamSetup not found!');
}

// 3. Update Camera start caller
const oldCamStart = `    cameraFeed.start().then(() => {
      console.log('Camera started successfully');
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.style.display = 'none', 400);
      animate();
    }).catch(err => {
      console.warn('Camera not available, falling back to Simulation Mode:', err);
      startSimulationMode(err.message);
    });`;

const newCamStart = `    initCamera(currentFacingMode).then(() => {
      console.log('Camera started successfully with facingMode:', currentFacingMode);
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.style.display = 'none', 400);
      animate();
    }).catch(err => {
      console.warn('Camera not available, falling back to Simulation Mode:', err);
      startSimulationMode(err.message);
    });

    const btnSwitchCam = document.getElementById('btnSwitchCam');
    if (btnSwitchCam) {
      btnSwitchCam.onclick = () => {
        const nextFacing = currentFacingMode === 'user' ? 'environment' : 'user';
        btnSwitchCam.textContent = nextFacing === 'user' ? '📷 Cam: Trước' : '📷 Cam: Sau';
        initCamera(nextFacing).catch(e => {
          console.warn('Switch camera error:', e);
        });
      };
    }`;

if (html.includes(oldCamStart)) {
  html = html.replace(oldCamStart, newCamStart);
  console.log('✅ Updated camera start caller and btnSwitchCam handler!');
} else {
  console.error('oldCamStart not found!');
}

fs.writeFileSync(p, html, 'utf8');
console.log('Done patching ar-hands.html with camera switcher!');
