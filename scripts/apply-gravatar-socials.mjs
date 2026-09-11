import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. Add CSS for Gravatar-style dynamic socials in EditSheet
const gravatarCss = `
    /* Gravatar-style Dynamic Social Links Manager */
    .gravatar-social-wrap {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 4px;
    }
    .gravatar-social-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .gravatar-social-item {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #06090e;
      border: 1px solid var(--surface-border);
      border-radius: 10px;
      padding: 6px 10px;
      transition: border-color 0.15s;
    }
    .gravatar-social-item:focus-within {
      border-color: var(--primary);
    }
    .gravatar-item-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .gravatar-item-input {
      flex: 1;
      background: transparent !important;
      border: none !important;
      color: var(--text);
      font-size: 0.84rem;
      outline: none !important;
      padding: 4px 6px;
      min-height: 32px !important;
    }
    .gravatar-item-remove {
      background: transparent;
      border: none;
      color: var(--muted);
      cursor: pointer;
      padding: 4px 6px;
      font-size: 1rem;
      line-height: 1;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
    }
    .gravatar-item-remove:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.15);
    }
    .gravatar-add-bar {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 4px;
    }
    .gravatar-select-service {
      flex: 1;
      background: #06090e;
      color: var(--text);
      border: 1px solid var(--surface-border);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 0.82rem;
      outline: none;
      cursor: pointer;
      min-height: 38px;
    }
    .gravatar-select-service:focus {
      border-color: var(--primary);
    }
    .btn-gravatar-add {
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: var(--primary);
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      min-height: 38px;
      transition: all 0.15s;
    }
    .btn-gravatar-add:hover {
      background: var(--primary);
      color: #070a12;
    }
`;

html = html.replace('</style>', `${gravatarCss}\n</style>`);

// 2. Replace hardcoded social inputs with the Gravatar dynamic container
const oldSocialFields = `      <div class="field-group">
        <label>Mạng xã hội & Kênh liên hệ (Tùy chọn - Tự động tạo icon trên thẻ)</label>
        <input type="text" id="inSocialFb" placeholder="🔵 Facebook (link / username)" aria-label="Facebook">
        <input type="text" id="inSocialZalo" placeholder="💬 Zalo (số điện thoại / link)" style="margin-top:6px;" aria-label="Zalo">
        <input type="text" id="inSocialInsta" placeholder="📸 Instagram (username / link)" style="margin-top:6px;" aria-label="Instagram">
        <input type="text" id="inSocialLi" placeholder="💼 LinkedIn (link / profile)" style="margin-top:6px;" aria-label="LinkedIn">
        <input type="text" id="inSocialYt" placeholder="▶️ YouTube (kênh / link)" style="margin-top:6px;" aria-label="YouTube">
        <input type="text" id="inSocialTiktok" placeholder="🎵 TikTok (@username)" style="margin-top:6px;" aria-label="TikTok">
        <input type="text" id="inSocialWa" placeholder="🟢 WhatsApp (số điện thoại / link)" style="margin-top:6px;" aria-label="WhatsApp">
        <input type="text" id="inSocialLine" placeholder="🟢 LINE ID / link" style="margin-top:6px;" aria-label="LINE">
      </div>`;

const newSocialFields = `      <div class="field-group">
        <label style="display:flex; justify-content:space-between; align-items:center;">
          <span>Mạng xã hội & Kênh liên kết</span>
          <span style="font-size:0.7rem; color:var(--primary);">Kiểu Gravatar • Thêm không giới hạn</span>
        </label>
        
        <div class="gravatar-social-wrap">
          <!-- Dynamic Social List Container -->
          <div class="gravatar-social-list" id="gravatarSocialList"></div>

          <!-- Add Service Bar -->
          <div class="gravatar-add-bar">
            <select class="gravatar-select-service" id="selectSocialService" aria-label="Chọn mạng xã hội muốn thêm">
              <option value="fb">Facebook</option>
              <option value="zalo">Zalo</option>
              <option value="insta">Instagram</option>
              <option value="li">LinkedIn</option>
              <option value="yt">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="wa">WhatsApp</option>
              <option value="line">LINE</option>
              <option value="x">X / Twitter</option>
              <option value="threads">Threads</option>
              <option value="gh">GitHub</option>
              <option value="web">Website Khác</option>
            </select>
            <button type="button" class="btn-gravatar-add" id="btnAddSocialService">
              <span>➕</span> <span>Thêm</span>
            </button>
          </div>
        </div>
      </div>`;

