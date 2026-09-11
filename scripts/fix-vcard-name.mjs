import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

const oldBuildVCard = `  function buildVCardString() {
    const lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      \`FN;CHARSET=UTF-8:\${profile.fn || 'Contact'}\`,
      \`N;CHARSET=UTF-8:;;;;\`
    ];
    if (profile.org) lines.push(\`ORG;CHARSET=UTF-8:\${profile.org}\`);
    if (profile.title) lines.push(\`TITLE;CHARSET=UTF-8:\${profile.title}\`);
    if (profile.tel) lines.push(\`TEL;TYPE=CELL:\${profile.tel}\`);
    if (profile.email) lines.push(\`EMAIL;TYPE=INTERNET:\${profile.email}\`);
    if (profile.adr) lines.push(\`ADR;TYPE=WORK;CHARSET=UTF-8:;;\${profile.adr};;;;\`);
    lines.push(\`URL:\${profile.url || 'https://inid.me'}\`);
    lines.push('END:VCARD\\r\\n');
    return lines.join('\\r\\n');
  }`;

const newBuildVCard = `  function buildVCardString() {
    const rawFn = (profile.fn || 'Liên hệ').trim();
    const parts = rawFn.split(/\\s+/);
    let lastName = '';
    let firstName = '';
    let middleName = '';

    if (parts.length === 1) {
      firstName = parts[0];
    } else if (parts.length === 2) {
      lastName = parts[0];
      firstName = parts[1];
    } else {
      lastName = parts[0];
      firstName = parts[parts.length - 1];
      middleName = parts.slice(1, parts.length - 1).join(' ');
    }

    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'PRODID:-//inid.me//Smart AR vCard//VN',
      \`FN;CHARSET=UTF-8:\${rawFn}\`,
      \`N;CHARSET=UTF-8:\${lastName};\${firstName};\${middleName};;\`
    ];

    if (profile.title) lines.push(\`TITLE;CHARSET=UTF-8:\${profile.title}\`);
    if (profile.org) lines.push(\`ORG;CHARSET=UTF-8:\${profile.org}\`);
    if (profile.tel) lines.push(\`TEL;TYPE=CELL,VOICE,PREF:\${profile.tel}\`);
    if (profile.email) lines.push(\`EMAIL;TYPE=INTERNET,WORK:\${profile.email}\`);
    if (profile.url) lines.push(\`URL;TYPE=WORK:\${profile.url}\`);
    if (profile.adr) lines.push(\`ADR;TYPE=WORK;CHARSET=UTF-8:;;\${profile.adr};;;;\`);
    if (profile.slogan) lines.push(\`NOTE;CHARSET=UTF-8:\${profile.slogan}\`);

    // Add social links as URL / X-SOCIAL profiles
    if (Array.isArray(profile.socials)) {
      profile.socials.forEach(s => {
        if (s && s.url) {
          lines.push(\`URL;TYPE=\${(s.type || 'SOCIAL').toUpperCase()}:\${s.url}\`);
        }
      });
    }

    lines.push('END:VCARD\\r\\n');
    return lines.join('\\r\\n');
  }`;

if (html.includes(oldBuildVCard)) {
  html = html.replace(oldBuildVCard, newBuildVCard);
  console.log('✅ Successfully fixed buildVCardString to parse N: Họ; Tên; Tên đệm!');
} else {
  console.error('oldBuildVCard not found!');
}

fs.writeFileSync(p, html, 'utf8');
