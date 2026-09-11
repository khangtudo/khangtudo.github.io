import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const webIdx = html.indexOf('web: {');
console.log(html.substring(webIdx, webIdx + 600));
