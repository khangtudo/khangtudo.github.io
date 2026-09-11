import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

// 1. Check btnSaveVcf & updateI18n
const dockIdx = html.indexOf('id="btnSaveVcf"');
console.log('--- btnSaveVcf in HTML ---');
console.log(html.substring(dockIdx - 50, dockIdx + 250));

const updateI18nIdx = html.indexOf('function updateI18n()');
console.log('--- updateI18n ---');
console.log(html.substring(updateI18nIdx, updateI18nIdx + 600));

// 2. Check profile defaults (FB, Zalo, Address)
const profileIdx = html.indexOf('let profile =');
console.log('--- profile ---');
console.log(html.substring(profileIdx, profileIdx + 600));

// 3. Check cardAdr and cardAdrLink
const adrIdx = html.indexOf('id="cardAdrLink"');
console.log('--- cardAdrLink in HTML ---');
console.log(html.substring(adrIdx - 50, adrIdx + 300));

// 4. Check renderCard address logic
const renderAdrIdx = html.indexOf('const elAdrLink = document.getElementById');
console.log('--- renderCard address logic ---');
console.log(html.substring(renderAdrIdx - 50, renderAdrIdx + 400));
