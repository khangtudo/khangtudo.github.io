import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== RUNNING INID.ME PLATFORM TEST SUITE ===');

const BASE_DIR = 'C:/Users/ADMIN/projects/inid.me';

// Test 1: Critical Files & Jekyll bypass
console.log('Test 1: Verifying structural files...');
assert.ok(fs.existsSync(path.join(BASE_DIR, 'CNAME')), 'CNAME must exist');
assert.strictEqual(fs.readFileSync(path.join(BASE_DIR, 'CNAME'), 'utf8').trim(), 'inid.me', 'CNAME must point to inid.me');
assert.ok(fs.existsSync(path.join(BASE_DIR, '.nojekyll')), '.nojekyll must exist to serve assets and vendor directories');
assert.ok(fs.existsSync(path.join(BASE_DIR, 'llms.txt')), 'llms.txt must exist per Gravatar standard');
console.log('✅ Test 1 Passed: CNAME, .nojekyll, and llms.txt verified.');

// Test 2: Asset resolution (AR models & vendor JS)
console.log('Test 2: Verifying 3D assets & vendored libraries...');
const assets3D = ['card.glb', 'card.usdz', 'poster.svg'];
assets3D.forEach(file => {
  const p = path.join(BASE_DIR, 'assets/3d', file);
  assert.ok(fs.existsSync(p), `Asset ${file} must exist`);
  assert.ok(fs.statSync(p).size > 500, `Asset ${file} must not be empty`);
});
const vendorJS = ['model-viewer.min.js', 'qrcode.min.js'];
vendorJS.forEach(file => {
  const p = path.join(BASE_DIR, 'assets/vendor', file);
  assert.ok(fs.existsSync(p), `Vendor script ${file} must exist`);
  assert.ok(fs.statSync(p).size > 10000, `Vendor script ${file} must not be empty`);
});
console.log('✅ Test 2 Passed: All 3D assets & offline vendored libraries present.');

// Test 3: i18n Dictionary verification (27 languages)
console.log('Test 3: Verifying 27 languages i18n completeness...');
import { I18N, getTranslation } from 'file:///C:/Users/ADMIN/projects/inid.me/assets/i18n.js';
const expectedLanguages = [
  'en', 'da', 'de', 'es', 'eu', 'fr', 'hu', 'id', 'it', 'nl', 'no', 'pl',
  'pt', 'pt-BR', 'ro', 'sv', 'tr', 'vi', 'ar', 'el', 'fa', 'he', 'hi',
  'ja', 'ko', 'zh-CN', 'zh-TW'
];
assert.strictEqual(Object.keys(I18N).length, 27, `Must have exactly 27 languages (found ${Object.keys(I18N).length})`);
expectedLanguages.forEach(code => {
  assert.ok(I18N[code], `Language ${code} must exist in dictionary`);
  assert.ok(I18N[code].name, `Language ${code} must have a display name`);
  assert.ok(I18N[code].title, `Language ${code} must have a translated title`);
});
assert.strictEqual(getTranslation('vi', 'saveVcf'), 'Lưu Danh Bạ (.vcf)');
assert.strictEqual(getTranslation('en', 'saveVcf'), 'Save Contact (.vcf)');
console.log('✅ Test 3 Passed: 27 languages verified.');

// Test 4: NTAG215 strict UTF-8 CRLF byte limit
console.log('Test 4: Simulating strict NTAG215 vCard byte limit...');
function generateSampleVCard(fn, org, title, tel, email, adr) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${fn}`,
    `N;CHARSET=UTF-8:;;;;`,
    `ORG;CHARSET=UTF-8:${org}`,
    `TITLE;CHARSET=UTF-8:${title}`,
    `TEL;TYPE=CELL:${tel}`,
    `EMAIL;TYPE=INTERNET:${email}`,
    `ADR;TYPE=WORK;CHARSET=UTF-8:;;${adr};;;;`,
    'URL:https://inid.me',
    'END:VCARD'
  ];
  return lines.join('\r\n') + '\r\n';
}

const vcfSample = generateSampleVCard(
  'Nguyễn Ánh Tuyết',
  'Công ty Đông Phương',
  'Trưởng phòng Đối ngoại',
  '+84901112233',
  'tuyet.nguyen@dongphuong.test',
  'Thành phố Hồ Chí Minh'
);

const byteLength = Buffer.byteLength(vcfSample, 'utf8');
console.log(`Measured sample UTF-8 vCard byte length: ${byteLength} bytes`);
assert.ok(byteLength <= 480, `vCard payload (${byteLength}B) must strictly fit in <= 480 bytes safe limit for NTAG215`);
console.log('✅ Test 4 Passed: Strict NTAG215 byte budget respected.');

console.log('🎉 ALL INID.ME TESTS PASSED (100%)!');
