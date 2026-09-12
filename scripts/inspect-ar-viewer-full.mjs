import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const btnLaunchIdx = html.indexOf('btnLaunchAr.onclick');
console.log(html.substring(btnLaunchIdx, btnLaunchIdx + 1000));
