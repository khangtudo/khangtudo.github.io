import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// Global state additions before onResults
const oldGlobalState = `    let showSkeleton = true;
    let cardFlipped = false;
    let currentGesture = 'NONE'; // 'NONE' | 'PALM' | 'PINCH'

    // FPS Tracker
    let frameCount = 0;
    let lastFpsTime = performance.now();
    let lastInferenceStart = performance.now();`;

const newGlobalState = `    let showSkeleton = true;
    let cardFlipped = false;
    let currentGesture = 'NONE'; // 'NONE' | 'PALM' | 'PINCH' | 'ZOOM'

    // Flip cooldown & hysteresis
    let lastFlipTime = 0;
    let pinchConsecutiveFrames = 0;
    const PINCH_ON_DIST = 0.05;
    const PINCH_OFF_DIST = 0.08;
    const FLIP_COOLDOWN_MS = 750;

    // Hand zoom baseline
    let baseHandSpan = 0.28; // reference hand span in normalized units

    // FPS Tracker
    let frameCount = 0;
    let lastFpsTime = performance.now();
    let lastInferenceStart = performance.now();`;

html = html.replace(oldGlobalState, newGlobalState);

// Replace onResults body
const oldOnResultsBody = `        if (isPinching) {
          // --- GESTURE: PINCH TO HOLD ---
          currentGesture = 'PINCH';
          txtGestureIcon.textContent = '👌';
          txtGestureTitle.textContent = 'Đang Kẹp & Cầm Thẻ';
          txtGestureDesc.textContent = 'Di chuyển 2 ngón tay để dời vị trí thẻ danh thiếp';
          txtCardState.textContent = 'KẸP NGÓN TAY';
          txtCardState.style.color = '#f43f5e';

          // Snap card directly to pinch point
          targetPos.set(pinchX, pinchY, 0.2);
          targetScale = 0.95;
          
          // Slight tilt when holding
          const tiltZ = (lm[8].y - lm[4].y) * 1.5;
          targetRot.set(0.1, cardFlipped ? Math.PI : 0, tiltZ);

        } else if (isOpenPalm) {
          // --- GESTURE: OPEN PALM ANCHOR ---
          currentGesture = 'PALM';
          txtGestureIcon.textContent = '🖐️';
          txtGestureTitle.textContent = 'Thẻ Nổi Trên Lòng Bàn Tay';
          txtGestureDesc.textContent = 'Thẻ 3D tự động bay lơ lửng và nghiêng theo lòng bàn tay';
          txtCardState.textContent = 'LÒNG BÀN TAY';
          txtCardState.style.color = '#10b981';

          // Float slightly above palm center
          targetPos.set(handX, handY + 0.12, 0.1);
          targetScale = 1.05;

          // Compute palm normal/tilt from wrist 0 to middle mcp 9 & index 5
          const roll = (lm[17].y - lm[5].y) * 2.0;
          const pitch = (lm[9].z - lm[0].z) * 1.8;
          targetRot.set(pitch, cardFlipped ? Math.PI : 0, -roll);

        } else {
          // Hand present but relaxed
          currentGesture = 'HOVER';
          txtGestureIcon.textContent = '👋';
          txtGestureTitle.textContent = 'Đã Nhận Diện Bàn Tay';
          txtGestureDesc.textContent = 'Xòe lòng bàn tay hoặc chụm ngón cái & trỏ để cầm thẻ';
          txtCardState.textContent = 'BÁM THEO TAY';
          txtCardState.style.color = '#38bdf8';

          targetPos.set(handX, handY, 0);
          targetScale = 1.0;
          targetRot.set(0, cardFlipped ? Math.PI : 0, 0);
        }`;

