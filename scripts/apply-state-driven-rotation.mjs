import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// Replace cumulative increment with state-driven target (targetRotationY = cardFlipped ? Math.PI : 0)
const oldTriggerBlock = `        // Động tác A: Đang MỞ ➔ NẮM 4 ngón lại: Card lật 180° từ Trái sang Phải (+Math.PI)
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
        }`;

const newTriggerBlock = `        // Động tác A: Đang MỞ ➔ NẮM 4 ngón lại: Card lật 180° từ Trái sang Phải (Mặt Trước -> Mặt Sau)
        if (fourFingers.isCurled) {
          if (lastFingerPose === 'EXTENDED' && (now - lastPoseFlipTime > POSE_COOLDOWN_MS)) {
            consecutivePoseFrames++;
            if (consecutivePoseFrames >= 3) {
              cardFlipped = true;
              targetRotationY = Math.PI; // Target state-driven 180° (xoay thuận chiều sang phải)
              lastPoseFlipTime = now;
              lastFingerPose = 'CURLED';
              consecutivePoseFrames = 0;
              btnFlipCard.textContent = '🔄 Mặt Sau';
            }
          } else {
            lastFingerPose = 'CURLED';
          }
        }
        // Động tác B: Đang NẮM ➔ MỞ 4 ngón ra: Card lật 180° từ Phải sang Trái (Mặt Sau -> Mặt Trước)
        else if (fourFingers.isExtended) {
          if (lastFingerPose === 'CURLED' && (now - lastPoseFlipTime > POSE_COOLDOWN_MS)) {
            consecutivePoseFrames++;
            if (consecutivePoseFrames >= 3) {
              cardFlipped = false;
              targetRotationY = 0; // Target state-driven 0° (xoay ngược chiều về trái)
              lastPoseFlipTime = now;
              lastFingerPose = 'EXTENDED';
              consecutivePoseFrames = 0;
              btnFlipCard.textContent = '🔄 Mặt Trước';
            }
          } else {
            lastFingerPose = 'EXTENDED';
          }
        }`;

if (html.includes(oldTriggerBlock)) {
  html = html.replace(oldTriggerBlock, newTriggerBlock);
  console.log('✅ Replaced with state-driven targetRotationY to guarantee zero angle drift!');
} else {
  console.error('oldTriggerBlock not found!');
}

// Also update btnFlipCard to use state-driven targets
const oldBtnFlip = `    btnFlipCard.onclick = () => {
      cardFlipped = !cardFlipped;
      targetRotationY += (cardFlipped ? Math.PI : -Math.PI);
      btnFlipCard.textContent = cardFlipped ? '🔄 Mặt Sau' : '🔄 Mặt Trước';
    };`;

const newBtnFlip = `    btnFlipCard.onclick = () => {
      cardFlipped = !cardFlipped;
      targetRotationY = cardFlipped ? Math.PI : 0;
      btnFlipCard.textContent = cardFlipped ? '🔄 Mặt Sau' : '🔄 Mặt Trước';
    };`;

if (html.includes(oldBtnFlip)) {
  html = html.replace(oldBtnFlip, newBtnFlip);
  console.log('✅ Updated btnFlipCard with state-driven target!');
} else {
  console.error('oldBtnFlip not found!');
}

fs.writeFileSync(p, html, 'utf8');
fs.writeFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands/index.html', html, 'utf8');
console.log('Done synchronization!');
