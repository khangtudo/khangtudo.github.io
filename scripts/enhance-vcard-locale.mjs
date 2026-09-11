import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Notice: In Vietnamese and Asian locales (vi, ja, ko, zh), Family Name is first, Given Name is last.
// In vCard standard (RFC 2426 / RFC 6350):
// N: Family Names (Họ) ; Given Names (Tên chính) ; Additional/Middle Names (Tên lót) ; Honorific Prefixes ; Honorific Suffixes
// For "Phan Mạnh Khang":
// Family (Họ): Phan
// Given (Tên): Khang
// Additional (Đệm): Mạnh
// Result: N;CHARSET=UTF-8:Phan;Khang;Mạnh;;
// In iOS Contacts with Vietnamese display order:
// Họ: Phan
// Tên: Khang
// Tên đệm: Mạnh
// Full display: "Phan Mạnh Khang"

// Also handle western order (if lang is en/fr/de/es/it):
const oldBuildVCard = `  function buildVCardString() {
    const rawFn = (profile.fn || 'Liên hệ').trim();
    const parts = rawFn.split(/\\s+/);
    let lastName = '';
    let firstName = '';
    let middleName = '';

    if (parts.length === 1) {
      firstName = parts[0];
    } else if (parts.length === 2) {
      lastName = parts[0];
      firstName = parts[1];
    } else {
      lastName = parts[0];
      firstName = parts[parts.length - 1];
      middleName = parts.slice(1, parts.length - 1).join(' ');
    }

    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'PRODID:-//inid.me//Smart AR vCard//VN',
      \`FN;CHARSET=UTF-8:\${rawFn}\`,
      \`N;CHARSET=UTF-8:\${lastName};\${firstName};\${middleName};;\`
    ];`;

const newBuildVCard = `  function buildVCardString() {
    const rawFn = (profile.fn || 'Liên hệ').trim();
    const parts = rawFn.split(/\\s+/);
    let lastName = '';
    let firstName = '';
    let middleName = '';

    const isAsianOrder = ['vi', 'ja', 'ko', 'zh-CN', 'zh-TW', 'hu'].includes(currentLang);

    if (parts.length === 1) {
      firstName = parts[0];
    } else if (parts.length === 2) {
      if (isAsianOrder) {
        lastName = parts[0];
        firstName = parts[1];
      } else {
        firstName = parts[0];
        lastName = parts[1];
      }
    } else {
      if (isAsianOrder) {
        // Vietnamese / Asian: [0] = Họ (Family), [last] = Tên (Given), [middle] = Đệm (Additional)
        lastName = parts[0];
        firstName = parts[parts.length - 1];
        middleName = parts.slice(1, parts.length - 1).join(' ');
      } else {
        // Western: [0] = Given, [last] = Family, [middle] = Middle
        firstName = parts[0];
        lastName = parts[parts.length - 1];
        middleName = parts.slice(1, parts.length - 1).join(' ');
      }
    }

    // Escape special characters in vCard text (; , \\)
    const escapeVCard = (str) => (str || '').replace(/\\\\/g, '\\\\\\\\').replace(/;/g, '\\\\;').replace(/,/g, '\\\\,');

    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'PRODID:-//inid.me//Smart AR vCard//VN',
      \`FN;CHARSET=UTF-8:\${escapeVCard(rawFn)}\`,
      \`N;CHARSET=UTF-8:\${escapeVCard(lastName)};\${escapeVCard(firstName)};\${escapeVCard(middleName)};;\`
    ];`;

if (html.includes(oldBuildVCard)) {
  html = html.replace(oldBuildVCard, newBuildVCard);
  console.log('✅ Updated buildVCardString with locale-aware N parser and RFC escaping!');
} else {
  console.error('oldBuildVCard not found!');
}

fs.writeFileSync(p, html, 'utf8');
