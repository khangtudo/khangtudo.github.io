import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// Replace rawZoomRatio calculation
const oldZoomCode = `        // Hand closer to camera (larger span) or fingers spread wide -> zoom in (scale up to 1.8x)
        // Hand further away or fist clenched -> zoom out (scale down to 0.7x)
        const rawZoomRatio = Math.max(0.65, Math.min(2.0, (currentHandSpan / baseHandSpan) * 1.05));
        const dynamicCardScale = rawZoomRatio;`;

const newZoomCode = `        // Hand closer to camera (larger span) -> zoom in (scale up to 1.5x / 150% max)
        // Hand further away -> zoom out (scale down to 0.7x / 70% min) smoothly
        const rawZoomRatio = Math.max(0.70, Math.min(1.50, (currentHandSpan / baseHandSpan)));
        const dynamicCardScale = rawZoomRatio;`;

if (html.includes(oldZoomCode)) {
  html = html.replace(oldZoomCode, newZoomCode);
  console.log('✅ Updated rawZoomRatio to max 1.50 (150%) and min 0.70 (70%)!');
} else {
  console.error('oldZoomCode not found!');
}

// Ensure targetScale doesn't overshoot 1.50 in isOpenPalm
const oldPalmScale = `          targetPos.set(handX, handY + 0.14, 0.1);
          targetScale = dynamicCardScale * 1.1;`;

const newPalmScale = `          targetPos.set(handX, handY + 0.14, 0.1);
          targetScale = Math.min(1.50, dynamicCardScale * 1.05);`;

if (html.includes(oldPalmScale)) {
  html = html.replace(oldPalmScale, newPalmScale);
  console.log('✅ Capped targetScale in isOpenPalm at 1.50 max!');
} else {
  console.error('oldPalmScale not found!');
}

// Update zoom percentage display
const oldZoomDisplay = `txtGestureDesc.textContent = 'Đưa tay lại gần/xa để thu phóng (Zoom: ' + Math.round(dynamicCardScale * 100) + '%)';`;
const newZoomDisplay = `txtGestureDesc.textContent = 'Đưa tay lại gần/xa để thu phóng (Zoom: ' + Math.min(150, Math.round(dynamicCardScale * 100)) + '%)';`;

if (html.includes(oldZoomDisplay)) {
  html = html.replace(oldZoomDisplay, newZoomDisplay);
  console.log('✅ Updated zoom display text to cap at 150%!');
} else {
  console.error('oldZoomDisplay not found!');
}

fs.writeFileSync(p, html, 'utf8');
fs.writeFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands/index.html', html, 'utf8');
console.log('Done patching both files!');
