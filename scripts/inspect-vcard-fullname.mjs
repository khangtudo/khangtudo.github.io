import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Current buildVCardString:
const vcardIdx = html.indexOf('function buildVCardString()');
console.log(html.substring(vcardIdx, vcardIdx + 1400));
