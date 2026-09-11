import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Lưu Danh Bạ (remove .vcf)
// in HTML:
const oldDockSave = `<button class="dock-btn dock-btn-primary" id="btnSaveVcf" aria-label="Lưu danh bạ vCard vào máy">
        <span>💾</span> <span id="txtSaveVcf">Lưu Danh Bạ .vcf</span>
      </button>`;

const newDockSave = `<button class="dock-btn dock-btn-primary" id="btnSaveVcf" aria-label="Lưu danh bạ vCard vào máy">
        <span>💾</span> <span id="txtSaveVcf">Lưu Danh Bạ</span>
      </button>`;

if (html.includes(oldDockSave)) {
  html = html.replace(oldDockSave, newDockSave);
  console.log('✅ Updated btnSaveVcf HTML label to "Lưu Danh Bạ"!');
} else {
  console.error('oldDockSave not found!');
}

// in updateI18n():
const oldUpdateSave = `if (elSaveVcf) elSaveVcf.textContent = (getTranslation(currentLang, 'saveVcf') || 'Lưu Danh Bạ') + ' .vcf';`;
const newUpdateSave = `if (elSaveVcf) elSaveVcf.textContent = getTranslation(currentLang, 'saveVcf') || 'Lưu Danh Bạ';`;

if (html.includes(oldUpdateSave)) {
  html = html.replace(oldUpdateSave, newUpdateSave);
  console.log('✅ Updated updateI18n elSaveVcf to "Lưu Danh Bạ"!');
} else {
  console.error('oldUpdateSave not found!');
}

// 2. Profile defaults: FB /minhtamprolabsg, Zalo /minhtamprolab, Address & Map link
const oldProfileObj = `  let profile = {
    fn: "Phan Mạnh Khang",
    org: "Minh Tam Prolab",
    title: "CGO - Giám Đốc Tăng Trưởng",
    tel: "+84937550989",
    email: "manhkhang@minhtamprolab.com.vn",
    url: "https://minhtamprolab.com.vn",
    adr: "40A-40B Lý Tự Trọng, Phường Bến Nghé, Quận 1, TPHCM",
    slogan: "Professional Digital Laboratory",
    orientation: "vertical",
    socials: [
      { type: "fb", url: "https://facebook.com/phanmanhkhang" },
      { type: "zalo", url: "https://zalo.me/0937550989" },
      { type: "insta", url: "https://instagram.com/minhtamprolab" },
      { type: "li", url: "https://linkedin.com/in/phanmanhkhang" }
    ]
  };`;

const newProfileObj = `  let profile = {
    fn: "Phan Mạnh Khang",
    org: "Minh Tam Prolab",
    title: "CGO - Giám Đốc Tăng Trưởng",
    tel: "+84937550989",
    email: "manhkhang@minhtamprolab.com.vn",
    url: "https://minhtamprolab.com.vn",
    adr: "40A-40B Lý Tự Trọng, Phường Sài Gòn, TPHCM",
    mapUrl: "https://maps.app.goo.gl/o9mcM5eqe9qPH7f1A",
    slogan: "Professional Digital Laboratory",
    orientation: "vertical",
    socials: [
      { type: "fb", url: "https://facebook.com/minhtamprolabsg" },
      { type: "zalo", url: "https://zalo.me/minhtamprolab" },
      { type: "insta", url: "https://instagram.com/minhtamprolab" },
      { type: "li", url: "https://linkedin.com/in/phanmanhkhang" }
    ]
  };`;

if (html.includes(oldProfileObj)) {
  html = html.replace(oldProfileObj, newProfileObj);
  console.log('✅ Updated default profile with minhtamprolabsg FB, minhtamprolab Zalo, exact address & mapUrl!');
} else {
  console.error('oldProfileObj not found!');
}

// 3. Remove pin icon 📍 in cardAdrLink HTML and update initial text
const oldAdrLinkHtml = `<a class="address" id="cardAdrLink" href="#" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit; display:flex; align-items:center; justify-content:center; gap:4px; margin-top:4px;" title="Bấm để mở chỉ đường Google Maps">
                <span>📍</span> <span id="cardAdr">40A-40B Lý Tự Trọng, Phường Bến Nghé, Quận 1, TPHCM</span>
              </a>`;

const newAdrLinkHtml = `<a class="address" id="cardAdrLink" href="https://maps.app.goo.gl/o9mcM5eqe9qPH7f1A" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit; display:block; text-align:center; margin-top:4px;" title="Bấm để mở chỉ đường Google Maps">
                <span id="cardAdr">40A-40B Lý Tự Trọng, Phường Sài Gòn, TPHCM</span>
              </a>`;

if (html.includes(oldAdrLinkHtml)) {
  html = html.replace(oldAdrLinkHtml, newAdrLinkHtml);
  console.log('✅ Removed pin icon from cardAdrLink and set exact address text!');
} else {
  console.error('oldAdrLinkHtml not found!');
}

// 4. In renderCard(): update Google Maps link to prefer mapUrl or specific short link
const oldRenderAdrLogic = `    const elAdr = document.getElementById('cardAdr');
    if (elAdr) elAdr.textContent = profile.adr || '';
    const elAdrLink = document.getElementById('cardAdrLink');
    if (elAdrLink) {
      if (profile.adr && profile.adr.trim()) {
        elAdrLink.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(profile.adr.trim());
        elAdrLink.style.pointerEvents = 'auto';
        elAdrLink.setAttribute('aria-label', 'Mở chỉ đường Google Maps tới: ' + profile.adr);
      } else {
        elAdrLink.removeAttribute('href');
        elAdrLink.style.pointerEvents = 'none';
      }
    }`;

const newRenderAdrLogic = `    const elAdr = document.getElementById('cardAdr');
    if (elAdr) elAdr.textContent = profile.adr || '';
    const elAdrLink = document.getElementById('cardAdrLink');
    if (elAdrLink) {
      if (profile.mapUrl) {
        elAdrLink.href = profile.mapUrl;
        elAdrLink.style.pointerEvents = 'auto';
        elAdrLink.setAttribute('aria-label', 'Mở chỉ đường Google Maps tới: ' + (profile.adr || ''));
      } else if (profile.adr && profile.adr.includes('40A-40B Lý Tự Trọng')) {
        elAdrLink.href = 'https://maps.app.goo.gl/o9mcM5eqe9qPH7f1A';
        elAdrLink.style.pointerEvents = 'auto';
        elAdrLink.setAttribute('aria-label', 'Mở chỉ đường Google Maps tới: ' + profile.adr);
      } else if (profile.adr && profile.adr.trim()) {
        elAdrLink.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(profile.adr.trim());
        elAdrLink.style.pointerEvents = 'auto';
        elAdrLink.setAttribute('aria-label', 'Mở chỉ đường Google Maps tới: ' + profile.adr);
      } else {
        elAdrLink.removeAttribute('href');
        elAdrLink.style.pointerEvents = 'none';
      }
    }`;

if (html.includes(oldRenderAdrLogic)) {
  html = html.replace(oldRenderAdrLogic, newRenderAdrLogic);
  console.log('✅ Updated renderCard address hyperlink logic!');
} else {
  console.error('oldRenderAdrLogic not found!');
}

fs.writeFileSync(p, html, 'utf8');
console.log('Done 5 refinements!');
