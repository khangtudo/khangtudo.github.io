import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Replace the single </div> with two </div></div> and proper comments
const target = `    </footer>

  </div>

  <!-- More Menu Dropup -->
  
  <!-- EditSheet (Overlay Slide-over / Bottom Sheet) -->`;

const replacement = `    </footer>
    </div> <!-- Close main-canvas-row -->
  </div> <!-- Close app-shell (mainAppShell) -->

  <!-- EditSheet (Overlay Slide-over / Bottom Sheet) -->`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync(p, html, 'utf8');
  console.log('✅ Successfully closed mainAppShell properly!');
} else {
  console.error('Target not found!');
}
