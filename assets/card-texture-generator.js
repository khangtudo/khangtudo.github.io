// Generator for AR Card Textures in inid.me (Browser-compatible Canvas renderer)
// Renders dynamic 1024x1024 double-sided texture matching exact UV bounds for ar-hands.html & 3D models
// Supports rendering real user Avatar image and Company Logo image (with fallback monogram)

export async function createDynamicCardTexture(profile, isVertical = false) {
  const cvs = document.createElement('canvas');
  cvs.width = 1024;
  cvs.height = 1024;
  const ctx = cvs.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1024, 1024);

  const CYAN = '#38bdf8';
  const WHITE = '#ffffff';
  const TEXT_MUTED = '#94a3b8';
  const BG_COLOR = profile.bgColor || '#131b2e';

  // Helper to load image safely
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

  if (!isVertical) {
    // -------------------------------------------------------------
    // HORIZONTAL TEXTURE (1024 x 1024)
    // Card dimensions on texture: 860 x 520
    // UV Front: X: 82..942, Y: 0..520
    // UV Back:  X: 82..942, Y: 504..1024
    // -------------------------------------------------------------
    const W = 860;
    const H = 520;
    const R = 28;

    // FRONT FACE (Top half: centered at X=82, Y=0)
    const fx = 82, fy = 0;
    ctx.save();
    roundRect(fx, fy, W, H, R);
    ctx.clip();

    const gradF = ctx.createLinearGradient(fx, fy, fx + W, fy + H);
    gradF.addColorStop(0, BG_COLOR);
    gradF.addColorStop(1, '#090d16');
    ctx.fillStyle = gradF;
    ctx.fill();

    // Outer border
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 6;
    ctx.stroke();

    // Left blue vertical accent bar
    ctx.fillStyle = CYAN;
    ctx.fillRect(fx + 50, fy + 55, 8, 90);

    // Name & Title
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
    ctx.fillText(profile.fn || 'Chưa đặt tên', fx + 75, fy + 100);

    ctx.fillStyle = CYAN;
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(profile.title || 'Chuyên viên', fx + 75, fy + 138);

    ctx.fillStyle = TEXT_MUTED;
    ctx.font = '500 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(profile.org || 'inid.me Identity', fx + 75, fy + 172);

    // Thin divider
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
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
      ctx.fillStyle = WHITE;
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('📞', iconX, fy + 251);
      ctx.fillStyle = WHITE;
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText(profile.tel, textX, fy + 253);
    }

    if (profile.email) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(iconX + 10, fy + 295, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = WHITE;
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('✉️', iconX, fy + 301);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 21px system-ui, -apple-system, sans-serif';
      ctx.fillText(profile.email, textX, fy + 303);
    }

    const displayUrl = (profile.url || 'inid.me').replace(/^https?:\/\//i, '');
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath(); ctx.arc(iconX + 10, fy + 345, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WHITE;
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('🌐', iconX, fy + 351);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 21px system-ui, -apple-system, sans-serif';
    ctx.fillText(displayUrl, textX, fy + 353);

    if (profile.adr) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.arc(iconX + 10, fy + 395, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = WHITE;
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('📍', iconX, fy + 401);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 19px system-ui, -apple-system, sans-serif';
      ctx.fillText(profile.adr, textX, fy + 403);
    }

    // Footer Tagline
    ctx.fillStyle = CYAN;
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('INID.ME • SMART AR BUSINESS CARD', fx + 60, fy + 465);

    // Front Avatar / Monogram box (Right top)
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
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e293b';
      roundRect(avX, avY, avW, avH, 18);
      ctx.fill();
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = CYAN;
      ctx.font = 'bold 30px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.fn), avX + avW / 2, avY + 56);
      ctx.textAlign = 'left';
    }
    ctx.restore();

    // BACK FACE (Bottom half: centered at X=82, Y=504)
    const bx = 82, by = 504;
    ctx.save();
    roundRect(bx, by, W, H, R);
    ctx.clip();

    const gradB = ctx.createLinearGradient(bx, by, bx + W, by + H);
    gradB.addColorStop(0, '#0f172a');
    gradB.addColorStop(1, '#020617');
    ctx.fillStyle = gradB;
    ctx.fill();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 4;
    ctx.stroke();

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
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#0f172a';
      roundRect(lgX, lgY, lgW, lgH, 24);
      ctx.fill();
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.fillStyle = CYAN;
      ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.org || profile.fn), cx, by + 120);
    }

    // Company Title
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 40px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(profile.org || 'inid.me Identity', cx, by + 215);

    // Slogan / Tagline
    ctx.fillStyle = CYAN;
    ctx.font = 'italic bold 23px system-ui, -apple-system, sans-serif';
    ctx.fillText(profile.slogan || profile.tagline || 'Smart AR Profile & Business Card', cx, by + 265);

    // Address
    if (profile.adr) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 21px system-ui, -apple-system, sans-serif';
      ctx.fillText(profile.adr, cx, by + 325);
    }

    // Sub-caption
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = '600 16px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('TAP OR SCAN TO CONNECT INSTANTLY', cx, by + 440);
    ctx.textAlign = 'left';
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
    ctx.save();
    roundRect(fx, fy, W, H, R);
    ctx.clip();

    const gradF = ctx.createLinearGradient(fx, fy, fx + W, fy + H);
    gradF.addColorStop(0, BG_COLOR);
    gradF.addColorStop(1, '#090d16');
    ctx.fillStyle = gradF;
    ctx.fill();

    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 6;
    ctx.stroke();

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
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, avY, avR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = CYAN;
      ctx.font = 'bold 36px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.fn), cx, avY + 13);
    }

    // Name & Title
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(profile.fn || 'Chưa đặt tên', cx, fy + 225);

    ctx.fillStyle = CYAN;
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText(profile.title || 'Chuyên viên', cx, fy + 265);

    ctx.fillStyle = TEXT_MUTED;
    ctx.font = '500 19px system-ui, -apple-system, sans-serif';
    ctx.fillText(profile.org || 'inid.me Identity', cx, fy + 300);

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(fx + 40, fy + 335);
    ctx.lineTo(fx + W - 40, fy + 335);
    ctx.stroke();

    const cLeft = fx + 40;
    ctx.textAlign = 'left';

    if (profile.tel) {
      ctx.fillStyle = WHITE;
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(`📞  ${profile.tel}`, cLeft, fy + 385);
    }
    if (profile.email) {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '500 17px system-ui, -apple-system, sans-serif';
      ctx.fillText(`✉️  ${profile.email}`, cLeft, fy + 435);
    }
    const displayUrl = (profile.url || 'inid.me').replace(/^https?:\/\//i, '');
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 18px system-ui, -apple-system, sans-serif';
    ctx.fillText(`🌐  ${displayUrl}`, cLeft, fy + 485);

    if (profile.adr) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '15px system-ui, -apple-system, sans-serif';
      ctx.fillText(`📍  ${profile.adr}`, cLeft, fy + 535);
    }

    // Slogan
    ctx.fillStyle = CYAN;
    ctx.font = 'italic 15px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(profile.slogan || profile.tagline || 'Smart AR Profile & Business Card', cx, fy + 650);

    // Footer
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('INID.ME • SMART AR BUSINESS CARD', cx, fy + 735);
    ctx.restore();

    // BACK FACE (Right: X=524, Y=115)
    const bx = 524, by = 115;
    ctx.save();
    roundRect(bx, by, W, H, R);
    ctx.clip();

    const gradB = ctx.createLinearGradient(bx, by, bx + W, by + H);
    gradB.addColorStop(0, '#0f172a');
    gradB.addColorStop(1, '#020617');
    ctx.fillStyle = gradB;
    ctx.fill();

    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 6;
    ctx.stroke();

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
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#0f172a';
      roundRect(bLgX, bLgY, bLgW, bLgH, 26);
      ctx.fill();
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.fillStyle = CYAN;
      ctx.font = 'bold 46px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.org || profile.fn), bcx, by + 195);
    }

    // Title
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(profile.org || 'inid.me Identity', bcx, by + 295);

    // Slogan
    ctx.fillStyle = CYAN;
    ctx.font = 'italic bold 18px system-ui, -apple-system, sans-serif';
    ctx.fillText(profile.slogan || profile.tagline || 'Smart AR Profile & Business Card', bcx, by + 345);

    // Address
    if (profile.adr) {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 18px system-ui, -apple-system, sans-serif';
      ctx.fillText(profile.adr, bcx, by + 440);
    }

    // Sub-caption
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('TAP OR SCAN TO CONNECT INSTANTLY', bcx, by + 680);

    ctx.restore();
  }

  return cvs;
}
