// 2-Sided AR Business Card Generator for WebGL / Scene Viewer / Quick Look
// Both .glb and .usdz have 2 real physical faces:
// - Front face: Personal Info (Avatar, Name, Title, Org, Contacts, QR mini)
// - Back face: Company Info (Logo, Company Name, Slogan, Address, Website)

export const CARD_W = 0.091; // 91mm ISO ID-1
export const CARD_H = 0.055; // 55mm
export const CARD_D = 0.0008; // 0.8mm real card thickness
export const TEX_W = 1024;
export const TEX_H = 619;

// Render Front Face Canvas Texture
export function drawFrontCanvas(profile) {
  const c = document.createElement('canvas');
  c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d');

  // Modern Dark Titanium Gradient
  const grad = g.createLinearGradient(0, 0, TEX_W, TEX_H);
  grad.addColorStop(0, '#131b2e');
  grad.addColorStop(1, '#090d16');
  g.fillStyle = grad;
  g.fillRect(0, 0, TEX_W, TEX_H);

  // Holographic Cyber Border
  g.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  g.lineWidth = 4;
  g.strokeRect(20, 20, TEX_W - 40, TEX_H - 40);

  // Cyan Accent Beam
  g.fillStyle = '#38bdf8';
  g.fillRect(50, 60, 6, 90);

  const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  // Name & Title
  g.font = `bold 54px ${FONT}`;
  g.fillStyle = '#ffffff';
  g.fillText(profile.fn || 'Phan Mạnh Khang', 72, 110);

  g.font = `600 28px ${FONT}`;
  g.fillStyle = '#38bdf8';
  g.fillText(profile.title || 'Kỹ Thuật Viên Trưởng', 72, 150);

  // Org
  g.font = `500 26px ${FONT}`;
  g.fillStyle = '#94a3b8';
  g.fillText(profile.org || 'Minh Tam Prolab', 72, 195);

  // Divider line
  g.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(50, 230);
  g.lineTo(TEX_W - 50, 230);
  g.stroke();

  // Contacts
  const drawContact = (icon, text, y) => {
    if (!text) return;
    g.font = `24px ${FONT}`;
    g.fillStyle = '#e2e8f0';
    g.fillText(`${icon}  ${text}`, 60, y);
  };

  drawContact('📞', profile.tel || '+84 90 111 2233', 290);
  drawContact('✉️', profile.email || 'khang@minhtamprolab.com.vn', 350);
  drawContact('🌐', (profile.url || 'inid.me').replace(/^https?:\/\//i, ''), 410);

  // Bottom Badge
  g.font = `bold 18px ${FONT}`;
  g.fillStyle = 'rgba(56, 189, 248, 0.8)';
  g.fillText('INID.ME • SMART AR PROFILE', 60, TEX_H - 50);

  return c;
}

// Render Back Face Canvas Texture
export function drawBackCanvas(profile) {
  const c = document.createElement('canvas');
  c.width = TEX_W; c.height = TEX_H;
  const g = c.getContext('2d');

  // Deep Premium Gradient
  const grad = g.createLinearGradient(0, 0, TEX_W, TEX_H);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#020617');
  g.fillStyle = grad;
  g.fillRect(0, 0, TEX_W, TEX_H);

  // Border
  g.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  g.lineWidth = 4;
  g.strokeRect(20, 20, TEX_W - 40, TEX_H - 40);

  const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  g.textAlign = 'center';

  // Back Company Title
  g.font = `bold 48px ${FONT}`;
  g.fillStyle = '#ffffff';
  g.fillText(profile.org || 'Minh Tam Prolab', TEX_W / 2, 220);

  // Tagline / Slogan
  g.font = `italic 26px ${FONT}`;
  g.fillStyle = '#38bdf8';
  g.fillText(profile.slogan || 'Professional Digital Laboratory', TEX_W / 2, 275);

  // Address
  g.font = `22px ${FONT}`;
  g.fillStyle = '#94a3b8';
  g.fillText(profile.adr || '40A-40B Lý Tự Trọng, Phường Sài Gòn, TPHCM', TEX_W / 2, 340);

  // QR Frame Notice
  g.font = `600 20px ${FONT}`;
  g.fillStyle = 'rgba(255, 255, 255, 0.4)';
  g.fillText('TAP OR SCAN TO CONNECT INSTANTLY', TEX_W / 2, TEX_H - 70);

  return c;
}

// Single Composite Double-Sided Texture (Front Left, Back Right in 2048x1024 or Side-by-Side)
export async function generateDoubleSidedTexture(profile) {
  const front = drawFrontCanvas(profile);
  const back = drawBackCanvas(profile);

  const comp = document.createElement('canvas');
  comp.width = 1024;
  comp.height = 1024;
  const ctx = comp.getContext('2d');

  // Top half: Front Face (1024x512)
  ctx.drawImage(front, 0, 0, 1024, 512);
  // Bottom half: Back Face (1024x512)
  ctx.drawImage(back, 0, 512, 1024, 512);

  return new Promise((resolve, reject) => {
    comp.toBlob(b => b ? b.arrayBuffer().then(a => resolve(new Uint8Array(a))) : reject(new Error('Texture blob failed')), 'image/png');
  });
}
