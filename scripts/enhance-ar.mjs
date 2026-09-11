import fs from 'node:fs';

const p = 'C:/Users/ADMIN/projects/inid.me/index.html';
let html = fs.readFileSync(p, 'utf8');

const oldArCode = `  // Launch AR Native Quick Look / Scene Viewer
  document.getElementById('btnLaunchAr').onclick = () => {
    const viewer = document.getElementById('arViewer');
    if (viewer.canActivateAR) {
      viewer.activateAR();
    } else {
      const a = document.createElement('a');
      a.setAttribute('rel', 'ar');
      a.appendChild(document.createElement('img'));
      a.setAttribute('href', 'assets/3d/card.usdz');
      a.click();
    }
  };`;

const newArCode = `  // Launch AR Native Quick Look / Scene Viewer
  const btnLaunchAr = document.getElementById('btnLaunchAr');
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

if (html.includes(oldArCode)) {
  html = html.replace(oldArCode, newArCode);
  console.log('✅ Updated AR launcher with robust iOS Quick Look & Android Scene Viewer!');
} else {
  console.error('oldArCode not found!');
}

fs.writeFileSync(p, html, 'utf8');
