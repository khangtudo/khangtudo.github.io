import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const adrIdx = html.indexOf('id="cardAdr"');
console.log('--- cardAdr in HTML ---');
console.log(html.substring(adrIdx - 100, adrIdx + 200));

const renderAdrIdx = html.indexOf("document.getElementById('cardAdr')");
console.log('--- cardAdr in renderCard ---');
console.log(html.substring(renderAdrIdx - 50, renderAdrIdx + 300));
