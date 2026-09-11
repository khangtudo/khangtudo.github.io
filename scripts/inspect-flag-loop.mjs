import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const flagFuncIdx = html.indexOf('Object.keys(I18N).forEach((code, idx) => {');
console.log(html.substring(flagFuncIdx, flagFuncIdx + 800));
