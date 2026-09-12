import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Extend cooldown to 800ms to give animation plenty of room to settle to 99.9%
html = html.replace('const POSE_COOLDOWN_MS = 650;', 'const POSE_COOLDOWN_MS = 800;');

// 2. Clamp dt tighter to 0.05s (50ms) to prevent any large snap if tab loses focus
html = html.replace('const dt = Math.min(0.1, (nowMs - lastFrameTime) * 0.001);', 'const dt = Math.min(0.05, (nowMs - lastFrameTime) * 0.001);');

// 3. Add version tag
html = html.replace('<title>inid.me — MediaPipe Hands AI AR Prototype</title>', '<title>inid.me — MediaPipe Hands AI AR Prototype (v2.1)</title>');

fs.writeFileSync(p, html, 'utf8');
fs.writeFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands/index.html', html, 'utf8');
console.log('✅ Polished timing constants: 800ms cooldown, 50ms dt clamp, v2.1 tag!');
