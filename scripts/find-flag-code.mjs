import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const flagIdx = html.indexOf('flagBtn');
console.log(html.substring(flagIdx, flagIdx + 800));