if (html.includes(oldSocialFields)) {
  html = html.replace(oldSocialFields, newSocialFields);
  console.log('✅ Replaced hardcoded inputs with Gravatar-style dynamic container!');
} else {
  console.error('oldSocialFields not found!');
}

// 3. Update openSheet() & btnSaveSheet logic for Gravatar dynamic list
const oldOpenSheetPopulate = `    // Check if user clicked "+ Tạo mới" to clear all fields
    const isCreateNew = (lastFocusedTrigger === btnOpenEdit);

    if (isCreateNew) {
      // Clear all fields for new card creation
      document.getElementById('inFn').value = '';
      document.getElementById('inTitle').value = '';
      document.getElementById('inTel').value = '';
      document.getElementById('inEmail').value = '';
      document.getElementById('inOrg').value = '';
      document.getElementById('inUrl').value = '';
      document.getElementById('inAdr').value = '';
      document.getElementById('inSlogan').value = '';

      document.getElementById('inSocialFb').value = '';
      document.getElementById('inSocialZalo').value = '';
      document.getElementById('inSocialInsta').value = '';
      document.getElementById('inSocialLi').value = '';
      document.getElementById('inSocialYt').value = '';
      document.getElementById('inSocialTiktok').value = '';
      document.getElementById('inSocialWa').value = '';
      document.getElementById('inSocialLine').value = '';
    } else {
      // Populate with existing profile
      document.getElementById('inFn').value = profile.fn || '';
      document.getElementById('inTitle').value = profile.title || '';
      document.getElementById('inTel').value = profile.tel || '';
      document.getElementById('inEmail').value = profile.email || '';
      document.getElementById('inOrg').value = profile.org || '';
      document.getElementById('inUrl').value = (profile.url || '').replace(/^https?:\\/\\//i, '');
      document.getElementById('inAdr').value = profile.adr || '';
      document.getElementById('inSlogan').value = profile.slogan || '';

      const socMap = {};
      if (Array.isArray(profile.socials)) {
        profile.socials.forEach(s => { if (s && s.type) socMap[s.type] = s.url || ''; });
      }
      document.getElementById('inSocialFb').value = socMap['fb'] || '';
      document.getElementById('inSocialZalo').value = socMap['zalo'] || '';
      document.getElementById('inSocialInsta').value = socMap['insta'] || '';
      document.getElementById('inSocialLi').value = socMap['li'] || '';
      document.getElementById('inSocialYt').value = socMap['yt'] || '';
      document.getElementById('inSocialTiktok').value = socMap['tiktok'] || '';
      document.getElementById('inSocialWa').value = socMap['wa'] || '';
      document.getElementById('inSocialLine').value = socMap['line'] || '';
    }`;

const newOpenSheetPopulate = `    // Check if user clicked "+ Tạo mới" to clear all fields
    const isCreateNew = (lastFocusedTrigger === btnOpenEdit);

    if (isCreateNew) {
      // Clear all fields for clean slate
      document.getElementById('inFn').value = '';
      document.getElementById('inTitle').value = '';
      document.getElementById('inTel').value = '';
      document.getElementById('inEmail').value = '';
      document.getElementById('inOrg').value = '';
      document.getElementById('inUrl').value = '';
      document.getElementById('inAdr').value = '';
      document.getElementById('inSlogan').value = '';

      renderGravatarSocialList([]);
    } else {
      // Populate with existing profile
      document.getElementById('inFn').value = profile.fn || '';
      document.getElementById('inTitle').value = profile.title || '';
      document.getElementById('inTel').value = profile.tel || '';
      document.getElementById('inEmail').value = profile.email || '';
      document.getElementById('inOrg').value = profile.org || '';
      document.getElementById('inUrl').value = (profile.url || '').replace(/^https?:\\/\\//i, '');
      document.getElementById('inAdr').value = profile.adr || '';
      document.getElementById('inSlogan').value = profile.slogan || '';

      renderGravatarSocialList(Array.isArray(profile.socials) ? profile.socials : []);
    }`;

if (html.includes(oldOpenSheetPopulate)) {
  html = html.replace(oldOpenSheetPopulate, newOpenSheetPopulate);
  console.log('✅ Updated openSheet to call renderGravatarSocialList!');
} else {
  console.error('oldOpenSheetPopulate not found!');
}

