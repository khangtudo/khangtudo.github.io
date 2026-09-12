import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// Find onResults implementation from "if (isPinching) {" to end of function
const ifPinchIdx = html.indexOf('if (isPinching) {');
console.log(html.substring(ifPinchIdx, ifPinchIdx + 2000));
