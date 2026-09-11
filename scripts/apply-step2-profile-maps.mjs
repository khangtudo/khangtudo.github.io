import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. In default profile object
const oldProfile = `  let profile = {
    fn: "Phan Mạnh Khang",
    org: "Minh Tam Prolab",
    title: "Kỹ Thuật Viên Trưởng",
    tel: "+84901112233",
    email: "khang@minhtamprolab.com.vn",
    url: "https://minhtamprolab.com.vn",
    adr: "40A-40B Lý Tự Trọng, Phường Sài Gòn, TPHCM",
    slogan: "Professional Digital Laboratory",
    orientation: "vertical",
    socials: [
      { type: "fb", url: "https://facebook.com/phanmanhkhang" },
      { type: "zalo", url: "https://zalo.me/0901112233" },
      { type: "insta", url: "https://instagram.com/minhtamprolab" }
    ]
  };`;

const newProfile = `  let profile = {
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

if (html.includes(oldProfile)) {
  html = html.replace(oldProfile, newProfile);
  console.log('✅ Updated default profile with real contact info!');
} else {
  console.error('oldProfile not found!');
}

// 2. In card HTML: change <p class="address" id="cardAdr"> to a clickable link
const oldCardAdr = `<p class="address" id="cardAdr">40A-40B Lý Tự Trọng, Phường Sài Gòn, TPHCM</p>`;
const newCardAdr = `<a class="address" id="cardAdrLink" href="#" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit; display:flex; align-items:center; justify-content:center; gap:4px; margin-top:4px;" title="Bấm để mở chỉ đường Google Maps">
                <span>📍</span> <span id="cardAdr">40A-40B Lý Tự Trọng, Phường Bến Nghé, Quận 1, TPHCM</span>
              </a>`;

if (html.includes(oldCardAdr)) {
  html = html.replace(oldCardAdr, newCardAdr);
  console.log('✅ Replaced cardAdr with Google Maps link in HTML!');
} else {
  console.error('oldCardAdr not found!');
}

// 3. In renderCard(): update Google Maps link dynamically based on address
const oldRenderAdr = `document.getElementById('cardAdr').textContent = profile.adr || '';`;
const newRenderAdr = `const elAdr = document.getElementById('cardAdr');
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

if (html.includes(oldRenderAdr)) {
  html = html.replace(oldRenderAdr, newRenderAdr);
  console.log('✅ Updated renderCard to set Google Maps link dynamically!');
} else {
  console.error('oldRenderAdr not found!');
}

// 4. In identity-rail (Desktop Left): Change Badge and Hero Description
const oldBadgeAndHero = `<div class="badge-chip">⚡ SPATIAL AR VCARD</div>
        <p id="txtHeroSlogan" style="font-size:1.05rem; font-weight:500; color:#cbd5e1; line-height:1.6;">
          Smart AR VCard & Offline QR.<br>
          <span style="font-size:0.88rem; color:var(--muted);">Một chạm lưu danh bạ không mạng, mở rộng không gian 3D AR đa chiều.</span>
        </p>`;

const newBadgeAndHero = `<div class="badge-chip">⚡ DANH THIẾP 3D THÔNG MINH</div>
        <p id="txtHeroSlogan" style="font-size:1.05rem; font-weight:600; color:#cbd5e1; line-height:1.6;">
          Mã QR danh bạ không cần mạng, trải nghiệm mở rộng không gian 3D AR đa chiều.
        </p>`;

if (html.includes(oldBadgeAndHero)) {
  html = html.replace(oldBadgeAndHero, newBadgeAndHero);
  console.log('✅ Replaced Badge and Hero Description in identity-rail!');
} else {
  console.error('oldBadgeAndHero not found!');
}

fs.writeFileSync(p, html, 'utf8');
