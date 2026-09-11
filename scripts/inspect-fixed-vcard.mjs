import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const vcardIdx = html.indexOf('function buildVCardString()');
console.log(html.substring(vcardIdx, vcardIdx + 1200));
