import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Add continuous targetRotationY state and 4-finger curl state tracking
const oldStateBlock = `    let showSkeleton = true;
    let cardFlipped = false;
    let currentGesture = 'NONE'; // 'NONE' | 'PALM' | 'PINCH' | 'ZOOM'

    // Flip cooldown & hysteresis
    let lastFlipTime = 0;
    let pinchConsecutiveFrames = 0;
    const PINCH_ON_DIST = 0.05;
    const PINCH_OFF_DIST = 0.08;
    const FLIP_COOLDOWN_MS = 750;

    // Hand zoom baseline
    let baseHandSpan = 0.28; // reference hand span in normalized units`;

const newStateBlock = `    let showSkeleton = true;
    let cardFlipped = false; // false = Front (0°), true = Back (180°)
    let currentGesture = 'NONE'; // 'NONE' | 'PALM' | 'PINCH' | 'FIST_FLIP' | 'OPEN_FLIP'

    // Continuous Cumulative Y-rotation for Directional 180° Flip (Left-to-Right vs Right-to-Left)
    let targetRotationY = 0; // Cumulative radians: 0, Math.PI, 2*Math.PI, etc.
    let targetRotationX = 0;
    let targetRotationZ = 0;

    // 4-Finger Grip/Release Flip State Tracking
    // 'EXTENDED' (xòe 4 ngón) vs 'CURLED' (nắm 4 ngón)
    let lastFingerPose = 'UNKNOWN'; // 'EXTENDED' | 'CURLED'
    let consecutivePoseFrames = 0;
    let lastPoseFlipTime = 0;
    const POSE_COOLDOWN_MS = 650; // cooldown giữa các lần nắm/mở để chống giật

    // Flip cooldown & hysteresis
    let lastFlipTime = 0;
    let pinchConsecutiveFrames = 0;
    const PINCH_ON_DIST = 0.05;
    const PINCH_OFF_DIST = 0.08;
    const FLIP_COOLDOWN_MS = 750;

    // Hand zoom baseline
    let baseHandSpan = 0.28;`;

html = html.replace(oldStateBlock, newStateBlock);

// 2. Add Helper to detect 4-finger pose (open vs curled)
const helperPoseCode = `
    // Detect 4 fingers status (Index 8, Middle 12, Ring 16, Pinky 20 relative to PIPs 6,10,14,18)
    function analyzeFourFingers(lm) {
      const fingers = [
        { tip: 8, pip: 6 },
        { tip: 12, pip: 10 },
        { tip: 16, pip: 14 },
        { tip: 20, pip: 18 }
      ];
      let extCount = 0;
      let curlCount = 0;
      fingers.forEach(f => {
        const dTip = dist(lm[0], lm[f.tip]);
        const dPip = dist(lm[0], lm[f.pip]);
        if (dTip > dPip * 1.08) extCount++;
        else if (dTip < dPip * 0.98) curlCount++;
      });
      return {
        isExtended: extCount >= 3,
        isCurled: curlCount >= 3
      };
    }
`;

html = html.replace('function onResults(results) {', `${helperPoseCode}\n    function onResults(results) {`);

