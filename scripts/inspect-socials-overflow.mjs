import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const socIdx = html.indexOf('id="cardSocials"');
console.log('--- cardSocials HTML ---');
console.log(html.substring(socIdx - 150, socIdx + 300));

const socBtnIdx = html.indexOf('.soc-circle-btn');
console.log('--- .soc-circle-btn CSS ---');
console.log(html.substring(socBtnIdx - 50, socBtnIdx + 400));

const contactListIdx = html.indexOf('.contact-list');
console.log('--- .contact-list CSS ---');
console.log(html.substring(contactListIdx - 50, contactListIdx + 400));
