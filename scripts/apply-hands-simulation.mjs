import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// Replace camera error handling to offer an instant Simulation Mode
const oldCameraCatch = `    cameraFeed.start().then(() => {
      console.log('Camera started successfully');
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.style.display = 'none', 400);
      animate();
    }).catch(err => {
      console.error('Camera failed to start:', err);
      loadingOverlay.innerHTML = \`<div style="color:#ef4444; font-weight:700; text-align:center; padding:20px;">
        ⚠️ Không thể mở Camera: \${err.message}<br>
        <span style="font-size:0.8rem; color:#94a3b8;">Vui lòng cấp quyền truy cập camera trên trình duyệt</span>
      </div>\`;
    });`;

const newCameraCatch = `    let isSimulating = false;

    function startSimulationMode(reason) {
      isSimulating = true;
      console.log('Starting Interactive Simulation Mode:', reason);
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.style.display = 'none', 400);

      // Start Three.js animation loop
      animate();

      txtGestureTitle.textContent = 'Chế Độ Thử Nghiệm Chuột / Cảm Ứng';
      txtGestureDesc.textContent = 'Rê chuột = Bàn tay di chuyển | Nhấn giữ chuột = Kẹp ngón tay (Pinch) | Thả chuột = Xòe bàn tay';
      txtCardState.textContent = 'MÔ PHỎNG TAY';
      txtCardState.style.color = '#38bdf8';

      let isMouseDown = false;

      function simulateHand(clientX, clientY, isPinch) {
        const normX = clientX / window.innerWidth;
        const normY = clientY / window.innerHeight;

        // Generate synthetic 21 landmarks
        const mockLm = [];
        for (let i = 0; i <= 20; i++) mockLm.push({ x: normX, y: normY, z: 0 });

        mockLm[0] = { x: normX, y: Math.min(1, normY + 0.2), z: 0 };
        mockLm[9] = { x: normX, y: normY, z: -0.05 };

        if (isPinch) {
          // Pinch
          mockLm[4] = { x: normX - 0.01, y: normY, z: 0 };
          mockLm[8] = { x: normX + 0.01, y: normY, z: 0 };
          mockLm[12] = { x: normX, y: normY - 0.1, z: 0 };
        } else {
          // Open Palm
          mockLm[4] = { x: normX - 0.1, y: normY - 0.05, z: 0 };
          mockLm[8] = { x: normX - 0.04, y: normY - 0.18, z: 0 };
          mockLm[6] = { x: normX - 0.04, y: normY - 0.1, z: 0 };
          mockLm[12] = { x: normX, y: normY - 0.2, z: 0 };
          mockLm[10] = { x: normX, y: normY - 0.12, z: 0 };
          mockLm[16] = { x: normX + 0.04, y: normY - 0.17, z: 0 };
          mockLm[14] = { x: normX + 0.04, y: normY - 0.09, z: 0 };
          mockLm[20] = { x: normX + 0.08, y: normY - 0.13, z: 0 };
          mockLm[18] = { x: normX + 0.08, y: normY - 0.07, z: 0 };
        }

        onResults({ multiHandLandmarks: [mockLm] });
      }

      window.addEventListener('mousemove', (e) => {
        simulateHand(e.clientX, e.clientY, isMouseDown);
      });

      window.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        simulateHand(e.clientX, e.clientY, true);
      });

      window.addEventListener('mouseup', (e) => {
        isMouseDown = false;
        simulateHand(e.clientX, e.clientY, false);
      });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          simulateHand(e.touches[0].clientX, e.touches[0].clientY, isMouseDown);
        }
      });
      window.addEventListener('touchstart', (e) => {
        isMouseDown = true;
        if (e.touches.length > 0) simulateHand(e.touches[0].clientX, e.touches[0].clientY, true);
      });
      window.addEventListener('touchend', () => {
        isMouseDown = false;
      });

      // Initial hand position
      simulateHand(window.innerWidth / 2, window.innerHeight / 2, false);
    }

    cameraFeed.start().then(() => {
      console.log('Camera started successfully');
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.style.display = 'none', 400);
      animate();
    }).catch(err => {
      console.warn('Camera not available, falling back to Simulation Mode:', err);
      startSimulationMode(err.message);
    });`;

if (html.includes(oldCameraCatch)) {
  html = html.replace(oldCameraCatch, newCameraCatch);
  console.log('✅ Added robust simulation fallback to ar-hands.html!');
} else {
  console.error('oldCameraCatch not found!');
}

fs.writeFileSync(p, html, 'utf8');
