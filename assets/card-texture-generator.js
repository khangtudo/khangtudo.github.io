// Generator for AR Card Textures in inid.me (Browser-compatible Canvas renderer)
// Renders dynamic 1024x1024 double-sided texture matching exact UV bounds for ar-hands.html & 3D models
// Features:
// - 2mm Bleeding & Safe-Zone Margin across all edges (ISO/IEC 7810 ID-1 compliant)
// - Smart Word Auto-Wrap & Dynamic Font Auto-Scaling (prevents text overflow on long names/titles/orgs/addresses)
// - 5 Pro/VIP Procedural PBR materials from INID_PRO_VIP_MATERIAL_SPEC.md:
//   * Titanium Dark (M .88 / R .27)
//   * Carbon Fiber (M .36 / R .41)
//   * Gold Foil Brushed (M .96 / R .19)
//   * Frosted Glass (M .08 / R .72)
//   * Royal Leather (M .04 / R .79)

export const VIP_MATERIALS = {
  pvc:           { baseColor:'#0F172A', shadow:'#020617', highlight:'#38BDF8', accent:'#38BDF8', text:'#FFFFFF', metalness:.10, roughness:.22, specularStrength:.85, normalStrength:.05, textureScale:4, fontPair:'precision', name:'PVC' },
  titanium:      { baseColor:'#20252B', shadow:'#0B0E12', highlight:'#69737D', accent:'#B9F2FF', text:'#F4F7FA', metalness:.88, roughness:.27, specularStrength:.72, normalStrength:.10, textureScale:6, fontPair:'precision', name:'Titanium' },
  brushed_steel: { baseColor:'#E2E8F0', shadow:'#64748B', highlight:'#FFFFFF', accent:'#38BDF8', text:'#0F172A', metalness:.95, roughness:.24, specularStrength:.92, normalStrength:.28, textureScale:6, fontPair:'precision', name:'Brushed Steel' },
  acrylic:       { baseColor:'#0C1929', shadow:'#040B14', highlight:'#38BDF8', accent:'#38BDF8', text:'#FFFFFF', metalness:.15, roughness:.10, specularStrength:.92, normalStrength:.02, textureScale:4, fontPair:'future', name:'Acrylic', opacity: 0.82, transparent: true },
  art_paper:     { baseColor:'#F7F5F0', shadow:'#DCD5C9', highlight:'#FFFFFF', accent:'#C5A880', text:'#22252A', metalness:.02, roughness:.88, specularStrength:.18, normalStrength:.55, textureScale:12, fontPair:'editorial', name:'Art Paper' },
  
  // Backward-compatible aliases để đảm bảo thẻ cũ không bao giờ bị crash
  silver:        { baseColor:'#E2E8F0', shadow:'#64748B', highlight:'#FFFFFF', accent:'#38BDF8', text:'#0F172A', metalness:.95, roughness:.24, specularStrength:.92, normalStrength:.28, textureScale:6, fontPair:'precision', name:'Brushed Steel' },
  frost:         { baseColor:'#0C1929', shadow:'#040B14', highlight:'#38BDF8', accent:'#38BDF8', text:'#FFFFFF', metalness:.15, roughness:.10, specularStrength:.92, normalStrength:.02, textureScale:4, fontPair:'future', name:'Acrylic', opacity: 0.82, transparent: true },
  carbon:        { baseColor:'#121417', shadow:'#050607', highlight:'#313941', accent:'#56E6D2', text:'#F6F8FA', metalness:.36, roughness:.41, specularStrength:.46, normalStrength:.34, textureScale:32, fontPair:'future', name:'Carbon' },
  gold:          { baseColor:'#B88935', shadow:'#4D3212', highlight:'#F7E5AD', accent:'#FFF0BE', text:'#FFF4D2', metalness:.96, roughness:.19, specularStrength:.80, normalStrength:.08, textureScale:3, fontPair:'editorial', name:'Gold Foil' },
  leather:       { baseColor:'#32131E', shadow:'#12070B', highlight:'#784052', accent:'#D8AF62', text:'#FFF7EB', metalness:.04, roughness:.79, specularStrength:.28, normalStrength:.46, textureScale:8, fontPair:'regal', name:'Leather' },
  paper:         { baseColor:'#F7F5F0', shadow:'#DCD5C9', highlight:'#FFFFFF', accent:'#C5A880', text:'#22252A', metalness:.02, roughness:.88, specularStrength:.18, normalStrength:.55, textureScale:12, fontPair:'editorial', name:'Art Paper' },
};

/**
 * Smart Word-Wrap & Auto-Scale Text Utility
 * Fits text strictly within maxWidth & maxHeight by wrapping words and dynamically reducing font size if needed.
 */
