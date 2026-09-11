import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const arIdx = html.indexOf("document.getElementById('btnLaunchAr')");
console.log(html.substring(arIdx - 50, arIdx + 600));
