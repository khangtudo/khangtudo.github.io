import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands.html', 'utf8');

const zoomIdx = html.indexOf('const rawZoomRatio');
console.log(html.substring(zoomIdx - 200, zoomIdx + 600));
