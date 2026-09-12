import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands.html', 'utf8');

// Check UV coordinates on BoxGeometry
const uvIdx = html.indexOf('uvAttr.setXY');
console.log('--- UV in ar-hands.html ---');
console.log(html.substring(uvIdx - 100, uvIdx + 600));

// Check cardGroup rotation & scale
const rotIdx = html.indexOf('targetRot.set');
console.log('--- targetRot in ar-hands.html ---');
console.log(html.substring(rotIdx - 100, rotIdx + 800));
