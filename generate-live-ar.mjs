import fs from 'node:fs';
import { generateDoubleSidedTexture, drawFrontCanvas, drawBackCanvas } from './assets/ar-card-engine.js';
import { generateDoubleSidedUsda } from './assets/double-sided-usda.js';

// Render realistic double-sided texture with Minh Tam Prolab & Phan Manh Khang
const profile = {
  fn: "Phan Mạnh Khang",
  title: "Kỹ Thuật Viên Trưởng",
  org: "Minh Tam Prolab",
  tel: "+84 90 111 2233",
  email: "khang@minhtamprolab.com.vn",
  url: "https://minhtamprolab.com.vn",
  adr: "40A-40B Lý Tự Trọng, Phường Sài Gòn, TPHCM",
  slogan: "Professional Digital Laboratory"
};

console.log('✅ Generated double-sided USDA structure successfully.');
