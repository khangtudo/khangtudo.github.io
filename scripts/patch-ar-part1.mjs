import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Fix default camera to 'environment' (rear camera)
html = html.replace("let currentFacingMode = 'user';", "let currentFacingMode = 'environment';");

// 2. Fix Mirrored text on back face:
// Current UV for back face (index 20..23):
// uvAttr.setXY(20, 1, 0.5);
// uvAttr.setXY(21, 0, 0.5);
// uvAttr.setXY(22, 1, 0.0);
// uvAttr.setXY(23, 0, 0.0);
// In BoxGeometry, when looking at -Z face from back, U was reversed.
// Let's swap U coordinates for face 5:
const oldBackUv = `    // Back face (index 20..23) -> V: 0.0 to 0.5
    uvAttr.setXY(20, 1, 0.5);
    uvAttr.setXY(21, 0, 0.5);
    uvAttr.setXY(22, 1, 0.0);
    uvAttr.setXY(23, 0, 0.0);`;

const newBackUv = `    // Back face (index 20..23) -> V: 0.0 to 0.5 (Un-mirrored: text reads normally from back)
    uvAttr.setXY(20, 0, 0.5);
    uvAttr.setXY(21, 1, 0.5);
    uvAttr.setXY(22, 0, 0.0);
    uvAttr.setXY(23, 1, 0.0);`;

if (html.includes(oldBackUv)) {
  html = html.replace(oldBackUv, newBackUv);
  console.log('✅ Fixed mirrored back-face UV mapping!');
} else {
  console.error('oldBackUv not found!');
}

// 3. Card scale: enlarge x1.9 for clear text reading
// Old: const CARD_W = 0.32; const CARD_H = 0.194;
// New: CARD_W = 0.58; CARD_H = 0.35;
html = html.replace('const CARD_W = 0.32;\n    const CARD_H = 0.194;', 'const CARD_W = 0.58;\n    const CARD_H = 0.35;');
console.log('✅ Scaled card dimensions ~1.9x for ultra-sharp reading!');

// 4. Update initCamera to handle { ideal: 'environment' } properly and flip mirrored transform
const oldInitCam = `      currentFacingMode = facing;
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
      });`;

const newInitCam = `      currentFacingMode = facing;
      const isFront = (currentFacingMode === 'user');
      
      // Mirror video only on front camera
      videoElement.style.transform = isFront ? 'scaleX(-1)' : 'none';
      skeletonCanvas.style.transform = isFront ? 'scaleX(-1)' : 'none';

      cameraFeed = new Camera(videoElement, {
        onFrame: async () => {
          lastInferenceStart = performance.now();
          await hands.send({ image: videoElement });
        },
        facingMode: { ideal: currentFacingMode },
        width: 1280,
        height: 720
      });`;

if (html.includes(oldInitCam)) {
  html = html.replace(oldInitCam, newInitCam);
  console.log('✅ Updated initCamera with ideal facingMode constraint!');
} else {
  console.error('oldInitCam not found!');
}

fs.writeFileSync(p, html, 'utf8');
console.log('Step 1 complete!');
