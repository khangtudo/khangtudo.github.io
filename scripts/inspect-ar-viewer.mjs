import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

// Check arViewer and btnLaunchAr
const arIdx = html.indexOf('id="arViewer"');
console.log('--- arViewer in HTML ---');
console.log(html.substring(arIdx - 50, arIdx + 300));

const btnLaunchIdx = html.indexOf('btnLaunchAr.onclick');
console.log('--- btnLaunchAr.onclick in JS ---');
console.log(html.substring(btnLaunchIdx - 50, btnLaunchIdx + 500));
