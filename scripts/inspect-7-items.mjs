import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

// 1. flagBtn
const fIdx = html.indexOf('id="flagBtn"');
console.log('--- 1. flagBtn ---');
console.log(html.substring(fIdx - 50, fIdx + 250));

// 2. qrCard
const qIdx = html.indexOf('class="qr-card"');
console.log('--- 2. qrCard ---');
console.log(html.substring(qIdx, qIdx + 400));

// 3. profile
const pIdx = html.indexOf('let profile =');
console.log('--- 3. profile ---');
console.log(html.substring(pIdx, pIdx + 300));

// 4. cardAdr
const aIdx = html.indexOf('id="cardAdr"');
console.log('--- 4. cardAdr ---');
console.log(html.substring(aIdx - 50, aIdx + 150));

// 5, 6, 7. identity-rail & badge & logo
const bIdx = html.indexOf('class="identity-rail"');
console.log('--- 5,6,7. identity-rail ---');
console.log(html.substring(bIdx, bIdx + 600));

const bgIdx = html.indexOf('class="brand-group"');
console.log('--- brand-group ---');
console.log(html.substring(bgIdx, bgIdx + 300));
