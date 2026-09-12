import fs from 'node:fs';
import path from 'node:path';
import { createGlb, createUsdz } from './build-dual-3d.mjs';

async function main() {
  const tabsRes = await fetch('http://127.0.0.1:9333/json');
  const tabs = await tabsRes.json();
  const renderTab = tabs.find(t => t.url.includes('render-card-textures.html'));
  if (!renderTab) throw new Error('render-card-textures.html tab not found');

  const wsUrl = renderTab.webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);

  const getB64 = (fnName) => new Promise((resolve, reject) => {
    let msgId = Math.floor(Math.random() * 100000);
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === msgId) {
        ws.removeEventListener('message', handler);
        if (data.result?.result?.value) resolve(data.result.result.value);
        else reject(new Error('No base64 returned for ' + fnName));
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({
      id: msgId,
      method: 'Runtime.evaluate',
      params: { expression: `${fnName}()` }
    }));
  });

  await new Promise(r => ws.onopen = r);

  const horizB64 = await getB64('window.getHorizBase64');
  const vertB64 = await getB64('window.getVertBase64');
  ws.close();

  const horizPng = Buffer.from(horizB64, 'base64');
  const vertPng = Buffer.from(vertB64, 'base64');
  console.log(`Textures extracted: Horizontal (${horizPng.length} bytes), Vertical (${vertPng.length} bytes)`);

  const outDir = 'C:/Users/ADMIN/projects/inid.me/assets/3d';

  // 1. BUILD HORIZONTAL 3D MODELS (91mm x 55mm x 0.8mm)
  // W=0.091, H=0.055, D=0.0008
  // UV mapping:
  // Front: X: 82 to 942 (uMin: 82/1024, uMax: 942/1024), Y: 0 to 520 (vMin: 0, vMax: 520/1024)
  // Back: X: 82 to 942 (uMin: 82/1024, uMax: 942/1024), Y: 504 to 1024 (vMin: 504/1024, vMax: 1.0)
  const horizUvGlb = {
    uvFront: { uMin: 82/1024, uMax: 942/1024, vMin: 0/1024, vMax: 520/1024 },
    uvBack:  { uMin: 82/1024, uMax: 942/1024, vMin: 504/1024, vMax: 1024/1024 }
  };
  const horizUvUsdz = {
    // In USDZ V is inverted (bottom is 0, top is 1)
    uvFront: { uMin: 82/1024, uMax: 942/1024, vMin: (1024-520)/1024, vMax: 1024/1024 },
    uvBack:  { uMin: 82/1024, uMax: 942/1024, vMin: 0/1024, vMax: (1024-504)/1024 }
  };

  const cardGlb = createGlb({
    widthM: 0.091, heightM: 0.055, depthM: 0.0008,
    uvFront: horizUvGlb.uvFront, uvBack: horizUvGlb.uvBack,
    pngBuf: horizPng
  });
  const cardUsdz = createUsdz({
    widthM: 0.091, heightM: 0.055, depthM: 0.0008,
    uvFront: horizUvUsdz.uvFront, uvBack: horizUvUsdz.uvBack,
    pngBuf: horizPng
  });

  fs.writeFileSync(path.join(outDir, 'card.glb'), cardGlb);
  fs.writeFileSync(path.join(outDir, 'card.usdz'), cardUsdz);
  console.log(`✅ Exported Horizontal: card.glb (${(cardGlb.length/1024).toFixed(1)} KB), card.usdz (${(cardUsdz.length/1024).toFixed(1)} KB)`);

  // 2. BUILD VERTICAL 3D MODELS (55mm x 91mm x 0.8mm)
  // W=0.055, H=0.091, D=0.0008
  // UV mapping:
  // Front: X: 20 to 500 (u: 20/1024 .. 500/1024), Y: 115 to 909 (v: 115/1024 .. 909/1024)
  // Back: X: 524 to 1004 (u: 524/1024 .. 1004/1024), Y: 115 to 909 (v: 115/1024 .. 909/1024)
  const vertUvGlb = {
    uvFront: { uMin: 20/1024, uMax: 500/1024, vMin: 115/1024, vMax: 909/1024 },
    uvBack:  { uMin: 524/1024, uMax: 1004/1024, vMin: 115/1024, vMax: 909/1024 }
  };
  const vertUvUsdz = {
    uvFront: { uMin: 20/1024, uMax: 500/1024, vMin: (1024-909)/1024, vMax: (1024-115)/1024 },
    uvBack:  { uMin: 524/1024, uMax: 1004/1024, vMin: (1024-909)/1024, vMax: (1024-115)/1024 }
  };

  const cardVertGlb = createGlb({
    widthM: 0.055, heightM: 0.091, depthM: 0.0008,
    uvFront: vertUvGlb.uvFront, uvBack: vertUvGlb.uvBack,
    pngBuf: vertPng
  });
  const cardVertUsdz = createUsdz({
    widthM: 0.055, heightM: 0.091, depthM: 0.0008,
    uvFront: vertUvUsdz.uvFront, uvBack: vertUvUsdz.uvBack,
    pngBuf: vertPng
  });

  fs.writeFileSync(path.join(outDir, 'card-vertical.glb'), cardVertGlb);
  fs.writeFileSync(path.join(outDir, 'card-vertical.usdz'), cardVertUsdz);
  console.log(`✅ Exported Vertical: card-vertical.glb (${(cardVertGlb.length/1024).toFixed(1)} KB), card-vertical.usdz (${(cardVertUsdz.length/1024).toFixed(1)} KB)`);
}

main().catch(console.error);
