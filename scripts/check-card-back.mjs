import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const backStart = html.indexOf('card-face card-back');
console.log(html.substring(backStart, backStart + 1200));
