import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const idxOpenSheet = html.indexOf('function openSheet()');
console.log(html.substring(idxOpenSheet, idxOpenSheet + 600));

const idxEditSheet = html.indexOf('id="editSheet"');
console.log(html.substring(idxEditSheet - 100, idxEditSheet + 200));
