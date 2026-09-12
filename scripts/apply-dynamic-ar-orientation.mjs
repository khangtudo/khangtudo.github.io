import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

// 1. In renderCard(): update model-viewer src and ios-src
const oldRenderOrient = `    // Orientation
    const stage = document.getElementById('cardPerspective');
    if (profile.orientation === 'horizontal') stage.classList.add('horizontal');
    else stage.classList.remove('horizontal');`;

const newRenderOrient = `    // Orientation & Dynamic AR Model selection
    const stage = document.getElementById('cardPerspective');
    const arViewer = document.getElementById('arViewer');
    const isVert = (profile.orientation !== 'horizontal');
    const currentGlb = isVert ? 'assets/3d/card-vertical.glb' : 'assets/3d/card.glb';
    const currentUsdz = isVert ? 'assets/3d/card-vertical.usdz' : 'assets/3d/card.usdz';

    if (profile.orientation === 'horizontal') stage.classList.add('horizontal');
    else stage.classList.remove('horizontal');

    if (arViewer) {
      arViewer.setAttribute('src', currentGlb);
      arViewer.setAttribute('ios-src', currentUsdz);
    }`;

if (html.includes(oldRenderOrient)) {
  html = html.replace(oldRenderOrient, newRenderOrient);
  console.log('✅ Updated renderCard with dynamic AR model switching!');
} else {
  console.error('oldRenderOrient not found!');
}

// 2. In btnLaunchAr.onclick: use dynamic glb and usdz paths
const oldBtnLaunchAr = `  const btnLaunchAr = document.getElementById('btnLaunchAr');
  if (btnLaunchAr) {
    btnLaunchAr.onclick = () => {
      const viewer = document.getElementById('arViewer');
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // Native Quick Look for Safari iOS
        const a = document.createElement('a');
        a.setAttribute('rel', 'ar');
        const img = document.createElement('img');
        a.appendChild(img);
        a.setAttribute('href', 'assets/3d/card.usdz');
        document.body.appendChild(a);
        a.click();
        setTimeout(() => a.remove(), 200);
      } else if (viewer && viewer.canActivateAR) {
        viewer.activateAR();
      } else {
        // Android Scene Viewer Fallback
        const intentUrl = 'intent://arvr.google.com/scene-viewer/1.0?file=' + encodeURIComponent(window.location.origin + '/assets/3d/card.glb') + '&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=' + encodeURIComponent(window.location.href) + ';end;';
        window.location.href = intentUrl;
      }
    };
  }`;

const newBtnLaunchAr = `  const btnLaunchAr = document.getElementById('btnLaunchAr');
  if (btnLaunchAr) {
    btnLaunchAr.onclick = () => {
      const viewer = document.getElementById('arViewer');
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isVert = (profile.orientation !== 'horizontal');
      const glbFile = isVert ? 'assets/3d/card-vertical.glb' : 'assets/3d/card.glb';
      const usdzFile = isVert ? 'assets/3d/card-vertical.usdz' : 'assets/3d/card.usdz';

      if (isIOS) {
        // Native Quick Look for Safari iOS
        const a = document.createElement('a');
        a.setAttribute('rel', 'ar');
        const img = document.createElement('img');
        a.appendChild(img);
        a.setAttribute('href', usdzFile);
        document.body.appendChild(a);
        a.click();
        setTimeout(() => a.remove(), 200);
      } else if (viewer && viewer.canActivateAR) {
        viewer.activateAR();
      } else {
        // Android Scene Viewer Fallback
        const fullGlbUrl = window.location.origin + '/' + glbFile;
        const intentUrl = 'intent://arvr.google.com/scene-viewer/1.0?file=' + encodeURIComponent(fullGlbUrl) + '&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=' + encodeURIComponent(window.location.href) + ';end;';
        window.location.href = intentUrl;
      }
    };
  }`;

if (html.includes(oldBtnLaunchAr)) {
  html = html.replace(oldBtnLaunchAr, newBtnLaunchAr);
  console.log('✅ Updated btnLaunchAr with dynamic vertical/horizontal AR paths!');
} else {
  console.error('oldBtnLaunchAr not found!');
}

fs.writeFileSync(p, html, 'utf8');
console.log('Done updating index.html!');
