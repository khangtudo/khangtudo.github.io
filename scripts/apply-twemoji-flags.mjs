import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Country code map for Twemoji
const countryCodeMap = {
  vi: 'vn',
  en: 'us',
  ja: 'jp',
  ko: 'kr',
  'zh-CN': 'cn',
  'zh-TW': 'tw',
  fr: 'fr',
  de: 'de',
  es: 'es',
  it: 'it',
  pt: 'pt',
  'pt-BR': 'br',
  id: 'id',
  nl: 'nl',
  ru: 'ru',
  ar: 'sa',
  hi: 'in',
  th: 'th',
  tr: 'tr',
  pl: 'pl',
  sv: 'se',
  da: 'dk',
  no: 'no',
  ro: 'ro',
  hu: 'hu',
  el: 'gr',
  he: 'il'
};

const oldFlagLoop = `  Object.keys(I18N).forEach((code, idx) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'flag-item';
    item.setAttribute('role', 'menuitem');
    item.setAttribute('tabindex', '-1');
    item.innerHTML = \`<span>\${I18N[code].flag}</span> <span>\${I18N[code].name}</span>\`;
    item.onclick = () => {
      currentLang = code;
      currentFlag.textContent = I18N[code].flag;
      closeFlagMenu();
      updateI18n();
      flagBtn.focus();
    };
    flagMenu.appendChild(item);
  });`;

const newFlagCode = `  function getTwemojiFlagHtml(langCode) {
    const ccMap = ${JSON.stringify(countryCodeMap)};
    const cc = (ccMap[langCode] || 'vn').toLowerCase();
    const hex = [...cc].map(c => (0x1F1E6 + c.charCodeAt(0) - 97).toString(16)).join('-');
    const url = \`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/\${hex}.svg\`;
    const fallbackEmoji = (I18N[langCode] && I18N[langCode].flag) || '🌐';
    return \`<img class="flag-img" src="\${url}" alt="\${fallbackEmoji}" onerror="this.outerHTML='\${fallbackEmoji}'">\`;
  }

  function renderCurrentFlag(code) {
    currentFlag.innerHTML = getTwemojiFlagHtml(code);
  }

  // Initialize flag button icon
  renderCurrentFlag(currentLang);

  Object.keys(I18N).forEach((code, idx) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'flag-item';
    item.setAttribute('role', 'menuitem');
    item.setAttribute('tabindex', '-1');
    item.innerHTML = \`<span>\${getTwemojiFlagHtml(code)}</span> <span>\${I18N[code].name}</span>\`;
    item.onclick = () => {
      currentLang = code;
      renderCurrentFlag(code);
      closeFlagMenu();
      updateI18n();
      flagBtn.focus();
    };
    flagMenu.appendChild(item);
  });`;

if (html.includes(oldFlagLoop)) {
  html = html.replace(oldFlagLoop, newFlagCode);
  console.log('✅ Replaced flagLoop with cross-platform Twemoji SVG flags!');
} else {
  console.error('oldFlagLoop not found!');
}

fs.writeFileSync(p, html, 'utf8');
