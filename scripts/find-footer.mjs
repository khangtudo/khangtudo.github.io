import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const footerIdx = html.indexOf('</footer>');
console.log(JSON.stringify(html.substring(footerIdx, footerIdx + 200)));
