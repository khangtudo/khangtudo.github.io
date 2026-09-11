import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

// 1. Where are the inputs in editSheet?
const sheetBodyIdx = html.indexOf('class="sheet-body"');
console.log('--- sheet-body ---');
console.log(html.substring(sheetBodyIdx, sheetBodyIdx + 2500));

// 2. Where is renderCard function?
const renderCardIdx = html.indexOf('function renderCard()');
console.log('--- renderCard function ---');
console.log(html.substring(renderCardIdx, renderCardIdx + 2000));
