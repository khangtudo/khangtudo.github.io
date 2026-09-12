import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const boxIdx = html.indexOf('.social-icons-box');
console.log('--- .social-icons-box CSS ---');
console.log(html.substring(boxIdx - 100, boxIdx + 500));

const btmIdx = html.indexOf('.card-bottom');
console.log('--- .card-bottom CSS ---');
console.log(html.substring(btmIdx - 50, btmIdx + 500));
