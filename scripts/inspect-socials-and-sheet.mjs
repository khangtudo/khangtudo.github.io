import fs from 'node:fs';

const html = fs.readFileSync('C:/Users/ADMIN/projects/inid.me/index.html', 'utf8');

// 1. Check social fields in editSheet HTML
const socialFieldIdx = html.indexOf('inFb');
console.log('--- Social fields in editSheet ---');
console.log(html.substring(socialFieldIdx - 100, socialFieldIdx + 800));

// 2. Check profile.socials in JS
const profileSocialIdx = html.indexOf('socials:');
console.log('--- profile.socials in JS ---');
console.log(html.substring(profileSocialIdx - 50, profileSocialIdx + 400));

// 3. Check saveSheet handler
const saveSheetIdx = html.indexOf("document.getElementById('btnSaveSheet').onclick");
console.log('--- btnSaveSheet.onclick ---');
console.log(html.substring(saveSheetIdx, saveSheetIdx + 1200));

// 4. Check renderCard socials
const renderSocialsIdx = html.indexOf('cardSocials');
console.log('--- renderCard cardSocials ---');
console.log(html.substring(renderSocialsIdx - 50, renderSocialsIdx + 800));
