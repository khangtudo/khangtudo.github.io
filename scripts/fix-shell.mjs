import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

const target = '</footer>\n\n  </div>\n\n  <!-- More Menu Dropup -->\n  \n\n  <!-- EditSheet';
const replacement = '</footer>\n    </div> <!-- /main-canvas-row -->\n  </div> <!-- /app-shell (mainAppShell) -->\n\n  <!-- EditSheet';

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync(p, html, 'utf8');
  console.log('✅ Successfully closed app-shell!');
} else {
  console.error('Target not found!');
}
