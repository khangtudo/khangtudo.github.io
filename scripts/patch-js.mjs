import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// Replace JS event bindings
const oldJsHook = `// More Menu Modal
  const moreBtn = document.getElementById('btnMoreActions');
  const moreMenu = document.getElementById('moreMenu');
  function openMoreMenu() {
    moreMenu.style.display = 'flex';
    moreBtn.setAttribute('aria-expanded', 'true');
    const firstItem = moreMenu.querySelector('.more-item');
    if (firstItem) setTimeout(() => firstItem.focus(), 30);
  }
  function closeMoreMenu() {
    moreMenu.style.display = 'none';
    moreBtn.setAttribute('aria-expanded', 'false');
  }
  moreBtn.onclick = (e) => {
    e.stopPropagation();
    if (moreMenu.style.display === 'flex') closeMoreMenu();
    else openMoreMenu();
  };
  document.addEventListener('click', closeMoreMenu);

  moreMenu.addEventListener('keydown', (e) => {
    const items = Array.from(moreMenu.querySelectorAll('.more-item'));
    const currIdx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(currIdx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(currIdx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  });

  // Toggle Orientation
  document.getElementById('btnMenuToggleOrient').onclick = () => {
    profile.orientation = profile.orientation === 'horizontal' ? 'vertical' : 'horizontal';
    renderCard();
  };`;

const newJsHook = `// Flip button below card
  const btnFlipBelow = document.getElementById('btnFlipBelow');
  if (btnFlipBelow) {
    btnFlipBelow.onclick = flipCard;
  }

  // Toggle Orientation (Inside Card corner buttons)
  function toggleCardOrientation(e) {
    if (e) e.stopPropagation();
    profile.orientation = profile.orientation === 'horizontal' ? 'vertical' : 'horizontal';
    renderCard();
  }
  const btnOrientInside = document.getElementById('btnOrientInside');
  if (btnOrientInside) btnOrientInside.onclick = toggleCardOrientation;
  const btnOrientInsideBack = document.getElementById('btnOrientInsideBack');
  if (btnOrientInsideBack) btnOrientInsideBack.onclick = toggleCardOrientation;

  // Direct Open QR Offline Button
  const btnOpenQrDirect = document.getElementById('btnOpenQrDirect');
  if (btnOpenQrDirect) {
    btnOpenQrDirect.onclick = openQr;
  }`;

// Remove Escape closeMoreMenu call
html = html.replace(oldJsHook, newJsHook);
html = html.replace('closeMoreMenu();', '');
html = html.replace(`document.getElementById('btnMenuSample').onclick = () => {`, `const dummySampleHandler = () => {`);

fs.writeFileSync(p, html, 'utf8');
console.log('✅ Updated JavaScript handlers successfully!');
