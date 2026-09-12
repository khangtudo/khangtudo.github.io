import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

// Check horizontal CSS
const horizStart = html.indexOf('.card-perspective.horizontal {');
console.log(html.substring(horizStart, horizStart + 800));
