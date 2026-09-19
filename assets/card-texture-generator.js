// Generator for AR Card Textures in inid.me (Browser-compatible Canvas renderer)
// Renders dynamic 1024x1024 double-sided texture matching exact UV bounds for ar-hands.html & 3D models
// Implements 5 Pro/VIP Procedural PBR materials from INID_PRO_VIP_MATERIAL_SPEC.md:
// - Titanium Dark (M .88 / R .27)
// - Carbon Fiber (M .36 / R .41)
// - Gold Foil Brushed (M .96 / R .19)
// - Frosted Glass (M .08 / R .72)
// - Royal Leather (M .04 / R .79)

export const VIP_MATERIALS = {
  titanium: { baseColor:'#20252B', shadow:'#0B0E12', highlight:'#69737D', accent:'#B9F2FF', text:'#F4F7FA', metalness:.88, roughness:.27, specularStrength:.72, normalStrength:.10, textureScale:6, fontPair:'precision' },
  carbon:   { baseColor:'#121417', shadow:'#050607', highlight:'#313941', accent:'#56E6D2', text:'#F6F8FA', metalness:.36, roughness:.41, specularStrength:.46, normalStrength:.34, textureScale:32, fontPair:'future' },
  gold:     { baseColor:'#B88935', shadow:'#4D3212', highlight:'#F7E5AD', accent:'#FFF0BE', text:'#FFF4D2', metalness:.96, roughness:.19, specularStrength:.80, normalStrength:.08, textureScale:3, fontPair:'editorial' },
  frost:    { baseColor:'#BCD7EA', shadow:'#264254', highlight:'#EAF8FF', accent:'#83E8FF', text:'#F4FCFF', metalness:.08, roughness:.72, specularStrength:.58, normalStrength:.04, textureScale:72, fontPair:'future' },
  leather:  { baseColor:'#32131E', shadow:'#12070B', highlight:'#784052', accent:'#D8AF62', text:'#FFF7EB', metalness:.04, roughness:.79, specularStrength:.28, normalStrength:.46, textureScale:8, fontPair:'regal' },
};

