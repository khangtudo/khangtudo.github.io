import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const flagBtnIdx = html.indexOf('id="flagBtn"');
console.log('--- flagBtn in HTML ---');
console.log(html.substring(flagBtnIdx - 100, flagBtnIdx + 400));

const flagJsIdx = html.indexOf('flagMenu');
console.log('--- flagMenu in JS ---');
const idx = html.indexOf('const flagMenu =');
console.log(html.substring(idx, idx + 1000));
