import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/ar-hands.html', 'utf8');

// Check line endings
console.log('CRLF count:', (html.match(/\r\n/g) || []).length);
console.log('LF count:', (html.match(/[^\r]\n/g) || []).length);

const hudIdx = html.indexOf('id="btnToggleMesh"');
console.log(JSON.stringify(html.substring(hudIdx - 60, hudIdx + 120)));
