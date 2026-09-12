import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// Check lines around currentGesture and lastFlipTime
const stateIdx = html.indexOf('let currentGesture');
console.log(html.substring(stateIdx - 50, stateIdx + 600));
