import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const flagScriptIdx = html.indexOf('const flagBtn =');
console.log(html.substring(flagScriptIdx, flagScriptIdx + 1200));
