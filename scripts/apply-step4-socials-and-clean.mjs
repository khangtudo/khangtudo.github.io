import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. In BRAND_ICONS: add 'wa' and 'line'
const oldBrandIconsAnchor = `  web: {
    name: 'Website',
    bg: '#334155',
    color: '#fff',
    svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 2.062c-2.316.516-4.28 2.658-5.016 5.938h10.532c-.736-3.28-2.7-5.422-5.016-5.938v-.001zm-2.094.625C6.012 3.844 4.07 5.688 3.125 8h3.938c.36-1.953.968-3.797 1.594-5.313zm6.688 0c.625 1.516 1.234 3.36 1.594 5.313h3.938c-.945-2.313-2.887-4.156-5.532-5.313zM2.375 10c-.234.64-.375 1.305-.375 2s.14 1.36.375 2h4.594c-.062-.64-.094-1.32-.094-2s.03-1.36.094-2H2.375zm6.625 0c-.063.64-.125 1.32-.125 2s.062 1.36.125 2h5.999c.063-.64.126-1.32.126-2s-.063-1.36-.126-2H9zm8.031 0c.063.64.094 1.32.094 2s-.031 1.36-.094 2h4.594c.234-.64.375-1.305.375-2s-.14-1.36-.375-2h-4.594zm-9.063 6c.36 1.953.969 3.797 1.594 5.313-2.645-1.157-4.586-3-5.531-5.313h3.937zm2.469.001h4.938c-.736 3.28-2.7 5.422-5.016 5.938v.001c-2.316-.516-4.28-2.658-5.016-5.938h5.094zm6.969 0h3.938c-.945 2.313-2.887 4.156-5.531 5.313.625-1.516 1.234-3.36 1.594-5.313z"/></svg>'
  }`;

const newBrandIcons = `  web: {
    name: 'Website',
    bg: '#334155',
    color: '#fff',
    svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 2.062c-2.316.516-4.28 2.658-5.016 5.938h10.532c-.736-3.28-2.7-5.422-5.016-5.938v-.001zm-2.094.625C6.012 3.844 4.07 5.688 3.125 8h3.938c.36-1.953.968-3.797 1.594-5.313zm6.688 0c.625 1.516 1.234 3.36 1.594 5.313h3.938c-.945-2.313-2.887-4.156-5.532-5.313zM2.375 10c-.234.64-.375 1.305-.375 2s.14 1.36.375 2h4.594c-.062-.64-.094-1.32-.094-2s.03-1.36.094-2H2.375zm6.625 0c-.063.64-.125 1.32-.125 2s.062 1.36.125 2h5.999c.063-.64.126-1.32.126-2s-.063-1.36-.126-2H9zm8.031 0c.063.64.094 1.32.094 2s-.031 1.36-.094 2h4.594c.234-.64.375-1.305.375-2s-.14-1.36-.375-2h-4.594zm-9.063 6c.36 1.953.969 3.797 1.594 5.313-2.645-1.157-4.586-3-5.531-5.313h3.937zm2.469.001h4.938c-.736 3.28-2.7 5.422-5.016 5.938v.001c-2.316-.516-4.28-2.658-5.016-5.938h5.094zm6.969 0h3.938c-.945 2.313-2.887 4.156-5.531 5.313.625-1.516 1.234-3.36 1.594-5.313z"/></svg>'
  },
  wa: {
    name: 'WhatsApp',
    bg: '#25d366',
    color: '#fff',
    svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>'
  },
  line: {
    name: 'LINE',
    bg: '#00c300',
    color: '#fff',
    svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.365 9.864c0-4.043-4.19-7.332-9.365-7.332-5.176 0-9.365 3.289-9.365 7.332 0 3.618 3.279 6.666 7.704 7.214.3.065.707.199.81.455.093.23.061.59.03.822-.047.332-.234 1.332-.26 1.547-.04.332-.187 1.302.569.712.756-.59 4.084-2.404 5.571-4.118 1.488-1.714 4.306-3.834 4.306-6.632zm-12.709 2.22h-1.674a.465.465 0 0 1-.465-.465v-3.535c0-.257.208-.465.465-.465h1.674c.257 0 .465.208.465.465 0 .257-.208.465-.465.465h-1.209v1.07h1.209c.257 0 .465.208.465.465 0 .257-.208.465-.465.465h-1.209v1.07h1.209c.257 0 .465.208.465.465 0 .257-.208.465-.465.465zm2.884 0a.465.465 0 0 1-.465-.465v-3.535c0-.257.208-.465.465-.465s.465.208.465.465v3.535a.465.465 0 0 1-.465.465zm3.768 0a.465.465 0 0 1-.397-.225l-2.046-2.884v2.644a.465.465 0 0 1-.93 0v-3.535a.465.465 0 0 1 .397-.225.465.465 0 0 1 .397.225l2.046 2.884v-2.644a.465.465 0 0 1 .93 0v3.535a.465.465 0 0 1-.397.225zm3.488 0h-1.674a.465.465 0 0 1-.465-.465v-3.535c0-.257.208-.465.465-.465h1.674c.257 0 .465.208.465.465 0 .257-.208.465-.465.465h-1.209v1.07h1.209c.257 0 .465.208.465.465 0 .257-.208.465-.465.465h-1.209v1.07h1.209c.257 0 .465.208.465.465 0 .257-.208.465-.465.465z"/></svg>'
  }`;

