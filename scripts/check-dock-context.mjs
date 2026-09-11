import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const dockIdx = html.indexOf('class="action-dock"');
console.log(html.substring(dockIdx - 100, dockIdx + 700));
