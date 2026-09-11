import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const shellStart = html.indexOf('class="app-shell"');
const sheetStart = html.indexOf('id="editSheet"');
const chunk = html.substring(shellStart, sheetStart);

// find tags in order
const tagRegex = /<\/?([a-zA-Z0-9-]+)[^>]*>/g;
let match;
let depth = 0;
while ((match = tagRegex.exec(chunk)) !== null) {
  const full = match[0];
  const tagName = match[1].toLowerCase();
  const isClosing = full.startsWith('</');
  const isSelfClosing = full.endsWith('/>') || ['img', 'br', 'hr', 'input', 'meta', 'link'].includes(tagName);
  
  if (isClosing) {
    depth--;
    console.log(`${'  '.repeat(Math.max(0, depth))}</${tagName}> (depth: ${depth})`);
  } else if (!isSelfClosing) {
    console.log(`${'  '.repeat(depth)}<${tagName}> (depth: ${depth}) [${full.substring(0, 30)}]`);
    depth++;
  }
}
console.log('Final depth before editSheet:', depth);
