import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

// Check line and whatsapp in BRAND_ICONS
console.log('has line:', html.includes('line:'));
console.log('has whatsapp:', html.includes('whatsapp:') || html.includes('wa:'));
console.log('has linkedin:', html.includes('li:') || html.includes('linkedin:'));
console.log('has youtube:', html.includes('yt:') || html.includes('youtube:'));
console.log('has tiktok:', html.includes('tiktok:'));
