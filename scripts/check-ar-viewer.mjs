import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

console.log('arViewer exists?', html.indexOf('id="arViewer"'));
const arStart = html.indexOf('id="arViewer"');
if (arStart !== -1) {
  console.log(html.substring(arStart - 100, arStart + 400));
}