export function fitAndDrawText(ctx, {
  text,
  customLines = null,
  fx = null,
  x,
  y,
  maxWidth,
  maxHeight = 9999,
  baseFontSize = 24,
  minFontSize = 13,
  fontFamily = 'sans-serif',
  fontWeight = 'normal',
  color = '#ffffff',
  textAlign = 'left',
  lineHeightRatio = 1.25,
  maxLines = 2
}) {
  if (!text && (!customLines || customLines.length === 0)) return { lines: [], finalFontSize: baseFontSize, totalHeight: 0, nextY: y };

  let currentFontSize = Math.round(baseFontSize);
  let bestLines = [];
  let lineH = currentFontSize * lineHeightRatio;

  // If user provided manual custom line breaks from WYSIWYG Builder
  if (Array.isArray(customLines) && customLines.length > 0) {
    while (currentFontSize >= minFontSize) {
      ctx.font = `${fontWeight} ${currentFontSize}px ${fontFamily}`;
      lineH = Math.round(currentFontSize * lineHeightRatio);
      const fits = customLines.every(l => ctx.measureText(l).width <= maxWidth);
      if (fits || currentFontSize === minFontSize) {
        bestLines = customLines;
        break;
      }
      currentFontSize -= 1;
    }
  } else {
    const cleanText = String(text).trim();
    while (currentFontSize >= minFontSize) {
      ctx.font = `${fontWeight} ${currentFontSize}px ${fontFamily}`;
      lineH = Math.round(currentFontSize * lineHeightRatio);

      const words = cleanText.split(/\s+/);
      const lines = [];
      let curLine = '';

      for (let i = 0; i < words.length; i++) {
        const testLine = curLine ? (curLine + ' ' + words[i]) : words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width <= maxWidth) {
          curLine = testLine;
        } else {
          if (curLine) {
            lines.push(curLine);
            curLine = words[i];
          } else {
            curLine = words[i];
          }
        }
      }
      if (curLine) lines.push(curLine);

      const totalH = lines.length * lineH;
      const allLinesWithinWidth = lines.every(l => ctx.measureText(l).width <= maxWidth + 1);

      if (lines.length <= maxLines && totalH <= maxHeight && allLinesWithinWidth) {
        bestLines = lines;
        break;
      }

      currentFontSize -= 1;
    }
  }

  // Fallback if minFontSize reached
  if (bestLines.length === 0) {
    currentFontSize = minFontSize;
    ctx.font = `${fontWeight} ${currentFontSize}px ${fontFamily}`;
    lineH = Math.round(currentFontSize * lineHeightRatio);
    const words = cleanText.split(/\s+/);
    const lines = [];
    let curLine = '';
    for (let i = 0; i < words.length; i++) {
      const testLine = curLine ? (curLine + ' ' + words[i]) : words[i];
      if (ctx.measureText(testLine).width <= maxWidth) {
        curLine = testLine;
      } else {
        if (curLine) lines.push(curLine);
        curLine = words[i];
        if (lines.length === maxLines - 1) break;
      }
    }
    if (curLine) lines.push(curLine);
    if (lines.length > maxLines) lines.length = maxLines;

    // Truncate last line with ellipsis if needed
    let last = lines[lines.length - 1];
    while (ctx.measureText(last + '...').width > maxWidth && last.length > 2) {
      last = last.slice(0, -1);
    }
    if (last !== cleanText && lines.length === maxLines) {
      lines[lines.length - 1] = last + '...';
    }
    bestLines = lines;
  }

  // Draw rendered lines with VIP Effects (Gold Foil / Embossed) support
  ctx.save();
  ctx.textAlign = textAlign;

  let drawY = y;
  for (let i = 0; i < bestLines.length; i++) {
    const lineText = bestLines[i];
    if (fx === 'emboss') {
      // 3D Embossed Chisel effect
      ctx.font = `${fontWeight} ${currentFontSize}px ${fontFamily}`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText(lineText, x - 1, drawY - 1);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillText(lineText, x + 1.5, drawY + 1.5);
      ctx.fillStyle = color;
      ctx.fillText(lineText, x, drawY);
    } else if (fx === 'gold') {
      // Metallic Gold Foil Hot Stamping with specular gradient
      const metrics = ctx.measureText(lineText);
      const textLeft = (textAlign === 'center') ? (x - metrics.width / 2) : (textAlign === 'right' ? x - metrics.width : x);
      const goldGrad = ctx.createLinearGradient(textLeft, drawY - currentFontSize, textLeft + metrics.width, drawY);
      goldGrad.addColorStop(0, '#FFF0BE');
      goldGrad.addColorStop(0.3, '#D8AF62');
      goldGrad.addColorStop(0.6, '#FFF4D2');
      goldGrad.addColorStop(1, '#B88935');

      // Soft glow
      ctx.shadowColor = 'rgba(216, 175, 98, 0.6)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = goldGrad;
      ctx.font = `${fontWeight} ${currentFontSize}px ${fontFamily}`;
      ctx.fillText(lineText, x, drawY);
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = color;
      ctx.font = `${fontWeight} ${currentFontSize}px ${fontFamily}`;
      ctx.fillText(lineText, x, drawY);
    }
    drawY += lineH;
  }
  ctx.restore();

  const totalHeight = bestLines.length * lineH;
  return {
    lines: bestLines,
    finalFontSize: currentFontSize,
    totalHeight,
    nextY: y + totalHeight
  };
}

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
  const matKey = (vip.material && VIP_MATERIALS[vip.material]) ? vip.material : 'pvc';
  const matPreset = VIP_MATERIALS[matKey] || VIP_MATERIALS.pvc;

  // Tự động nhận diện chất liệu hoặc màu nền sáng để đảm bảo độ tương phản chữ luôn đạt chuẩn
  const isLightPreset = (matKey === 'brushed_steel' || matKey === 'silver' || matKey === 'art_paper' || matKey === 'paper');

  // Hàm tính độ sáng tương đối (Luminance) nếu người dùng có custom bgColor
  function isHexColorLight(hex) {
    if (!hex || typeof hex !== 'string') return false;
    const clean = hex.replace('#', '');
    if (clean.length !== 6) return false;
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    // Công thức ITU-R BT.709 perceived luminance
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return lum > 0.55;
  }

  const isLightBg = isLightPreset || (vip.bgColor ? isHexColorLight(vip.bgColor) : false);

  const BG_COLOR = vip.bgColor || matPreset.baseColor;
  
  // Xử lý triệt để màu chữ và màu viền: nếu là chất liệu sáng hoặc màu nền sáng
  // Bất kể textColor trong profile là màu gì (nếu là màu sáng/trắng hoặc chưa chỉnh),
  // bắt buộc phải chuyển toàn bộ các thành phần chữ và điểm nhấn sang màu tối tương phản.
  let TEXT_COLOR = vip.textColor || matPreset.text;
  if (isLightBg) {
    if (!TEXT_COLOR || isHexColorLight(TEXT_COLOR) || TEXT_COLOR === '#FFFFFF' || TEXT_COLOR === '#ffffff' || TEXT_COLOR === '#F4F7FA' || TEXT_COLOR === '#f4f7fa') {
      TEXT_COLOR = matPreset.text || '#0F172A';
    }
  }

  // ACCENT_COLOR: nếu nền sáng mà màu accent quá sáng (ví dụ #38BDF8 xanh ngọc nhạt hoặc #B9F2FF) thì chuyển sang xanh dương đậm #0284C7 / vàng đồng sậm #92400E để chữ chức danh/slogan không bị lóa trắng
  let ACCENT_COLOR = vip.accentColor || matPreset.accent;
  if (isLightBg) {
    if (matKey === 'art_paper' || matKey === 'paper') {
      ACCENT_COLOR = '#854D0E'; // Nâu đồng sang trọng tương phản cao trên giấy mỹ thuật
    } else {
      ACCENT_COLOR = '#0369A1'; // Xanh sapphire đậm tương phản cao trên inox xước
    }
  }

  // Dynamic secondary text color and divider color according to background luminance
  const TEXT_MUTED = isLightBg ? '#334155' : '#94a3b8';
  const CONTACT_TEXT_COLOR = isLightBg ? '#0F172A' : '#E2E8F0';
  const DIVIDER_COLOR = isLightBg ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.15)';

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

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  const NAME_SIZE = clamp(vip.nameSize || 48, 36, 56);
  const TITLE_SIZE = clamp(vip.titleSize || 24, 18, 30);

  // Pro / VIP Customizer Layout Tokens (Offsets & Styling from WYSIWYG Builder)
  const customLayout = profile.customLayout || {};
  const getLayerOffset = (id, cardWidth, cardHeight) => {
    const item = customLayout[id];
    if (!item) return { dx: 0, dy: 0, fx: null, customLines: null, customFont: null, customSize: null, customColor: null };
    const dx = (typeof item.relX === 'number') ? Math.round(item.relX * cardWidth) : (item.offsetX || 0);
    const dy = (typeof item.relY === 'number') ? Math.round(item.relY * cardHeight) : (item.offsetY || 0);
    
    // Nếu là nền sáng, kiểm tra xem màu tùy chỉnh trong customColor có bị trắng hoặc quá sáng không
    let validCustomColor = item.color || null;
    if (isLightBg && validCustomColor) {
      if (isHexColorLight(validCustomColor) || validCustomColor === '#fff' || validCustomColor === '#ffffff' || validCustomColor === '#F4F7FA') {
        validCustomColor = null; // Huỷ màu trắng cũ đã lưu để fallback về TEXT_COLOR hoặc ACCENT_COLOR đậm
      }
    }

    return {
      dx, dy,
      fx: item.fx || null,
      customLines: Array.isArray(item.lines) ? item.lines : null,
      customFont: item.fontFamily || null,
      customSize: item.fontSize || null,
      customColor: validCustomColor
    };
  };

  // Safe image loader with timeout
  function loadImage(src) {
    if (!src) return Promise.resolve(null);
    return new Promise((resolve) => {
      const img = new Image();
      // Only set crossOrigin for external http(s) URLs, not data: or blob:
      if (/^https?:\/\//i.test(src)) {
        img.crossOrigin = 'anonymous';
      }
      let resolved = false;
      const done = (result) => {
        if (!resolved) {
          resolved = true;
          resolve(result);
        }
      };
      img.onload = () => done(img);
      img.onerror = () => {
        console.warn('Failed to load image in card-texture-generator');
        done(null);
      };
      // 2.5s fallback timeout so promise never hangs forever
      setTimeout(() => done(null), 2500);
      img.src = src;
    });
  }

  const [avatarImg, logoImg, scannedFrontImg, scannedBackImg] = await Promise.all([
    loadImage(profile.avatar),
    loadImage(profile.logo),
    loadImage(profile.scannedFrontPhoto),
    loadImage(profile.scannedBackPhoto)
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
  // Full bleeding out to the outer edges (x, y, w, h)
  function drawMaterialSurface(x, y, w, h, r, isBack = false) {
    ctx.save();
    roundRect(x, y, w, h, r);
    ctx.clip();

    // Nếu có ảnh chụp thật quét từ danh thiếp, dán trực tiếp lên làm bề mặt 3D
    const scannedPhoto = isBack ? scannedBackImg : scannedFrontImg;
    if (scannedPhoto) {
      ctx.drawImage(scannedPhoto, x, y, w, h);
      ctx.restore();
      return;
    }

    // 1. Base Gradient
    const baseGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    baseGrad.addColorStop(0, BG_COLOR);
    baseGrad.addColorStop(1, matPreset.shadow || '#050607');
    ctx.fillStyle = baseGrad;
    ctx.fill();

    // 2. Procedural Pattern Layer
    if (matKey === 'pvc') {
      // PVC Card: Lớp phủ bóng gương (High Gloss Specular Coat) với phản quang dải gradient nhẹ
      const gloss = ctx.createLinearGradient(x, y, x + w * 0.8, y + h);
      gloss.addColorStop(0, 'rgba(56, 189, 248, 0.14)');
      gloss.addColorStop(0.35, 'rgba(255, 255, 255, 0.08)');
      gloss.addColorStop(0.7, 'rgba(15, 23, 42, 0.25)');
      gloss.addColorStop(1, 'rgba(56, 189, 248, 0.12)');
      ctx.fillStyle = gloss;
      ctx.fill();
    } else if (matKey === 'titanium') {
      const pCvs = document.createElement('canvas');
      pCvs.width = 8; pCvs.height = 64;
      const pCtx = pCvs.getContext('2d');
      pCtx.fillStyle = 'rgba(255,255,255,0.03)';
      pCtx.fillRect(0, 0, 2, 64);
      pCtx.fillStyle = 'rgba(0,0,0,0.08)';
      pCtx.fillRect(3, 0, 3, 64);
      ctx.fillStyle = ctx.createPattern(pCvs, 'repeat');
      ctx.fill();

      const sweep = ctx.createLinearGradient(x, y, x + w * 0.7, y + h);
      sweep.addColorStop(0, 'rgba(255,255,255,0)');
      sweep.addColorStop(0.5, 'rgba(255,255,255,0.08)');
      sweep.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sweep;
      ctx.fill();
    } else if (matKey === 'brushed_steel' || matKey === 'silver') {
      // Brushed Steel / Inox Vân Xước (Stainless Steel Brushed Metal)
      const pCvs = document.createElement('canvas');
      pCvs.width = 128; pCvs.height = 4;
      const pCtx = pCvs.getContext('2d');
      // Đường vân xước kim loại ngang
      pCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      pCtx.fillRect(0, 0, 128, 1);
      pCtx.fillStyle = 'rgba(100, 116, 139, 0.25)';
      pCtx.fillRect(10, 2, 70, 1);
      pCtx.fillStyle = 'rgba(71, 85, 105, 0.2)';
      pCtx.fillRect(50, 3, 60, 1);
      ctx.fillStyle = ctx.createPattern(pCvs, 'repeat');
      ctx.fill();

      // Dải specular lướt sáng kim loại vát xiên
      const sweep = ctx.createLinearGradient(x, y, x + w, y + h);
      sweep.addColorStop(0, 'rgba(255,255,255,0.4)');
      sweep.addColorStop(0.3, 'rgba(203,213,225,0.15)');
      sweep.addColorStop(0.6, 'rgba(255,255,255,0.5)');
      sweep.addColorStop(1, 'rgba(148,163,184,0.25)');
      ctx.fillStyle = sweep;
      ctx.fill();
    } else if (matKey === 'acrylic' || matKey === 'frost') {
      // Acrylic Trong Suốt: Kính hữu cơ xuyên thấu với viền khúc xạ Fresnel bevel gloss
      const grad = ctx.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      grad.addColorStop(0.3, 'rgba(12, 25, 41, 0.7)');
      grad.addColorStop(0.7, 'rgba(4, 11, 20, 0.85)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.35)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (matKey === 'art_paper') {
      // Art Paper: Giấy Mỹ Thuật vân sợi bông cotton & kết cấu dập nổi cao cấp
      const pCvs = document.createElement('canvas');
      pCvs.width = 16; pCvs.height = 16;
      const pCtx = pCvs.getContext('2d');
      pCtx.fillStyle = '#F7F5F0';
      pCtx.fillRect(0, 0, 16, 16);
      pCtx.fillStyle = 'rgba(180, 165, 145, 0.22)';
      pCtx.fillRect(2, 3, 2, 1);
      pCtx.fillRect(9, 7, 3, 1);
      pCtx.fillRect(5, 12, 2, 1);
      pCtx.fillRect(13, 2, 1, 2);
      pCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      pCtx.fillRect(4, 5, 2, 2);
      pCtx.fillRect(11, 11, 2, 2);
      ctx.fillStyle = ctx.createPattern(pCvs, 'repeat');
      ctx.fill();
    }

    // 3. Contrast Scrim behind text region for accessibility
    // Chỉ tạo bóng đổ tối mờ phía sau văn bản khi nền là màu tối; với nền sáng (Inox Xước, Art Paper), không phủ bóng tối để tránh làm đục nền và gây bẩn/loang màu chữ
    if (!isLightBg) {
      const scrim = ctx.createLinearGradient(x, y, x + w * 0.65, y);
      scrim.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
      scrim.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = scrim;
      ctx.fill();
    }

    // 4. Accent Border (drawn inset by 2px from bleeding edge)
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

    // 2mm Bleed & Safe Margin calculation:
    // 860px / 85.6mm = 10.05 px/mm => 2mm = 20.1px
    const BLEED_PX = 20; // 2mm safe zone from physical cutting edge
    const SAFE_INSET_X = 24; // > 2mm
    const SAFE_INSET_Y = 22; // > 2mm

    // FRONT FACE (Top half)
    const fx = 82, fy = 0;
    drawMaterialSurface(fx, fy, W, H, R, false);

    // NẾU CÓ ẢNH SCAN MẶT TRƯỚC, KHÔNG ĐÈ TEXT PROFILE CŨ LÊN MẶT CARD
    if (scannedFrontImg) {
      // Đã vẽ ảnh quét xong, bỏ qua render text để ảnh danh thiếp thật hiển thị nguyên bản 100%
    } else {
    ctx.save();

    // Safe zone coordinates
    const safeLeft = fx + SAFE_INSET_X + 26; // fx + 50
    const safeRight = fx + W - SAFE_INSET_X - 16; // fx + 820
    const safeTop = fy + SAFE_INSET_Y + 18; // fy + 40
    const safeBottom = fy + H - SAFE_INSET_Y - 10; // fy + 488

    // Front Avatar (Right top) with Drag Offset
    const avOffset = getLayerOffset('avatar', W, H);
    const avW = 86, avH = 86;
    const avX = safeRight - avW + avOffset.dx;
    const avY = safeTop + 6 + avOffset.dy;

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
      ctx.fillText(getInitials(profile.fn), avX + avW / 2, avY + 54);
      ctx.textAlign = 'left';
    }

    // Left content area width (bounded to avoid colliding with Avatar)
    const pRowOffset = getLayerOffset('person_row', W, H);
    const nameOffset = getLayerOffset('name', W, H);
    const titleOffset = getLayerOffset('title', W, H);
    const orgOffset = getLayerOffset('org', W, H);

    const textStartX = safeLeft + 22 + pRowOffset.dx;
    const maxHeaderW = Math.max(200, (avX - textStartX - 20));

    // Name (Auto-wrap & Auto-scale)
    const nameRes = fitAndDrawText(ctx, {
      text: profile.fn || 'Chưa đặt tên',
      customLines: nameOffset.customLines,
      fx: nameOffset.fx,
      x: textStartX + nameOffset.dx,
      y: safeTop + 38 + pRowOffset.dy + nameOffset.dy,
      maxWidth: maxHeaderW,
      maxHeight: 76,
      baseFontSize: nameOffset.customSize || NAME_SIZE,
      minFontSize: 24,
      fontFamily: nameOffset.customFont || FONT_DISPLAY,
      fontWeight: 'bold',
      color: nameOffset.customColor || TEXT_COLOR,
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Title (Auto-wrap & Auto-scale)
    const titleRes = fitAndDrawText(ctx, {
      text: profile.title || 'Chuyên viên',
      customLines: titleOffset.customLines,
      fx: titleOffset.fx,
      x: textStartX + titleOffset.dx,
      y: nameRes.nextY + 4 + titleOffset.dy,
      maxWidth: maxHeaderW,
      maxHeight: 48,
      baseFontSize: titleOffset.customSize || TITLE_SIZE,
      minFontSize: 15,
      fontFamily: titleOffset.customFont || FONT_BODY,
      fontWeight: '600',
      color: titleOffset.customColor || ACCENT_COLOR,
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Org / Company (Auto-wrap & Auto-scale)
    const orgRes = fitAndDrawText(ctx, {
      text: profile.org || 'inid.me Identity',
      customLines: orgOffset.customLines,
      fx: orgOffset.fx,
      x: textStartX + orgOffset.dx,
      y: titleRes.nextY + 3 + orgOffset.dy,
      maxWidth: maxHeaderW,
      maxHeight: 42,
      baseFontSize: orgOffset.customSize || 19,
      minFontSize: 13,
      fontFamily: orgOffset.customFont || FONT_BODY,
      fontWeight: '500',
      color: orgOffset.customColor || TEXT_MUTED,
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Vertical Accent Bar (drawn alongside name/title block)
    const barTop = safeTop + 8;
    const barH = Math.max(80, orgRes.nextY - barTop - 4);
    ctx.fillStyle = ACCENT_COLOR;
    ctx.fillRect(safeLeft, barTop, 6, barH);

    // Dynamic Divider
    const divY = Math.max(fy + 200, orgRes.nextY + 12);
    ctx.strokeStyle = DIVIDER_COLOR;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(safeLeft, divY);
    ctx.lineTo(safeRight, divY);
    ctx.stroke();

    // Contact details with dynamic vertical spacing & auto-wrap on Address
    const maxContactW = (safeRight - safeLeft - 50);
    const iconX = safeLeft + 10;
    const textX = safeLeft + 48;
    let contactCurY = divY + 32;

    if (profile.tel && contactCurY < safeBottom - 50) {
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath(); ctx.arc(iconX + 10, contactCurY - 6, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '15px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📞', iconX, contactCurY);
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = `bold 21px ${FONT_BODY}`;
      ctx.fillText(profile.tel, textX, contactCurY);
      contactCurY += 44;
    }

    if (profile.email && contactCurY < safeBottom - 50) {
      ctx.fillStyle = ACCENT_COLOR;
      ctx.beginPath(); ctx.arc(iconX + 10, contactCurY - 6, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = '15px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('✉️', iconX, contactCurY);
      ctx.fillStyle = CONTACT_TEXT_COLOR;
      ctx.font = `500 20px ${FONT_BODY}`;
      ctx.fillText(profile.email, textX, contactCurY);
      contactCurY += 44;
    }

    const displayUrl = (profile.url || 'inid.me').replace(/^https?:\/\//i, '');
    if (displayUrl && contactCurY < safeBottom - 50) {
      ctx.fillStyle = '#0ea5e9';
      ctx.beginPath(); ctx.arc(iconX + 10, contactCurY - 6, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '15px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🌐', iconX, contactCurY);
      ctx.fillStyle = CONTACT_TEXT_COLOR;
      ctx.font = `500 20px ${FONT_BODY}`;
      ctx.fillText(displayUrl, textX, contactCurY);
      contactCurY += 44;
    }

    if (profile.adr && contactCurY < safeBottom - 35) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath(); ctx.arc(iconX + 10, contactCurY - 6, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '15px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('📍', iconX, contactCurY);

      // Address auto-wraps up to 2 lines
      fitAndDrawText(ctx, {
        text: profile.adr,
        x: textX,
        y: contactCurY,
        maxWidth: maxContactW,
        maxHeight: 46,
        baseFontSize: 18,
        minFontSize: 13,
        fontFamily: FONT_BODY,
        fontWeight: '500',
        color: TEXT_MUTED,
        maxLines: 2,
        lineHeightRatio: 1.2
      });
    }

    // Footer Tagline strictly inside safe bottom
    ctx.fillStyle = ACCENT_COLOR;
    ctx.font = `bold 15px ${FONT_DISPLAY}`;
    ctx.textAlign = 'left';
    ctx.letterSpacing = '1px';
    ctx.fillText(`INID.ME • ${matKey.toUpperCase()} PRO AR CARD`, safeLeft, safeBottom);

    ctx.restore();
    } // End if (!scannedFrontImg)

    // BACK FACE (Bottom half)
    const bx = 82, by = 504;
    drawMaterialSurface(bx, by, W, H, R, true);

    if (scannedBackImg) {
      // Đã vẽ ảnh quét mặt sau, bỏ qua render text đè lên
    } else {
    ctx.save();
    const bcx = bx + W / 2;
    const bSafeTop = by + SAFE_INSET_Y + 16;
    const bSafeBottom = by + H - SAFE_INSET_Y - 10;
    const bMaxW = W - (SAFE_INSET_X * 2) - 60; // Safe width

    // Logo / Emblem
    const lgW = 104, lgH = 104;
    const lgX = bcx - lgW / 2, lgY = bSafeTop + 6;

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
      ctx.fillText(getInitials(profile.org || profile.fn), bcx, lgY + 68);
    }

    // Company Title (Auto-wrap & Auto-scale)
    const bOrgRes = fitAndDrawText(ctx, {
      text: profile.org || 'inid.me Identity',
      x: bcx,
      y: lgY + lgH + 42,
      maxWidth: bMaxW,
      maxHeight: 74,
      baseFontSize: 38,
      minFontSize: 22,
      fontFamily: FONT_DISPLAY,
      fontWeight: 'bold',
      color: TEXT_COLOR,
      textAlign: 'center',
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Slogan / Tagline (Auto-wrap & Auto-scale)
    const bSloganRes = fitAndDrawText(ctx, {
      text: profile.slogan || profile.tagline || 'Smart AR Profile & Business Card',
      x: bcx,
      y: bOrgRes.nextY + 8,
      maxWidth: bMaxW,
      maxHeight: 52,
      baseFontSize: 22,
      minFontSize: 14,
      fontFamily: FONT_BODY,
      fontWeight: '600',
      color: ACCENT_COLOR,
      textAlign: 'center',
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Address (Auto-wrap & Auto-scale)
    if (profile.adr) {
      fitAndDrawText(ctx, {
        text: profile.adr,
        x: bcx,
        y: bSloganRes.nextY + 12,
        maxWidth: bMaxW,
        maxHeight: 48,
        baseFontSize: 20,
        minFontSize: 13,
        fontFamily: FONT_BODY,
        fontWeight: '500',
        color: TEXT_MUTED,
        textAlign: 'center',
        maxLines: 2,
        lineHeightRatio: 1.18
      });
    }

    // Sub-caption
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = `600 15px ${FONT_DISPLAY}`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText('TAP OR SCAN TO CONNECT INSTANTLY', bcx, bSafeBottom);

    ctx.restore();
    } // End if (!scannedBackImg)

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

    // 2mm Bleed & Safe Margin calculation:
    // 480px / 53.98mm = 8.89 px/mm => 2mm = 17.8px
    const SAFE_INSET = 22; // > 2mm from card outer edge

    // FRONT FACE (Left: X=20, Y=115)
    const fx = 20, fy = 115;
    drawMaterialSurface(fx, fy, W, H, R, false);

    if (scannedFrontImg) {
      // Đã vẽ ảnh quét mặt trước, bỏ qua render text
    } else {
    ctx.save();
    const cx = fx + W / 2;
    const safeLeft = fx + SAFE_INSET + 8; // fx + 30
    const safeRight = fx + W - SAFE_INSET - 8; // fx + 450
    const safeTop = fy + SAFE_INSET + 8; // fy + 30
    const safeBottom = fy + H - SAFE_INSET - 8; // fy + 764
    const maxVTextW = safeRight - safeLeft; // 420px

    // Vertical Offsets from Custom Layout
    const vPRowOffset = getLayerOffset('person_row', W, H);
    const vNameOffset = getLayerOffset('name', W, H);
    const vTitleOffset = getLayerOffset('title', W, H);
    const vOrgOffset = getLayerOffset('org', W, H);
    const vAvOffset = getLayerOffset('avatar', W, H);

    // Avatar Circle (Centered top)
    const avR = 52;
    const avY = safeTop + 72 + vAvOffset.dy + vPRowOffset.dy;
    const avCenterX = cx + vAvOffset.dx + vPRowOffset.dx;
    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(avCenterX, avY, avR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, avCenterX - avR, avY - avR, avR * 2, avR * 2);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(avCenterX, avY, avR, 0, Math.PI * 2);
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(avCenterX, avY, avR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ACCENT_COLOR;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = ACCENT_COLOR;
      ctx.font = `bold 36px ${FONT_DISPLAY}`;
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.fn), avCenterX, avY + 13);
    }

    // Name (Auto-wrap & Auto-scale)
    const vNameRes = fitAndDrawText(ctx, {
      text: profile.fn || 'Chưa đặt tên',
      customLines: vNameOffset.customLines,
      fx: vNameOffset.fx,
      x: cx + vNameOffset.dx + vPRowOffset.dx,
      y: avY + avR + 34 + vNameOffset.dy,
      maxWidth: maxVTextW,
      maxHeight: 74,
      baseFontSize: vNameOffset.customSize || (NAME_SIZE - 4),
      minFontSize: 20,
      fontFamily: vNameOffset.customFont || FONT_DISPLAY,
      fontWeight: 'bold',
      color: vNameOffset.customColor || TEXT_COLOR,
      textAlign: 'center',
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Title (Auto-wrap & Auto-scale)
    const vTitleRes = fitAndDrawText(ctx, {
      text: profile.title || 'Chuyên viên',
      customLines: vTitleOffset.customLines,
      fx: vTitleOffset.fx,
      x: cx + vTitleOffset.dx + vPRowOffset.dx,
      y: vNameRes.nextY + 6 + vTitleOffset.dy,
      maxWidth: maxVTextW,
      maxHeight: 46,
      baseFontSize: vTitleOffset.customSize || (TITLE_SIZE - 2),
      minFontSize: 14,
      fontFamily: vTitleOffset.customFont || FONT_BODY,
      fontWeight: 'bold',
      color: vTitleOffset.customColor || ACCENT_COLOR,
      textAlign: 'center',
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Org / Company (Auto-wrap & Auto-scale)
    const vOrgRes = fitAndDrawText(ctx, {
      text: profile.org || 'inid.me Identity',
      customLines: vOrgOffset.customLines,
      fx: vOrgOffset.fx,
      x: cx + vOrgOffset.dx + vPRowOffset.dx,
      y: vTitleRes.nextY + 4 + vOrgOffset.dy,
      maxWidth: maxVTextW,
      maxHeight: 40,
      baseFontSize: 18,
      minFontSize: 13,
      fontFamily: FONT_BODY,
      fontWeight: '500',
      color: TEXT_MUTED,
      textAlign: 'center',
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Dynamic Divider
    const vDivY = Math.max(fy + 335, vOrgRes.nextY + 12);
    ctx.strokeStyle = DIVIDER_COLOR;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(safeLeft, vDivY);
    ctx.lineTo(safeRight, vDivY);
    ctx.stroke();

    // Contact Details with safe auto-wrapping
    let vCurY = vDivY + 36;
    const vContactMaxW = safeRight - safeLeft - 30;

    if (profile.tel && vCurY < safeBottom - 70) {
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = `bold 19px ${FONT_BODY}`;
      ctx.textAlign = 'left';
      ctx.fillText(`📞  ${profile.tel}`, safeLeft, vCurY);
      vCurY += 40;
    }
    if (profile.email && vCurY < safeBottom - 70) {
      ctx.fillStyle = CONTACT_TEXT_COLOR;
      ctx.font = `500 17px ${FONT_BODY}`;
      ctx.textAlign = 'left';
      ctx.fillText(`✉️  ${profile.email}`, safeLeft, vCurY);
      vCurY += 40;
    }
    const displayUrl = (profile.url || 'inid.me').replace(/^https?:\/\//i, '');
    if (displayUrl && vCurY < safeBottom - 70) {
      ctx.fillStyle = CONTACT_TEXT_COLOR;
      ctx.font = `500 17px ${FONT_BODY}`;
      ctx.textAlign = 'left';
      ctx.fillText(`🌐  ${displayUrl}`, safeLeft, vCurY);
      vCurY += 40;
    }
    if (profile.adr && vCurY < safeBottom - 50) {
      ctx.fillStyle = TEXT_MUTED;
      ctx.font = `15px ${FONT_BODY}`;
      ctx.textAlign = 'left';
      ctx.fillText(`📍`, safeLeft, vCurY);

      fitAndDrawText(ctx, {
        text: profile.adr,
        x: safeLeft + 28,
        y: vCurY,
        maxWidth: vContactMaxW - 28,
        maxHeight: 46,
        baseFontSize: 15,
        minFontSize: 12,
        fontFamily: FONT_BODY,
        fontWeight: '500',
        color: TEXT_MUTED,
        maxLines: 2,
        lineHeightRatio: 1.15
      });
    }

    // Slogan
    if (profile.slogan || profile.tagline) {
      fitAndDrawText(ctx, {
        text: profile.slogan || profile.tagline,
        x: cx,
        y: safeBottom - 45,
        maxWidth: maxVTextW,
        maxHeight: 36,
        baseFontSize: 15,
        minFontSize: 12,
        fontFamily: FONT_BODY,
        fontWeight: 'italic 500',
        color: ACCENT_COLOR,
        textAlign: 'center',
        maxLines: 2,
        lineHeightRatio: 1.15
      });
    }

    // Footer
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = `bold 13px ${FONT_DISPLAY}`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText(`INID.ME • ${matKey.toUpperCase()} PRO`, cx, safeBottom);
    ctx.restore();
    } // End if (!scannedFrontImg)

    // BACK FACE (Right: X=524, Y=115)
    const bx = 524, by = 115;
    drawMaterialSurface(bx, by, W, H, R, true);

    if (scannedBackImg) {
      // Đã vẽ ảnh quét mặt sau, bỏ qua render text
    } else {
    ctx.save();
    const bcx = bx + W / 2;
    const bSafeLeft = bx + SAFE_INSET + 8;
    const bSafeRight = bx + W - SAFE_INSET - 8;
    const bSafeTop = by + SAFE_INSET + 8;
    const bSafeBottom = by + H - SAFE_INSET - 8;
    const bMaxVTextW = bSafeRight - bSafeLeft;

    // Logo
    const bLgW = 110, bLgH = 110;
    const bLgX = bcx - bLgW / 2, bLgY = bSafeTop + 65;

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
      ctx.font = `bold 44px ${FONT_DISPLAY}`;
      ctx.textAlign = 'center';
      ctx.fillText(getInitials(profile.org || profile.fn), bcx, bLgY + 70);
    }

    // Company Title (Auto-wrap & Auto-scale)
    const bVOrgRes = fitAndDrawText(ctx, {
      text: profile.org || 'inid.me Identity',
      x: bcx,
      y: bLgY + bLgH + 46,
      maxWidth: bMaxVTextW,
      maxHeight: 74,
      baseFontSize: 34,
      minFontSize: 19,
      fontFamily: FONT_DISPLAY,
      fontWeight: 'bold',
      color: TEXT_COLOR,
      textAlign: 'center',
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Slogan (Auto-wrap & Auto-scale)
    const bVSloganRes = fitAndDrawText(ctx, {
      text: profile.slogan || profile.tagline || 'Smart AR Profile & Business Card',
      x: bcx,
      y: bVOrgRes.nextY + 8,
      maxWidth: bMaxVTextW,
      maxHeight: 46,
      baseFontSize: 18,
      minFontSize: 13,
      fontFamily: FONT_BODY,
      fontWeight: 'bold italic',
      color: ACCENT_COLOR,
      textAlign: 'center',
      maxLines: 2,
      lineHeightRatio: 1.15
    });

    // Address (Auto-wrap & Auto-scale)
    if (profile.adr) {
      fitAndDrawText(ctx, {
        text: profile.adr,
        x: bcx,
        y: bVSloganRes.nextY + 12,
        maxWidth: bMaxVTextW,
        maxHeight: 46,
        baseFontSize: 17,
        minFontSize: 12,
        fontFamily: FONT_BODY,
        fontWeight: '500',
        color: TEXT_MUTED,
        textAlign: 'center',
        maxLines: 2,
        lineHeightRatio: 1.15
      });
    }

    // Sub-caption
    ctx.fillStyle = TEXT_MUTED;
    ctx.font = `600 13px ${FONT_DISPLAY}`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText('TAP OR SCAN TO CONNECT INSTANTLY', bcx, bSafeBottom);
    ctx.restore();
    } // End if (!scannedBackImg)
  }

  return cvs;
}
