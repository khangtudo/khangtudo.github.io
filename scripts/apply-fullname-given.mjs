import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Find buildVCardString
const oldBuildVCardStart = `  function buildVCardString() {
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

const newBuildVCardStart = `  function buildVCardString() {
    const rawFn = (profile.fn || 'Liên hệ').trim();

    // Escape special characters in vCard text (; , \\)
    const escapeVCard = (str) => (str || '').replace(/\\\\/g, '\\\\\\\\').replace(/;/g, '\\\\;').replace(/,/g, '\\\\,');

    // Phản biện chuẩn xác của Papa: Để họ (Family Name) rỗng và điền trọn vẹn fullname vào Tên (Given Name)
    // Cấu trúc N: Family Name; Given Name; Additional/Middle; Prefix; Suffix
    // => N;CHARSET=UTF-8:;[Full Name];;;
    // Ưu điểm vượt trội:
    // 1. Không cần suy đoán hay phân biệt cấu trúc tên quốc gia phương Tây hay Châu Á.
    // 2. Trên iOS/Android, ô "Tên" nhận trọn vẹn nguyên vẹn cả Họ và Tên (vd: "Phan Mạnh Khang"), không bao giờ bị đảo ngược trật tự tên.
    // 3. Trong danh bạ điện thoại hiển thị đúng từng chữ người dùng gõ, không bị lỗi xáo trộn hay nhầm họ thành tên.
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'PRODID:-//inid.me//Smart AR vCard//VN',
      \`FN;CHARSET=UTF-8:\${escapeVCard(rawFn)}\`,
      \`N;CHARSET=UTF-8:;\${escapeVCard(rawFn)};;;;\`
    ];`;

if (html.includes(oldBuildVCardStart)) {
  html = html.replace(oldBuildVCardStart, newBuildVCardStart);
  console.log('✅ Updated buildVCardString: Fullname in Given Name (N:;fullname;;;) successfully!');
} else {
  console.error('oldBuildVCardStart not found!');
}

fs.writeFileSync(p, html, 'utf8');