export async function createDynamicCardTexture(profile, isVertical = false) {
  // Wait for Google Fonts to load if available
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch(e) {}
  }

  const cvs = document.createElement('canvas');
  cvs.width = 1024;
  cvs.height = 1024;
  const ctx = cvs.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1024, 1024);

  const vip = profile.vipTheme || {};
  const matKey = (vip.material && VIP_MATERIALS[vip.material]) ? vip.material : 'titanium';
  const matPreset = VIP_MATERIALS[matKey];

  const BG_COLOR = vip.bgColor || matPreset.baseColor;
  const TEXT_COLOR = vip.textColor || matPreset.text;
  const ACCENT_COLOR = vip.accentColor || matPreset.accent;
  const TEXT_MUTED = '#94a3b8';

  const fontPair = vip.fontPair || matPreset.fontPair || 'precision';
  let FONT_DISPLAY = '-apple-system, BlinkMacSystemFont, "Be Vietnam Pro", sans-serif';
  let FONT_BODY = '-apple-system, BlinkMacSystemFont, "Inter", sans-serif';

  if (fontPair === 'future') {
    FONT_DISPLAY = '"Space Grotesk", "Be Vietnam Pro", sans-serif';
    FONT_BODY = '"Be Vietnam Pro", sans-serif';
  } else if (fontPair === 'editorial') {
    FONT_DISPLAY = '"Playfair Display", "Be Vietnam Pro", serif';
    FONT_BODY = '"Be Vietnam Pro", sans-serif';
  } else if (fontPair === 'regal') {
    FONT_DISPLAY = '"Cinzel", "Playfair Display", "Be Vietnam Pro", serif';
    FONT_BODY = '"Be Vietnam Pro", sans-serif';
  } else if (fontPair === 'precision') {
    FONT_DISPLAY = '"Be Vietnam Pro", sans-serif';
    FONT_BODY = '"Inter", sans-serif';
  }

  const NAME_SIZE = clamp(vip.nameSize || 48, 36, 56);
  const TITLE_SIZE = clamp(vip.titleSize || 24, 18, 30);

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  // Safe image loader
  function loadImage(src) {
    if (!src) return Promise.resolve(null);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  const [avatarImg, logoImg] = await Promise.all([
    loadImage(profile.avatar),
    loadImage(profile.logo)
  ]);

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function getInitials(name) {
    if (!name) return 'ID';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // Draw procedural pattern for the 5 VIP materials
  function drawMaterialSurface(x, y, w, h, r, isBack = false) {
    ctx.save();
    roundRect(x, y, w, h, r);
    ctx.clip();

    // 1. Base Gradient
    const baseGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    baseGrad.addColorStop(0, BG_COLOR);
    baseGrad.addColorStop(1, matPreset.shadow || '#050607');
    ctx.fillStyle = baseGrad;
    ctx.fill();

    // 2. Procedural Pattern Layer
    if (matKey === 'carbon') {
      // 32x32 Woven Ribbons
      const pCvs = document.createElement('canvas');
      pCvs.width = 16; pCvs.height = 16;
      const pCtx = pCvs.getContext('2d');
      pCtx.fillStyle = '#121417';
      pCtx.fillRect(0, 0, 16, 16);
      pCtx.fillStyle = 'rgba(42, 48, 54, 0.45)';
      pCtx.fillRect(0, 0, 8, 8);
      pCtx.fillRect(8, 8, 8, 8);
      pCtx.fillStyle = 'rgba(7, 9, 10, 0.65)';
      pCtx.fillRect(8, 0, 8, 8);
      pCtx.fillRect(0, 8, 8, 8);
      ctx.fillStyle = ctx.createPattern(pCvs, 'repeat');
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    } else if (matKey === 'titanium') {
      // Brushed vertical alloy streaks
      const pCvs = document.createElement('canvas');
      pCvs.width = 8; pCvs.height = 64;
      const pCtx = pCvs.getContext('2d');
      pCtx.fillStyle = 'rgba(255,255,255,0.03)';
      pCtx.fillRect(0, 0, 2, 64);
      pCtx.fillStyle = 'rgba(0,0,0,0.08)';
      pCtx.fillRect(3, 0, 3, 64);
      ctx.fillStyle = ctx.createPattern(pCvs, 'repeat');
      ctx.fill();

      // Subtle diagonal light sweep
      const sweep = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
      sweep.addColorStop(0, 'rgba(255,255,255,0)');
      sweep.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      sweep.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sweep;
      ctx.fill();
    } else if (matKey === 'gold') {
      // Horizontal brushed micro-scratches & metallic sheen
      const pCvs = document.createElement('canvas');
      pCvs.width = 64; pCvs.height = 4;
      const pCtx = pCvs.getContext('2d');
      pCtx.fillStyle = 'rgba(247, 229, 173, 0.08)';
      pCtx.fillRect(0, 0, 64, 1);
      ctx.fillStyle = ctx.createPattern(pCvs, 'repeat');
      ctx.fill();

      const sweep = ctx.createLinearGradient(x, y, x + w, y + h);
      sweep.addColorStop(0, 'rgba(255,240,190,0.15)');
      sweep.addColorStop(0.4, 'rgba(255,255,255,0.22)');
      sweep.addColorStop(0.6, 'rgba(184,137,53,0.1)');
      sweep.addColorStop(1, 'rgba(255,240,190,0.2)');
      ctx.fillStyle = sweep;
      ctx.fill();
    } else if (matKey === 'frost') {
      // Frosted cyber noise clouds & cyan circuitry glow
      const sweep = ctx.createRadialGradient(x + w * 0.3, y + h * 0.3, 20, x + w * 0.5, y + h * 0.5, w * 0.7);
      sweep.addColorStop(0, 'rgba(131, 232, 255, 0.12)');
      sweep.addColorStop(0.6, 'rgba(38, 66, 84, 0.25)');
      sweep.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = sweep;
      ctx.fill();
    } else if (matKey === 'leather') {
      // Royal organic pebble texture
      const pCvs = document.createElement('canvas');
      pCvs.width = 12; pCvs.height = 12;
      const pCtx = pCvs.getContext('2d');
      pCtx.fillStyle = 'rgba(120, 64, 82, 0.1)';
      pCtx.beginPath(); pCtx.arc(6, 6, 4, 0, Math.PI * 2); pCtx.fill();
      ctx.fillStyle = ctx.createPattern(pCvs, 'repeat');
      ctx.fill();
    }

    // 3. Contrast Scrim behind text region for accessibility
    const scrim = ctx.createLinearGradient(x, y, x + w * 0.65, y);
    scrim.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
    scrim.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = scrim;
    ctx.fill();

    // 4. Accent Border
    ctx.strokeStyle = ACCENT_COLOR;
    ctx.lineWidth = (matKey === 'gold' || matKey === 'frost') ? 4 : 5;
    ctx.stroke();

    ctx.restore();
  }

  if (!isVertical) {
    // -------------------------------------------------------------
    // HORIZONTAL TEXTURE (1024 x 1024)
    // Card bounds: 860 x 520
    // UV Front: X: 82..942, Y: 0..520
    // UV Back:  X: 82..942, Y: 504..1024
    // -------------------------------------------------------------
    const W = 860;
    const H = 520;
    const R = 28;

    // FRONT FACE (Top half)
    const fx = 82, fy = 0;
    drawMaterialSurface(fx, fy, W, H, R, false);

    ctx.save();
    // Cyan / Gold vertical accent bar
    ctx.fillStyle = ACCENT_COLOR;
    ctx.fillRect(fx + 50, fy + 55, 6, 90);

    // Name & Title
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = `bold ${NAME_SIZE}px ${FONT_DISPLAY}`;
    ctx.fillText(profile.fn || 'Chưa đặt tên', fx + 75, fy + 102);

    ctx.fillStyle = ACCENT_COLOR;
    ctx.font = `600 ${TITLE_SIZE}px ${FONT_BODY}`;
    ctx.fillText(profile.title || 'Chuyên viên', fx + 75, fy + 140);

    ctx.fillStyle = TEXT_MUTED;
    ctx.font = `500 20px ${FONT_BODY}`;
    ctx.fillText(profile.org || 'inid.me Identity', fx + 75, fy + 174);

    // Thin divider
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(fx + 50, fy + 205);
    ctx.lineTo(fx + W - 50, fy + 205);
    ctx.stroke();

    // Contact details
    const iconX = fx + 60;
    const textX = fx + 100;

    if (profile.tel) {
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath(); ctx.arc(iconX + 10, fy + 245, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('📞', iconX, fy + 251);
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = `bold 22px ${FONT_BODY}`;
      ctx.fillText(profile.tel, textX, fy + 253);
    }

    if (profile.email) {
      ctx.fillStyle = ACCENT_COLOR;
      ctx.beginPath(); ctx.arc(iconX + 10, fy + 295, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('✉️', iconX, fy + 301);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `500 21px ${FONT_BODY}`;
      ctx.fillText(profile.email, textX, fy + 303);
    }

    const displayUrl = (profile.url || 'inid.me').replace(/^https?:\/\//i, '');
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath(); ctx.arc(iconX + 10, fy + 345, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('🌐', iconX, fy + 351);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = `500 21px ${FONT_BODY}`;
    ctx.fillText(displayUrl, textX, fy + 353);

    if (profile.adr) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.arc(iconX + 10, fy + 395, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('📍', iconX, fy + 401);
      ctx.fillStyle = '#94a3b8';
      ctx.font = `500 19px ${FONT_BODY}`;
      ctx.fillText(profile.adr, textX, fy + 403);
    }

    // Footer Tagline
    ctx.fillStyle = ACCENT_COLOR;
    ctx.font = `bold 16px ${FONT_DISPLAY}`;
    ctx.letterSpacing = '1px';
    ctx.fillText(`INID.ME • ${matKey.toUpperCase()} PRO AR CARD`, fx + 60, fy + 465);

    // Front Avatar (Right top)
    const avW = 90, avH = 90;
    const avX = fx + W - 150, avY = fy + 55;
    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(avX + avW / 2, avY + avH / 2, avW / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, avX, avY, avW, avH);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(avX + avW / 2, avY + avH / 2, avW / 2, 0, Math.PI * 2);
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e293b';
      roundRect(avX, avY, avW, avH, 18);
      ctx.fill();
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = ACCENT_COLOR;
      ctx.font = `bold 30px ${FONT_DISPLAY}`;
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.fn), avX + avW / 2, avY + 56);
      ctx.textAlign = 'left';
    }
    ctx.restore();

    // BACK FACE (Bottom half)
    const bx = 82, by = 504;
    drawMaterialSurface(bx, by, W, H, R, true);

    ctx.save();
    const cx = bx + W / 2;
    const lgW = 110, lgH = 110;
    const lgX = cx - lgW / 2, lgY = by + 50;

    if (logoImg) {
      ctx.save();
      roundRect(lgX, lgY, lgW, lgH, 20);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.clip();
      ctx.drawImage(logoImg, lgX + 5, lgY + 5, lgW - 10, lgH - 10);
      ctx.restore();
      roundRect(lgX, lgY, lgW, lgH, 20);
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#0f172a';
      roundRect(lgX, lgY, lgW, lgH, 24);
      ctx.fill();
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.fillStyle = ACCENT_COLOR;
      ctx.font = `bold 42px ${FONT_DISPLAY}`;
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.org || profile.fn), cx, by + 120);
    }

    // Company Title
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = `bold 40px ${FONT_DISPLAY}`;
    ctx.textAlign = 'center';
    ctx.fillText(profile.org || 'inid.me Identity', cx, by + 215);

    // Slogan / Tagline
    ctx.fillStyle = ACCENT_COLOR;
    ctx.font = `italic bold 23px ${FONT_BODY}`;
    ctx.fillText(profile.slogan || profile.tagline || 'Smart AR Profile & Business Card', cx, by + 265);

    // Address
    if (profile.adr) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `500 21px ${FONT_BODY}`;
      ctx.fillText(profile.adr, cx, by + 325);
    }

    // Sub-caption
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = `600 16px ${FONT_DISPLAY}`;
    ctx.letterSpacing = '1px';
    ctx.fillText('TAP OR SCAN TO CONNECT INSTANTLY', cx, by + 440);
    ctx.restore();

  } else {
    // -------------------------------------------------------------
    // VERTICAL TEXTURE (1024 x 1024)
    // Vertical card dimensions: 480 x 794
    // UV Front (Left):  X: 20..500, Y: 115..909
    // UV Back (Right):  X: 524..1004, Y: 115..909
    // -------------------------------------------------------------
    const W = 480;
    const H = 794;
    const R = 28;

    // FRONT FACE (Left: X=20, Y=115)
    const fx = 20, fy = 115;
    drawMaterialSurface(fx, fy, W, H, R, false);

    ctx.save();
    const cx = fx + W / 2;

    // Avatar Circle (Centered top)
    const avR = 55;
    const avY = fy + 120;
    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, avY, avR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, cx - avR, avY - avR, avR * 2, avR * 2);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx, avY, avR, 0, Math.PI * 2);
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, avY, avR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = ACCENT_COLOR;
      ctx.font = `bold 36px ${FONT_DISPLAY}`;
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.fn), cx, avY + 13);
    }

    // Name & Title
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = `bold ${NAME_SIZE - 4}px ${FONT_DISPLAY}`;
    ctx.textAlign = 'center';
    ctx.fillText(profile.fn || 'Chưa đặt tên', cx, fy + 225);

    ctx.fillStyle = ACCENT_COLOR;
    ctx.font = `bold ${TITLE_SIZE - 2}px ${FONT_BODY}`;
    ctx.fillText(profile.title || 'Chuyên viên', cx, fy + 265);

    ctx.fillStyle = TEXT_MUTED;
    ctx.font = `500 19px ${FONT_BODY}`;
    ctx.fillText(profile.org || 'inid.me Identity', cx, fy + 300);

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(fx + 40, fy + 335);
    ctx.lineTo(fx + W - 40, fy + 335);
    ctx.stroke();

    const cLeft = fx + 40;
    ctx.textAlign = 'left';

    if (profile.tel) {
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = `bold 20px ${FONT_BODY}`;
      ctx.fillText(`📞  ${profile.tel}`, cLeft, fy + 385);
    }
    if (profile.email) {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `500 17px ${FONT_BODY}`;
      ctx.fillText(`✉️  ${profile.email}`, cLeft, fy + 435);
    }
    const displayUrl = (profile.url || 'inid.me').replace(/^https?:\/\//i, '');
    ctx.fillStyle = '#e2e8f0';
    ctx.font = `500 18px ${FONT_BODY}`;
    ctx.fillText(`🌐  ${displayUrl}`, cLeft, fy + 485);

    if (profile.adr) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = `15px ${FONT_BODY}`;
      ctx.fillText(`📍  ${profile.adr}`, cLeft, fy + 535);
    }

    // Slogan
    ctx.fillStyle = ACCENT_COLOR;
    ctx.font = `italic 15px ${FONT_BODY}`;
    ctx.textAlign = 'center';
    ctx.fillText(profile.slogan || profile.tagline || 'Smart AR Profile & Business Card', cx, fy + 650);

    // Footer
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = `bold 14px ${FONT_DISPLAY}`;
    ctx.letterSpacing = '1px';
    ctx.fillText(`INID.ME • ${matKey.toUpperCase()} PRO`, cx, fy + 735);
    ctx.restore();

    // BACK FACE (Right: X=524, Y=115)
    const bx = 524, by = 115;
    drawMaterialSurface(bx, by, W, H, R, true);

    ctx.save();
    const bcx = bx + W / 2;
    const bLgW = 120, bLgH = 120;
    const bLgX = bcx - bLgW / 2, bLgY = by + 120;

    if (logoImg) {
      ctx.save();
      roundRect(bLgX, bLgY, bLgW, bLgH, 24);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.clip();
      ctx.drawImage(logoImg, bLgX + 6, bLgY + 6, bLgW - 12, bLgH - 12);
      ctx.restore();
      roundRect(bLgX, bLgY, bLgW, bLgH, 24);
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#0f172a';
      roundRect(bLgX, bLgY, bLgW, bLgH, 26);
      ctx.fill();
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.fillStyle = ACCENT_COLOR;
      ctx.font = `bold 46px ${FONT_DISPLAY}`;
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.org || profile.fn), bcx, by + 195);
    }

    // Title
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = `bold 36px ${FONT_DISPLAY}`;
    ctx.textAlign = 'center';
    ctx.fillText(profile.org || 'inid.me Identity', bcx, by + 295);

    // Slogan
    ctx.fillStyle = ACCENT_COLOR;
    ctx.font = `italic bold 18px ${FONT_BODY}`;
    ctx.fillText(profile.slogan || profile.tagline || 'Smart AR Profile & Business Card', bcx, by + 345);

    // Address
    if (profile.adr) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `500 18px ${FONT_BODY}`;
      ctx.fillText(profile.adr, bcx, by + 440);
    }

    // Sub-caption
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = `600 14px ${FONT_DISPLAY}`;
    ctx.letterSpacing = '1px';
    ctx.fillText('TAP OR SCAN TO CONNECT INSTANTLY', bcx, by + 680);
    ctx.restore();
  }

  return cvs;
}