const newOnResultsBody = `        // 3. DYNAMIC DISTANCE & ZOOM CALCULATION (Hand Distance & Spread)
        // Measure span between Wrist (0) and Middle Tip (12)
        const currentHandSpan = dist(lm[0], lm[12]);
        // Also measure 5-finger spread (Thumb tip 4 to Pinky tip 20)
        const fingerSpread = dist(lm[4], lm[20]);

        // Hand closer to camera (larger span) or fingers spread wide -> zoom in (scale up to 1.8x)
        // Hand further away or fist clenched -> zoom out (scale down to 0.7x)
        const rawZoomRatio = Math.max(0.65, Math.min(2.0, (currentHandSpan / baseHandSpan) * 1.05));
        const dynamicCardScale = rawZoomRatio;

        // 4. PINCH TO FLIP (Kẹp 2 ngón trỏ & cái để lật 180° mặt sau / mặt trước)
        const now = performance.now();
        const isPinchCandidate = (pinchDist < PINCH_ON_DIST);

        if (isPinchCandidate) {
          pinchConsecutiveFrames++;
          if (pinchConsecutiveFrames >= 3 && (now - lastFlipTime > FLIP_COOLDOWN_MS)) {
            // Trigger 180 flip!
            cardFlipped = !cardFlipped;
            lastFlipTime = now;
            btnFlipCard.textContent = cardFlipped ? '🔄 Mặt Sau' : '🔄 Mặt Trước';
          }
        } else if (pinchDist > PINCH_OFF_DIST) {
          pinchConsecutiveFrames = 0;
        }

        if (isPinching) {
          // --- GESTURE: PINCH (KẸP 2 NGÓN LẬT THẺ) ---
          currentGesture = 'PINCH';
          txtGestureIcon.textContent = '👌';
          txtGestureTitle.textContent = cardFlipped ? 'Đã Lật Sang Mặt Sau (180°)' : 'Đã Lật Sang Mặt Trước';
          txtGestureDesc.textContent = 'Kẹp ngón cái & trỏ xoay nhẹ để đổi mặt thẻ';
          txtCardState.textContent = 'LẬT 180°';
          txtCardState.style.color = '#f43f5e';

          targetPos.set(pinchX, pinchY, 0.15);
          targetScale = dynamicCardScale * 0.95;

          const tiltZ = (lm[8].y - lm[4].y) * 1.5;
          targetRot.set(0.1, cardFlipped ? Math.PI : 0, tiltZ);

        } else if (isOpenPalm) {
          // --- GESTURE: OPEN PALM ANCHOR & DYNAMIC ZOOM ---
          currentGesture = 'PALM';
          txtGestureIcon.textContent = '🖐️';
          txtGestureTitle.textContent = 'Thẻ Nổi Trên Lòng Bàn Tay';
          txtGestureDesc.textContent = 'Đưa tay lại gần/xa để thu phóng (Zoom: ' + Math.round(dynamicCardScale * 100) + '%)';
          txtCardState.textContent = 'THU PHÓNG TAY';
          txtCardState.style.color = '#10b981';

          // Float slightly above palm center
          targetPos.set(handX, handY + 0.14, 0.1);
          targetScale = dynamicCardScale * 1.1;

          // Compute palm normal/tilt from wrist 0 to middle mcp 9 & index 5
          const roll = (lm[17].y - lm[5].y) * 2.0;
          const pitch = (lm[9].z - lm[0].z) * 1.8;
          targetRot.set(pitch, cardFlipped ? Math.PI : 0, -roll);

        } else {
          // Hand present but neutral/fist
          currentGesture = 'HOVER';
          txtGestureIcon.textContent = '👋';
          txtGestureTitle.textContent = 'Đã Nhận Diện Bàn Tay';
          txtGestureDesc.textContent = 'Xòe lòng bàn tay để thu phóng | Kẹp 2 ngón để lật thẻ 180°';
          txtCardState.textContent = 'BÁM THEO TAY';
          txtCardState.style.color = '#38bdf8';

          targetPos.set(handX, handY, 0);
          targetScale = dynamicCardScale;
          targetRot.set(0, cardFlipped ? Math.PI : 0, 0);
        }`;

if (html.includes(oldOnResultsBody)) {
  html = html.replace(oldOnResultsBody, newOnResultsBody);
  console.log('✅ Updated onResults with Pinch-to-Flip 180° and Dynamic Distance/Span Zoom!');
} else {
  console.error('oldOnResultsBody not found!');
}

fs.writeFileSync(p, html, 'utf8');

// Copy directly to ar-hands/index.html so both routes stay perfectly in sync
fs.writeFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands/index.html', html, 'utf8');
console.log('✅ Synchronized ar-hands/index.html!');
