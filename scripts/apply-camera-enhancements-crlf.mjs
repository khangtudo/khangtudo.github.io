import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Controls
const oldControls = `<div class="hud-controls">
      <button class="btn-ar-ctrl" id="btnToggleMesh">🦴 Khớp Xương: BẬT</button>
      <button class="btn-ar-ctrl" id="btnFlipCard">🔄 Lật Thẻ</button>
      <a href="index.html" class="btn-ar-ctrl" style="text-decoration:none; max-width: 90px;">✕ Thoát</a>
    </div>`;

const newControls = `<div class="hud-controls">
      <button class="btn-ar-ctrl" id="btnSwitchCam">📷 Đổi Cam</button>
      <button class="btn-ar-ctrl" id="btnToggleMesh">🦴 Khớp Xương: BẬT</button>
      <button class="btn-ar-ctrl" id="btnFlipCard">🔄 Lật Thẻ</button>
      <a href="index.html" class="btn-ar-ctrl" style="text-decoration:none; max-width: 75px;">✕ Thoát</a>
    </div>`;

if (html.includes(oldControls)) {
  html = html.replace(oldControls, newControls);
  console.log('✅ Replaced controls!');
} else {
  console.error('oldControls not found');
}

// 2. Camera block
const oldCameraBlock = `    // Camera setup
    const cameraFeed = new Camera(videoElement, {
      onFrame: async () => {
        lastInferenceStart = performance.now();
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720
    });

    let isSimulating = false;`;

const newCameraBlock = `    let currentFacingMode = 'user'; // 'user' (front) | 'environment' (back)
    let cameraFeed = null;

    function initCamera(facing) {
      if (cameraFeed) {
        try { cameraFeed.stop(); } catch(e){}
      }

      currentFacingMode = facing;
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
    }

    let isSimulating = false;`;

if (html.includes(oldCameraBlock)) {
  html = html.replace(oldCameraBlock, newCameraBlock);
  console.log('✅ Replaced Camera block!');
} else {
  console.error('oldCameraBlock not found');
}

// 3. Caller
const oldCaller = `    cameraFeed.start().then(() => {
      console.log('Camera started successfully');
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.style.display = 'none', 400);
      animate();
    }).catch(err => {
      console.warn('Camera not available, falling back to Simulation Mode:', err);
      startSimulationMode(err.message);
    });`;

const newCaller = `    initCamera(currentFacingMode).then(() => {
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

if (html.includes(oldCaller)) {
  html = html.replace(oldCaller, newCaller);
  console.log('✅ Replaced Caller!');
} else {
  console.error('oldCaller not found');
}

fs.writeFileSync(p, html, 'utf8');
console.log('Done!');
