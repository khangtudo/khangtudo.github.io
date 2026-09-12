import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

let pos = 0;
while ((pos = html.indexOf('orientation', pos)) !== -1) {
  console.log(`Match at ${pos}:`);
  console.log(html.substring(pos - 40, pos + 120));
  pos += 11;
}
