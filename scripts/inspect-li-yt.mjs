import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const liIdx = html.indexOf('li: {');
console.log('--- li ---');
console.log(html.substring(liIdx, liIdx + 400));

const ytIdx = html.indexOf('yt: {');
console.log('--- yt ---');
console.log(html.substring(ytIdx, ytIdx + 400));
