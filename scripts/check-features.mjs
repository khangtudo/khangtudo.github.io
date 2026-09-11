import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

console.log('btnLaunchAr:', html.indexOf('btnLaunchAr'));
console.log('launchAr:', html.indexOf('launchAr'));
console.log('btnOpenQrDirect:', html.indexOf('btnOpenQrDirect'));
console.log('openQr:', html.indexOf('openQr'));
console.log('btnCreateSheet:', html.indexOf('btnCreateSheet'));
console.log('openEditSheet:', html.indexOf('openEditSheet'));
console.log('editSheet:', html.indexOf('editSheet'));
console.log('qrModal:', html.indexOf('qrModal'));
console.log('model-viewer:', html.indexOf('model-viewer'));
