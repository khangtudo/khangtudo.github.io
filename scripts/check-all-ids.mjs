import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const idRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const usedIds = new Set();
while ((match = idRegex.exec(html)) !== null) {
  usedIds.add(match[1]);
}

console.log('Checked IDs from getElementById:');
for (const id of usedIds) {
  const hasIdInHtml = html.includes(`id="${id}"`);
  if (!hasIdInHtml) {
    console.error(`❌ MISSING ID IN HTML: "${id}"`);
  } else {
    console.log(`✅ ${id}`);
  }
}
