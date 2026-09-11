import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Replace openQr function
const oldOpenQr = `  // QR Modal with Focus Trap
  const qrModal = document.getElementById('qrModal');
  const qrcodeDiv = document.getElementById('qrcode');
  function openQr() {
    lastFocusedTrigger = document.getElementById('btnOpenQrDirect') || document.activeElement;
    qrcodeDiv.innerHTML = '';
    new QRCode(qrcodeDiv, { text: buildVCardString(), width: 190, height: 190, correctLevel: QRCode.CorrectLevel.M });
    qrModal.classList.add('active');
    mainAppShell.setAttribute('inert', 'true');
    const closeBtn = document.getElementById('btnCloseQr');
    if (closeBtn) closeBtn.focus();
  }`;

const newOpenQr = `  // QR Modal with Focus Trap
  const qrModal = document.getElementById('qrModal');
  const qrcodeDiv = document.getElementById('qrcode');
  function openQr() {
    lastFocusedTrigger = document.getElementById('btnOpenQrDirect') || document.activeElement;
    qrcodeDiv.innerHTML = '';
    const vcardText = buildVCardString();

    try {
      if (typeof QRCode !== 'undefined') {
        if (typeof QRCode.toCanvas === 'function') {
          const canvas = document.createElement('canvas');
          QRCode.toCanvas(canvas, vcardText, { width: 190, margin: 1 });
          qrcodeDiv.appendChild(canvas);
        } else if (typeof QRCode === 'function') {
          new QRCode(qrcodeDiv, { text: vcardText, width: 190, height: 190 });
        }
      }
    } catch (e) {
      console.error('QR Render Error:', e);
    }

    qrModal.classList.add('active');
    mainAppShell.setAttribute('inert', 'true');
    const closeBtn = document.getElementById('btnCloseQr');
    if (closeBtn) closeBtn.focus();
  }`;

if (html.includes(oldOpenQr)) {
  html = html.replace(oldOpenQr, newOpenQr);
  console.log('✅ Replaced openQr successfully!');
} else {
  console.error('oldOpenQr not found!');
}

fs.writeFileSync(p, html, 'utf8');
