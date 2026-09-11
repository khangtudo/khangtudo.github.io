import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

// 1. Header brand-group
const bgIdx = html.indexOf('class="brand-group"');
console.log('--- Brand group in header ---');
console.log(html.substring(bgIdx - 50, bgIdx + 400));

// 2. btnDownloadNfc in QR modal
const nfcIdx = html.indexOf('btnDownloadNfc');
console.log('--- btnDownloadNfc in HTML & JS ---');
console.log(html.substring(nfcIdx - 50, nfcIdx + 500));

// 3. Social fields in editSheet
const socIdx = html.indexOf('inSocialFb');
console.log('--- Social fields in editSheet ---');
console.log(html.substring(socIdx - 150, socIdx + 1000));
