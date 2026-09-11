import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. In QR Modal HTML: replace btnDownloadVcf with btnDownloadNfc
const oldQrBtnRow = `<div class="qr-btn-row">
        <button class="btn-qr-action" id="btnDownloadQr">📥 Tải Ảnh</button>
        <button class="btn-qr-action" id="btnDownloadVcf">💾 Tải .vcf</button>
      </div>`;

const newQrBtnRow = `<div class="qr-btn-row">
        <button class="btn-qr-action" id="btnDownloadQr">📥 Tải Ảnh QR</button>
        <button class="btn-qr-action" id="btnDownloadNfc" title="Tải file dữ liệu vCard để ghi vào thẻ thông minh NFC">📡 Tải NFC .txt</button>
      </div>`;

if (html.includes(oldQrBtnRow)) {
  html = html.replace(oldQrBtnRow, newQrBtnRow);
  console.log('✅ Updated QR modal buttons in HTML!');
} else {
  console.error('oldQrBtnRow not found!');
}

// 2. In JS: replace btnDownloadVcf onclick with btnDownloadNfc onclick
const oldDlJs = `  document.getElementById('btnDownloadVcf').onclick = document.getElementById('btnSaveVcf').onclick;`;

const newDlJs = `  const btnDownloadNfc = document.getElementById('btnDownloadNfc');
  if (btnDownloadNfc) {
    btnDownloadNfc.onclick = () => {
      const vcf = buildVCardString();
      const blob = new Blob([vcf], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = \`nfc-\${profile.fn || 'contact'}.txt\`;
      a.click();
      showToast('Đã tải file NFC .txt chuẩn NDEF!');
    };
  }`;

if (html.includes(oldDlJs)) {
  html = html.replace(oldDlJs, newDlJs);
  console.log('✅ Updated JS handler for btnDownloadNfc!');
} else {
  console.error('oldDlJs not found!');
}

fs.writeFileSync(p, html, 'utf8');
