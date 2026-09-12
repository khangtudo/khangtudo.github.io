import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

// Inspect CSS around .card-perspective.horizontal
const idx = html.indexOf('.card-perspective.horizontal');
console.log(html.substring(idx - 200, idx + 1500));
