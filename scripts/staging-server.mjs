import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/Users/ADMIN/projects/inid.me';
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.glb': 'model/gltf-binary',
  '.usdz': 'model/vnd.usdz+zip',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  if (reqPath.endsWith('/')) reqPath += 'index.html';

  let filePath = path.join(root, reqPath);
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  fs.createReadStream(filePath).pipe(res);
});

server.listen(8090, '0.0.0.0', () => {
  console.log('Staging server running at http://0.0.0.0:8090/');
});