// 4. In btnSaveSheet: read from dynamic gravatar list
const oldSaveSheetLogic = `    // Read and clean all 8 Social inputs
    const newSocials = [];
    const readSocial = (type, elemId, prefix) => {
      const val = (document.getElementById(elemId) ? document.getElementById(elemId).value : '').trim();
      if (!val) return;
      let finalUrl = val;
      if (prefix && !val.startsWith('http://') && !val.startsWith('https://')) {
        finalUrl = prefix + val.replace(/^@/, '');
      }
      newSocials.push({ type, url: finalUrl });
    };

    readSocial('fb', 'inSocialFb', 'https://facebook.com/');
    readSocial('zalo', 'inSocialZalo', 'https://zalo.me/');
    readSocial('insta', 'inSocialInsta', 'https://instagram.com/');
    readSocial('li', 'inSocialLi', 'https://linkedin.com/in/');
    readSocial('yt', 'inSocialYt', 'https://youtube.com/');
    readSocial('tiktok', 'inSocialTiktok', 'https://tiktok.com/@');
    readSocial('wa', 'inSocialWa', 'https://wa.me/');
    readSocial('line', 'inSocialLine', 'https://line.me/R/ti/p/');

    profile.socials = newSocials;`;

const newSaveSheetLogic = `    // Read Gravatar dynamic social links
    const newSocials = [];
    const socialItems = document.querySelectorAll('#gravatarSocialList .gravatar-social-item');
    const prefixes = {
      fb: 'https://facebook.com/',
      zalo: 'https://zalo.me/',
      insta: 'https://instagram.com/',
      li: 'https://linkedin.com/in/',
      yt: 'https://youtube.com/',
      tiktok: 'https://tiktok.com/@',
      wa: 'https://wa.me/',
      line: 'https://line.me/R/ti/p/',
      x: 'https://x.com/',
      threads: 'https://threads.net/@',
      gh: 'https://github.com/',
      web: 'https://'
    };

    socialItems.forEach(item => {
      const type = item.getAttribute('data-type');
      const input = item.querySelector('.gravatar-item-input');
      const val = input ? input.value.trim() : '';
      if (!val) return;

      let finalUrl = val;
      const prefix = prefixes[type] || 'https://';
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        finalUrl = prefix + val.replace(/^@/, '');
      }
      newSocials.push({ type, url: finalUrl });
    });

    profile.socials = newSocials;`;

if (html.includes(oldSaveSheetLogic)) {
  html = html.replace(oldSaveSheetLogic, newSaveSheetLogic);
  console.log('✅ Updated saveSheet to read from dynamic Gravatar items!');
} else {
  console.error('oldSaveSheetLogic not found!');
}

// 5. Add renderGravatarSocialList helper functions in JS
const gravatarHelperJs = `
  // Gravatar-style Dynamic Socials Management
  const gravatarList = document.getElementById('gravatarSocialList');
  const selectService = document.getElementById('selectSocialService');
  const btnAddService = document.getElementById('btnAddSocialService');

  function createGravatarRow(type, urlVal = '') {
    const brand = BRAND_ICONS[type] || BRAND_ICONS['web'];
    const row = document.createElement('div');
    row.className = 'gravatar-social-item';
    row.setAttribute('data-type', type);

    const iconDiv = document.createElement('div');
    iconDiv.className = 'gravatar-item-icon';
    iconDiv.style.background = brand.bg;
    iconDiv.style.color = brand.color;
    iconDiv.innerHTML = brand.svg;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'gravatar-item-input';
    input.placeholder = \`\${brand.name} username hoặc link...\`;
    input.value = urlVal;
    input.setAttribute('aria-label', \`Liên kết \${brand.name}\`);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'gravatar-item-remove';
    removeBtn.innerHTML = '✕';
    removeBtn.title = 'Xóa mục này';
    removeBtn.onclick = () => row.remove();

    row.appendChild(iconDiv);
    row.appendChild(input);
    row.appendChild(removeBtn);
    return row;
  }

  function renderGravatarSocialList(socialArray) {
    if (!gravatarList) return;
    gravatarList.innerHTML = '';
    if (Array.isArray(socialArray)) {
      socialArray.forEach(s => {
        if (s && s.type) {
          gravatarList.appendChild(createGravatarRow(s.type, s.url || ''));
        }
      });
    }
  }

  if (btnAddService && selectService) {
    btnAddService.onclick = () => {
      const type = selectService.value;
      const row = createGravatarRow(type, '');
      gravatarList.appendChild(row);
      const input = row.querySelector('.gravatar-item-input');
      if (input) input.focus();
    };
  }
`;

// Insert helper JS right before function openSheet()
html = html.replace('function openSheet() {', `${gravatarHelperJs}\n  function openSheet() {`);

fs.writeFileSync(p, html, 'utf8');
console.log('Done Gravatar dynamic socials implementation!');
