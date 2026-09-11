import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. In updateI18n()
const oldUpdateI18n = `  function updateI18n() {
    const createNewTxt = getTranslation(currentLang, 'createNew') || '+ Tạo mới';
    document.getElementById('txtCreateNew').textContent = createNewTxt;
    document.getElementById('txtSaveVcf').textContent = getTranslation(currentLang, 'saveVcf') || 'Lưu Danh Bạ';
    document.getElementById('txtViewAr').textContent = getTranslation(currentLang, 'viewAr') || 'Xem AR';
    document.getElementById('txtMore').textContent = getTranslation(currentLang, 'more') || 'Thêm';
    document.getElementById('txtFlipTag').textContent = (getTranslation(currentLang, 'flipCard') || 'Chạm để lật thẻ') + ' 🔄';
  }`;

const newUpdateI18n = `  function updateI18n() {
    const createNewTxt = getTranslation(currentLang, 'createNew') || '+ Tạo mới';
    const elCreateNew = document.getElementById('txtCreateNew');
    if (elCreateNew) elCreateNew.textContent = createNewTxt;
    
    const elSaveVcf = document.getElementById('txtSaveVcf');
    if (elSaveVcf) elSaveVcf.textContent = (getTranslation(currentLang, 'saveVcf') || 'Lưu Danh Bạ') + ' .vcf';
    
    const elViewAr = document.getElementById('txtViewAr');
    if (elViewAr) elViewAr.textContent = (getTranslation(currentLang, 'viewAr') || 'Xem AR') + ' Card';

    const elViewQr = document.getElementById('txtViewQr');
    if (elViewQr) elViewQr.textContent = 'Xem QR Offline';

    const elFlipBelow = document.getElementById('txtFlipBelow');
    if (elFlipBelow) elFlipBelow.textContent = getTranslation(currentLang, 'flipCard') || 'Chạm để lật thẻ 3D';
  }`;

if (html.includes(oldUpdateI18n)) {
  html = html.replace(oldUpdateI18n, newUpdateI18n);
  console.log('✅ Updated updateI18n cleanly!');
} else {
  console.error('oldUpdateI18n not found!');
}

// 2. In openQr() and QR button handlers
const oldQrCode = `  // QR Modal with Focus Trap
  const qrModal = document.getElementById('qrModal');
  const qrcodeDiv = document.getElementById('qrcode');
  function openQr() {
    lastFocusedTrigger = document.getElementById('btnMenuQr');
    qrcodeDiv.innerHTML = '';
    new QRCode(qrcodeDiv, { text: buildVCardString(), width: 190, height: 190, correctLevel: QRCode.CorrectLevel.M });
    qrModal.classList.add('active');
    mainAppShell.setAttribute('inert', 'true');
    document.getElementById('btnCloseQr').focus();
  }
  function closeQr() {
    qrModal.classList.remove('active');
    mainAppShell.removeAttribute('inert');
    if (lastFocusedTrigger) { lastFocusedTrigger.focus(); }
  }
  document.getElementById('btnMenuQr').onclick = openQr;
  document.getElementById('btnCloseQr').onclick = closeQr;`;

const newQrCode = `  // QR Modal with Focus Trap
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
  }
  function closeQr() {
    qrModal.classList.remove('active');
    mainAppShell.removeAttribute('inert');
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  }
  const btnCloseQr = document.getElementById('btnCloseQr');
  if (btnCloseQr) btnCloseQr.onclick = closeQr;`;

if (html.includes(oldQrCode)) {
  html = html.replace(oldQrCode, newQrCode);
  console.log('✅ Cleaned up QR modal code!');
} else {
  console.error('oldQrCode not found!');
}

fs.writeFileSync(p, html, 'utf8');
