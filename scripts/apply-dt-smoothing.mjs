import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// Replace lerp with frame-rate independent exponential smoothing (dt)
const oldLerp = `      // Smooth dampening (lerp)
      cardGroup.position.lerp(targetPos, 0.15);
      cardGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      
      cardGroup.rotation.x += (targetRot.x - cardGroup.rotation.x) * 0.15;
      cardGroup.rotation.y += (targetRot.y - cardGroup.rotation.y) * 0.15;
      cardGroup.rotation.z += (targetRot.z - cardGroup.rotation.z) * 0.15;`;

const newLerp = `      // Smooth exponential dampening (Frame-rate independent: tau = 0.12s)
      const nowMs = performance.now();
      const dt = Math.min(0.1, (nowMs - lastFrameTime) * 0.001);
      lastFrameTime = nowMs;
      const smoothFactor = 1 - Math.exp(-dt / 0.12);

      cardGroup.position.lerp(targetPos, smoothFactor);
      cardGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), smoothFactor);
      
      cardGroup.rotation.x += (targetRot.x - cardGroup.rotation.x) * smoothFactor;
      cardGroup.rotation.y += (targetRot.y - cardGroup.rotation.y) * smoothFactor;
      cardGroup.rotation.z += (targetRot.z - cardGroup.rotation.z) * smoothFactor;`;

html = html.replace('let lastFpsTime = performance.now();', 'let lastFpsTime = performance.now();\n    let lastFrameTime = performance.now();');
html = html.replace(oldLerp, newLerp);

fs.writeFileSync(p, html, 'utf8');
fs.writeFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands/index.html', html, 'utf8');
console.log('✅ Applied delta-time exponential smoothing for buttery-smooth zoom!');
