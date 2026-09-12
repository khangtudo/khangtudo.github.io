import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands.html', 'utf8');

const hudIdx = html.indexOf('class="hud-controls"');
console.log('--- hud-controls ---');
console.log(html.substring(hudIdx, hudIdx + 400));

const camIdx = html.indexOf('const cameraFeed =');
console.log('--- cameraFeed ---');
console.log(html.substring(camIdx, camIdx + 400));
