import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const saveVcfIdx = html.indexOf('function buildVCardString()');
console.log(html.substring(saveVcfIdx, saveVcfIdx + 800));
