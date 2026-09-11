import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const shellStart = html.indexOf('class="app-shell"');
const sheetStart = html.indexOf('id="editSheet"');
const qrModalStart = html.indexOf('id="qrModal"');

console.log('shellStart:', shellStart);
console.log('sheetStart:', sheetStart);
console.log('qrModalStart:', qrModalStart);

// Let's find all closing </div> tags between shellStart and sheetStart
const between = html.substring(shellStart, sheetStart);
const closeCount = (between.match(/<\/div>/g) || []).length;
const openCount = (between.match(/<div/g) || []).length;
console.log('openDivs:', openCount, 'closeDivs:', closeCount);
