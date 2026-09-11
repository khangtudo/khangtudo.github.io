import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const flagIdx = html.indexOf('function populateFlagMenu()');
console.log(html.substring(flagIdx, flagIdx + 1200));

const logoSvg = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/assets/logo.svg', 'utf8');
console.log('--- logo.svg ---');
console.log(logoSvg);
