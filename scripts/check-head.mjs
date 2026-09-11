import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

const headIdx = html.indexOf('<head>');
const headEnd = html.indexOf('</head>');
console.log(html.substring(headIdx, headEnd));
