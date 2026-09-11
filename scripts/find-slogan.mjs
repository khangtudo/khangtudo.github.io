import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

let count = 0;
let pos = 0;
while ((pos = html.indexOf('Professional Digital Laboratory', pos)) !== -1) {
  console.log(`Match ${count} at ${pos}:`);
  console.log(html.substring(pos - 40, pos + 80));
  count++;
  pos += 30;
}
console.log(`Total occurrences: ${count}`);