// 3. Update gesture recognition inside onResults
const oldGestureLogic = `        // 4. PINCH TO FLIP (Kẹp 2 ngón trỏ & cái để lật 180° mặt sau / mặt trước)
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
          txtGestureDesc.textContent = 'Đưa tay lại gần/xa để thu phóng (Zoom: ' + Math.min(150, Math.round(dynamicCardScale * 100)) + '%)';
          txtCardState.textContent = 'THU PHÓNG TAY';
          txtCardState.style.color = '#10b981';

          // Float slightly above palm center
          targetPos.set(handX, handY + 0.14, 0.1);
          targetScale = Math.min(1.50, dynamicCardScale * 1.05);

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

const newGestureLogic = `        // 4. KIỂM TRA ĐỘNG TÁC NẮM / MỞ 4 NGÓN TAY ĐỂ LẬT THẺ 180° CÓ HƯỚNG
        const now = performance.now();
        const fourFingers = analyzeFourFingers(lm);

        // Động tác A: Đang MỞ ➔ NẮM 4 ngón lại: Card lật 180° từ Trái sang Phải (+Math.PI)
        if (fourFingers.isCurled) {
          if (lastFingerPose === 'EXTENDED' && (now - lastPoseFlipTime > POSE_COOLDOWN_MS)) {
            consecutivePoseFrames++;
            if (consecutivePoseFrames >= 2) {
              targetRotationY += Math.PI; // Lật 180° từ trái sang phải
              cardFlipped = !cardFlipped;
              lastPoseFlipTime = now;
              lastFingerPose = 'CURLED';
              consecutivePoseFrames = 0;
              btnFlipCard.textContent = cardFlipped ? '🔄 Mặt Sau' : '🔄 Mặt Trước';
            }
          } else {
            lastFingerPose = 'CURLED';
          }
        }
        // Động tác B: Đang NẮM ➔ MỞ 4 ngón ra: Card lật 180° từ Phải sang Trái (-Math.PI)
        else if (fourFingers.isExtended) {
          if (lastFingerPose === 'CURLED' && (now - lastPoseFlipTime > POSE_COOLDOWN_MS)) {
            consecutivePoseFrames++;
            if (consecutivePoseFrames >= 2) {
              targetRotationY -= Math.PI; // Lật 180° từ phải sang trái
              cardFlipped = !cardFlipped;
              lastPoseFlipTime = now;
              lastFingerPose = 'EXTENDED';
              consecutivePoseFrames = 0;
              btnFlipCard.textContent = cardFlipped ? '🔄 Mặt Sau' : '🔄 Mặt Trước';
            }
          } else {
            lastFingerPose = 'EXTENDED';
          }
        }

        // 5. CỬ CHỈ PINCH DỰ PHÒNG (Kẹp ngón trỏ & cái)
        const isPinchCandidate = (pinchDist < PINCH_ON_DIST);
        if (isPinchCandidate) {
          pinchConsecutiveFrames++;
          if (pinchConsecutiveFrames >= 3 && (now - lastFlipTime > FLIP_COOLDOWN_MS)) {
            targetRotationY += Math.PI;
            cardFlipped = !cardFlipped;
            lastFlipTime = now;
            btnFlipCard.textContent = cardFlipped ? '🔄 Mặt Sau' : '🔄 Mặt Trước';
          }
        } else if (pinchDist > PINCH_OFF_DIST) {
          pinchConsecutiveFrames = 0;
        }

        // Compute palm normal/tilt from wrist 0 to middle mcp 9 & index 5
        const roll = (lm[17].y - lm[5].y) * 2.0;
        const pitch = (lm[9].z - lm[0].z) * 1.8;

        if (fourFingers.isCurled) {
          // --- GESTURE: NẮM 4 NGÓN (FIST / GRIP) ---
          currentGesture = 'FIST_FLIP';
          txtGestureIcon.textContent = '✊';
          txtGestureTitle.textContent = 'Nắm 4 Ngón: Lật Trái ➔ Phải';
          txtGestureDesc.textContent = cardFlipped ? 'Đã lật sang Mặt Sau | Mở 4 ngón để lật ngược lại' : 'Đã lật sang Mặt Trước | Mở 4 ngón để lật ngược lại';
          txtCardState.textContent = 'NẮM 4 NGÓN';
          txtCardState.style.color = '#f43f5e';

          targetPos.set(handX, handY, 0.05);
          targetScale = dynamicCardScale * 0.95;
          targetRotationX = pitch * 0.5;
          targetRotationZ = -roll * 0.5;

        } else if (isOpenPalm) {
          // --- GESTURE: XÒE LÒNG BÀN TAY (OPEN PALM ANCHOR & ZOOM) ---
          currentGesture = 'PALM';
          txtGestureIcon.textContent = '🖐️';
          txtGestureTitle.textContent = 'Xòe Lòng Bàn Tay: Thẻ Nổi 3D';
          txtGestureDesc.textContent = 'Đưa tay lại gần/xa để thu phóng (Zoom: ' + Math.min(150, Math.round(dynamicCardScale * 100)) + '%) | Nắm 4 ngón để lật thẻ';
          txtCardState.textContent = 'THU PHÓNG TAY';
          txtCardState.style.color = '#10b981';

          targetPos.set(handX, handY + 0.14, 0.1);
          targetScale = Math.min(1.50, dynamicCardScale * 1.05);
          targetRotationX = pitch;
          targetRotationZ = -roll;

        } else {
          // Neutral hand position
          currentGesture = 'HOVER';
          txtGestureIcon.textContent = '👋';
          txtGestureTitle.textContent = 'Bàn Tay Tương Tác';
          txtGestureDesc.textContent = 'Nắm/Mở 4 ngón để lật thẻ Trái ⇄ Phải | Tiến/Lùi để thu phóng 70%-150%';
          txtCardState.textContent = 'SẴN SÀNG';
          txtCardState.style.color = '#38bdf8';

          targetPos.set(handX, handY, 0);
          targetScale = dynamicCardScale;
          targetRotationX = 0;
          targetRotationZ = 0;
        }`;

html = html.replace(oldGestureLogic, newGestureLogic);

// 4. Update animate loop to smoothly interpolate targetRotationY at optimal speed (no jerkiness)
const oldAnimateLerp = `      cardGroup.position.lerp(targetPos, smoothFactor);
      cardGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), smoothFactor);
      
      cardGroup.rotation.x += (targetRot.x - cardGroup.rotation.x) * smoothFactor;
      cardGroup.rotation.y += (targetRot.y - cardGroup.rotation.y) * smoothFactor;
      cardGroup.rotation.z += (targetRot.z - cardGroup.rotation.z) * smoothFactor;`;

const newAnimateLerp = `      cardGroup.position.lerp(targetPos, smoothFactor);
      cardGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), smoothFactor);
      
      // Tốc độ xoay lật êm ái chống giật (flipRotationSpeed = 1 - Math.exp(-dt / 0.18))
      const flipSmoothFactor = 1 - Math.exp(-dt / 0.18);
      cardGroup.rotation.x += (targetRotationX - cardGroup.rotation.x) * smoothFactor;
      cardGroup.rotation.y += (targetRotationY - cardGroup.rotation.y) * flipSmoothFactor;
      cardGroup.rotation.z += (targetRotationZ - cardGroup.rotation.z) * smoothFactor;`;

html = html.replace(oldAnimateLerp, newAnimateLerp);

// 5. Update btnFlipCard onclick to increment targetRotationY cleanly
const oldBtnFlip = `    btnFlipCard.onclick = () => {
      cardFlipped = !cardFlipped;
      btnFlipCard.textContent = cardFlipped ? '🔄 Mặt Sau' : '🔄 Mặt Trước';
    };`;

const newBtnFlip = `    btnFlipCard.onclick = () => {
      cardFlipped = !cardFlipped;
      targetRotationY += (cardFlipped ? Math.PI : -Math.PI);
      btnFlipCard.textContent = cardFlipped ? '🔄 Mặt Sau' : '🔄 Mặt Trước';
    };`;

html = html.replace(oldBtnFlip, newBtnFlip);

// 6. Update idle animation when no hand is present
const oldIdle = `        // Gentle idle floating animation
        const time = performance.now() * 0.0015;
        targetPos.set(0, Math.sin(time) * 0.04, 0);
        targetRot.set(Math.sin(time * 0.8) * 0.06, cardFlipped ? Math.PI : 0, Math.cos(time * 0.7) * 0.04);
        targetScale = 1.0;`;

const newIdle = `        // Gentle idle floating animation
        const time = performance.now() * 0.0015;
        targetPos.set(0, Math.sin(time) * 0.04, 0);
        targetRotationX = Math.sin(time * 0.8) * 0.06;
        targetRotationZ = Math.cos(time * 0.7) * 0.04;
        targetScale = 1.0;`;

html = html.replace(oldIdle, newIdle);

fs.writeFileSync(p, html, 'utf8');
fs.writeFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands/index.html', html, 'utf8');
console.log('✅ Successfully implemented 4-finger curl/extend directional 180° flip with smooth anti-jitter rotation!');
