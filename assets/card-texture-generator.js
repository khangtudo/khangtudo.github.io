// Generator for AR Card Textures in inid.me (Browser-compatible Canvas renderer)
// Renders dynamic 1024x1024 double-sided texture matching exact UV bounds for ar-hands.html & 3D models

export function createDynamicCardTexture(profile, isVertical = false) {
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

  // Get monogram / initials
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

    // Cyan outer border
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

    // Phone
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

    // Email
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

    // Website / URL
    const displayUrl = (profile.url || 'inid.me').replace(/^https?:\/\//i, '');
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath(); ctx.arc(iconX + 10, fy + 345, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = WHITE;
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('🌐', iconX, fy + 351);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 21px system-ui, -apple-system, sans-serif';
    ctx.fillText(displayUrl, textX, fy + 353);

    // Address if available
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

    // Mini Initial Badge on right top
    ctx.fillStyle = '#1e293b';
    roundRect(fx + W - 140, fy + 60, 80, 80, 16);
    ctx.fill();
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = CYAN;
    ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(getInitials(profile.fn), fx + W - 100, fy + 110);
    ctx.textAlign = 'left';
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
    // Centered Logo Box
    ctx.fillStyle = '#0f172a';
    roundRect(cx - 50, by + 60, 100, 100, 24);
    ctx.fill();
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.fillStyle = CYAN;
    ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(getInitials(profile.org || profile.fn), cx, by + 125);

    // Company Title
    ctx.fillStyle = WHITE;
    ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
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
  }

  return cvs;
}
