import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/ar-hands.html';
let html = fs.readFileSync(p, 'utf8');

// Replace relative texture path with absolute root path
html = html.replace("'assets/3d/extracted-texture.png'", "'/assets/3d/extracted-texture.png'");
html = html.replace('href="index.html"', 'href="/"');

fs.writeFileSync(p, html, 'utf8');

// Also write to ar-hands/index.html so /ar-hands/ works as a clean URL
fs.mkdirSync('C:/Users/ADMIN/projects/inid.me/ar-hands', { recursive: true });
fs.writeFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands/index.html', html, 'utf8');
console.log('✅ Updated ar-hands.html and created ar-hands/index.html with absolute root paths!');
