import fs from 'node:fs';

const glb = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/assets/3d/card.glb');
// Look for PNG header 0x89, 0x50, 0x4E, 0x47
const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
const idx = glb.indexOf(pngHeader);
console.log('PNG header in card.glb at offset:', idx);

if (idx !== -1) {
  // Look for IEND chunk 0x49, 0x45, 0x4E, 0x44, followed by 4 bytes CRC
  const iend = Buffer.from([0x49, 0x45, 0x4E, 0x44]);
  const endIdx = glb.indexOf(iend, idx);
  if (endIdx !== -1) {
    const pngBuf = glb.subarray(idx, endIdx + 8);
    console.log('Found PNG buffer of size:', pngBuf.length);
    fs.writeFileSync('C:/Users/ADMIN/projects/inid.me/assets/3d/extracted-texture.png', pngBuf);
    console.log('Saved extracted-texture.png successfully!');
  }
}