if (html.includes(oldBrandIconsAnchor)) {
  html = html.replace(oldBrandIconsAnchor, newBrandIcons);
  console.log('✅ Added WhatsApp and LINE to BRAND_ICONS!');
} else {
  console.error('oldBrandIconsAnchor not found!');
}

// 2. In editSheet HTML: expand social inputs to 8 platforms
const oldSocialInputs = `<div class="field-group">
        <label>Mạng xã hội (Facebook, Zalo, Instagram...)</label>
        <input type="text" id="inSocialFb" placeholder="Facebook username / link" aria-label="Facebook">
        <input type="text" id="inSocialZalo" placeholder="Zalo phone / link" style="margin-top:6px;" aria-label="Zalo">
        <input type="text" id="inSocialInsta" placeholder="Instagram username" style="margin-top:6px;" aria-label="Instagram">
      </div>`;

const newSocialInputs = `<div class="field-group">
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

if (html.includes(oldSocialInputs)) {
  html = html.replace(oldSocialInputs, newSocialInputs);
  console.log('✅ Expanded editSheet social inputs to 8 platforms!');
} else {
  console.error('oldSocialInputs not found!');
}

// 3. In openSheet(): populate all 8 social inputs or CLEAR ALL if createNewRequested
const oldOpenSheetPopulate = `    // Populate form inputs
    document.getElementById('inFn').value = profile.fn || '';
    document.getElementById('inTitle').value = profile.title || '';
    document.getElementById('inTel').value = profile.tel || '';
    document.getElementById('inEmail').value = profile.email || '';
    document.getElementById('inOrg').value = profile.org || '';
    document.getElementById('inUrl').value = (profile.url || '').replace(/^https?:\\/\\//i, '');
    document.getElementById('inAdr').value = profile.adr || '';
    document.getElementById('inSlogan').value = profile.slogan || '';`;

const newOpenSheetPopulate = `    // Check if user clicked "+ Tạo mới" to clear all fields
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

if (html.includes(oldOpenSheetPopulate)) {
  html = html.replace(oldOpenSheetPopulate, newOpenSheetPopulate);
  console.log('✅ Updated openSheet with clean slate on create-new and full 8-social populate!');
} else {
  console.error('oldOpenSheetPopulate not found!');
}

// 4. In btnSaveSheet.onclick: read all 8 social inputs and save to profile.socials
const oldSaveSheetLogic = `    profile.adr = document.getElementById('inAdr').value.trim();
    profile.slogan = document.getElementById('inSlogan').value.trim();

    closeSheet();
    renderCard();`;

const newSaveSheetLogic = `    profile.adr = document.getElementById('inAdr').value.trim();
    profile.slogan = document.getElementById('inSlogan').value.trim();

    // Read and clean all 8 Social inputs
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

    profile.socials = newSocials;

    closeSheet();
    renderCard();`;

if (html.includes(oldSaveSheetLogic)) {
  html = html.replace(oldSaveSheetLogic, newSaveSheetLogic);
  console.log('✅ Updated btnSaveSheet.onclick to save and sync 8 socials!');
} else {
  console.error('oldSaveSheetLogic not found!');
}

fs.writeFileSync(p, html, 'utf8');
