import fs from 'node:fs';
import path from 'node:path';
import { buildDoubleSidedGlb, buildDoubleSidedUsdz } from './ar-builder.mjs';

async function main() {
  const tabsRes = await fetch('http://127.0.0.1:9333/json');
  const tabs = await tabsRes.json();
  const renderTab = tabs.find(t => t.url.includes('render-texture.html'));
  if (!renderTab) throw new Error('render-texture.html tab not found');

  const wsUrl = renderTab.webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);

  const b64 = await new Promise((resolve, reject) => {
    ws.onopen = () => {
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: 'window.getCardPngBase64()' }
      }));
    };
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === 1) {
        ws.close();
        if (data.result?.result?.value) resolve(data.result.result.value);
        else reject(new Error('No base64 returned'));
      }
    };
    ws.onerror = reject;
  });

  const pngBuf = Buffer.from(b64, 'base64');
  console.log('Got PNG texture buffer:', pngBuf.length, 'bytes');

  // Build Double-sided GLB and USDZ
  const glb = buildDoubleSidedGlb(pngBuf);
  const usdz = buildDoubleSidedUsdz(pngBuf);

  const outDir = 'C:/Users/ADMIN/projects/inid.me/assets/3d';
  fs.writeFileSync(path.join(outDir, 'card.glb'), glb);
  fs.writeFileSync(path.join(outDir, 'card.usdz'), usdz);
  console.log(`✅ Exported 2-Sided card.glb (${(glb.length / 1024).toFixed(1)} KB) and card.usdz (${(usdz.length / 1024).toFixed(1)} KB) to ${outDir}`);
}

main().catch(console.error);
