import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. In QR modal HTML: change button ID and label
const oldNfcBtnHtml = `<button class="btn-qr-action" id="btnDownloadNfc" title="Tải file dữ liệu vCard để ghi vào thẻ thông minh NFC">📡 Tải NFC .txt</button>`;

const newNfcBtnHtml = `<button class="btn-qr-action" id="btnCopyToNfc" title="Sao chép dữ liệu vCard NDEF hoặc chạm ghi vào thẻ NFC">📲 <span id="txtCopyToNfc">Sao Chép Vào NFC</span></button>`;

if (html.includes(oldNfcBtnHtml)) {
  html = html.replace(oldNfcBtnHtml, newNfcBtnHtml);
  console.log('✅ Updated QR modal button to btnCopyToNfc in HTML!');
} else {
  console.error('oldNfcBtnHtml not found!');
}

// 2. In JS: update handler with Clipboard + Web NFC (NDEFReader) + download fallback
const oldNfcJs = `  const btnDownloadNfc = document.getElementById('btnDownloadNfc');
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

const newNfcJs = `  const btnCopyToNfc = document.getElementById('btnCopyToNfc');
  if (btnCopyToNfc) {
    btnCopyToNfc.onclick = async () => {
      const vcf = buildVCardString();
      let copied = false;

      // 1. Copy to Clipboard (UTF-8 NDEF Text for NFC Tools / TagWriter)
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(vcf);
          copied = true;
        }
      } catch (e) {
        console.warn('Clipboard write failed:', e);
      }

      // 2. Try Web NFC API if device supports native NFC write
      let nfcPrompted = false;
      if ('NDEFReader' in window) {
        try {
          const ndef = new NDEFReader();
          showToast('Đang chờ chạm thẻ NFC để ghi...');
          await ndef.write({
            records: [
              { recordType: "mime", mediaType: "text/vcard", data: new TextEncoder().encode(vcf) }
            ]
          });
          showToast('✅ Đã ghi thành công vào thẻ NFC!');
          nfcPrompted = true;
        } catch (nfcErr) {
          console.warn('Web NFC direct write failed or cancelled:', nfcErr);
        }
      }

      if (!nfcPrompted) {
        // Download backup txt file as well so user has file on hand
        const blob = new Blob([vcf], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = \`nfc-\${profile.fn || 'contact'}.txt\`;
        a.click();
        showToast(copied ? '✅ Đã sao chép vào bộ nhớ & tải file NFC!' : '✅ Đã tải file dữ liệu NFC!');
      }
    };
  }`;

if (html.includes(oldNfcJs)) {
  html = html.replace(oldNfcJs, newNfcJs);
  console.log('✅ Updated JS handler for btnCopyToNfc with Clipboard + Web NFC!');
} else {
  console.error('oldNfcJs not found!');
}

fs.writeFileSync(p, html, 'utf8');
