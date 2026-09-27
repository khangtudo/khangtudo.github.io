import { sendOtpEmail } from './mail.js';

// CORS response helper
function corsResponse(body, status = 200, headers = {}) {
  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8',
    ...headers
  };
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: defaultHeaders
  });
}

function generateNumericOtp(length = 6) {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

function generateCardId(length = 8) {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function maskEmail(email) {
  if (!email || !email.includes('@')) return '***@***.com';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return user[0] + '***@' + domain;
  return user[0] + '***' + user[user.length - 1] + '@' + domain;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '');
    const method = request.method.toUpperCase();

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return corsResponse({}, 204);
    }

    try {
      // -------------------------------------------------------------
      // 1. POST /api/card/request-otp
      // -------------------------------------------------------------
      if (path === '/api/card/request-otp' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const email = (body.email || '').trim().toLowerCase();
        const cardId = (body.cardId || '').trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return corsResponse({ error: 'Địa chỉ email không hợp lệ.' }, 400);
        }

        // If cardId is provided, verify card exists and matches owner email
        let targetCard = null;
        if (cardId) {
          const rawCard = await env.INID_KV.get(`card:${cardId}`);
          if (!rawCard) {
            return corsResponse({ error: 'Không tìm thấy thông tin danh thiếp.' }, 404);
          }
          targetCard = JSON.parse(rawCard);
          if (targetCard.email !== email) {
            return corsResponse({ error: 'Email không khớp với chủ sở hữu của danh thiếp này.' }, 403);
          }
        }

        // Rate limiting check: check if last OTP request was sent less than 45s ago
        const existingOtpKey = `otp:${email}`;
        const existingOtpRaw = await env.INID_KV.get(existingOtpKey);
        if (existingOtpRaw) {
          const existingData = JSON.parse(existingOtpRaw);
          if (existingData.createdAt && (Date.now() - existingData.createdAt < 45000)) {
            const waitSec = Math.ceil((45000 - (Date.now() - existingData.createdAt)) / 1000);
            return corsResponse({ error: `Vui lòng chờ ${waitSec} giây trước khi yêu cầu mã mới.` }, 429);
          }
        }

        const otp = generateNumericOtp(6);
        const otpData = {
          otp,
          email,
          cardId: cardId || null,
          createdAt: Date.now(),
          attempts: 0
        };

        // Save OTP to KV with 10-minute expiration (600 seconds)
        await env.INID_KV.put(existingOtpKey, JSON.stringify(otpData), {
          expirationTtl: 600
        });

        // Send email via MailChannels / Resend
        await sendOtpEmail(env, {
          email,
          otp,
          link: cardId ? `https://inid.me/p/${cardId}` : 'https://inid.me',
          purpose: cardId ? 'edit' : 'create'
        });

        return corsResponse({
          success: true,
          message: `Mã OTP đã được gửi đến email ${maskEmail(email)}.`,
          emailMasked: maskEmail(email),
          expiresInSeconds: 600
        });
      }

      // -------------------------------------------------------------
      // 2. POST /api/card/verify-otp
      // -------------------------------------------------------------
      if (path === '/api/card/verify-otp' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const email = (body.email || '').trim().toLowerCase();
        const inputOtp = (body.otp || '').trim();
        const initialProfile = body.initialProfile || {};

        if (!email || !inputOtp) {
          return corsResponse({ error: 'Thiếu email hoặc mã OTP.' }, 400);
        }

        const otpKey = `otp:${email}`;
        const rawOtp = await env.INID_KV.get(otpKey);
        if (!rawOtp) {
          return corsResponse({ error: 'Mã OTP không hợp lệ hoặc đã hết hạn.' }, 400);
        }

        const storedOtp = JSON.parse(rawOtp);
        if (storedOtp.attempts >= 5) {
          await env.INID_KV.delete(otpKey);
          return corsResponse({ error: 'Đã nhập sai quá 5 lần. Vui lòng yêu cầu mã OTP mới.' }, 429);
        }

        if (storedOtp.otp !== inputOtp) {
          storedOtp.attempts = (storedOtp.attempts || 0) + 1;
          await env.INID_KV.put(otpKey, JSON.stringify(storedOtp), { expirationTtl: 300 });
          const remain = 5 - storedOtp.attempts;
          return corsResponse({ error: `Mã OTP không chính xác. Còn lại ${remain} lần thử.` }, 400);
        }

        // OTP is correct! Clear OTP from KV
        await env.INID_KV.delete(otpKey);

        const editToken = crypto.randomUUID();

        // CASE A: Verifying existing card on a new device
        if (storedOtp.cardId) {
          const cardKey = `card:${storedOtp.cardId}`;
          const rawCard = await env.INID_KV.get(cardKey);
          if (!rawCard) {
            return corsResponse({ error: 'Không tìm thấy danh thiếp.' }, 404);
          }
          const cardData = JSON.parse(rawCard);
          cardData.editTokens = cardData.editTokens || [];
          cardData.editTokens.push({ token: editToken, addedAt: new Date().toISOString() });
          // Keep only the latest 5 devices
          if (cardData.editTokens.length > 5) {
            cardData.editTokens = cardData.editTokens.slice(-5);
          }
          await env.INID_KV.put(cardKey, JSON.stringify(cardData));

          return corsResponse({
            success: true,
            isNew: false,
            cardId: storedOtp.cardId,
            editToken,
            profile: cardData.profile,
            universalUrl: `https://inid.me/p/${storedOtp.cardId}`
          });
        }

        // CASE B: Creating a brand new card
        let newCardId = generateCardId(8);
        // Ensure no collision
        let existing = await env.INID_KV.get(`card:${newCardId}`);
        while (existing) {
          newCardId = generateCardId(8);
          existing = await env.INID_KV.get(`card:${newCardId}`);
        }

        const newCardData = {
          id: newCardId,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          profile: initialProfile,
          editTokens: [{ token: editToken, addedAt: new Date().toISOString() }]
        };

        await env.INID_KV.put(`card:${newCardId}`, JSON.stringify(newCardData));

        // Save card index for user email
        const userCardsKey = `user_cards:${email}`;
        const rawUserCards = await env.INID_KV.get(userCardsKey);
        const userCards = rawUserCards ? JSON.parse(rawUserCards) : [];
        userCards.push(newCardId);
        await env.INID_KV.put(userCardsKey, JSON.stringify(userCards));

        return corsResponse({
          success: true,
          isNew: true,
          cardId: newCardId,
          editToken,
          profile: initialProfile,
          universalUrl: `https://inid.me/p/${newCardId}`
        });
      }

      // -------------------------------------------------------------
      // 3. GET /api/card/:id
      // -------------------------------------------------------------
      const cardMatch = path.match(/^\/api\/card\/([a-zA-Z0-9_-]+)$/);
      if (cardMatch && method === 'GET') {
        const reqCardId = cardMatch[1];
        const rawCard = await env.INID_KV.get(`card:${reqCardId}`);
        if (!rawCard) {
          return corsResponse({ error: 'Không tìm thấy danh thiếp.' }, 404);
        }
        const card = JSON.parse(rawCard);

        return corsResponse({
          success: true,
          card: {
            id: card.id,
            profile: card.profile,
            createdAt: card.createdAt,
            updatedAt: card.updatedAt,
            emailMasked: maskEmail(card.email)
          }
        });
      }

      // -------------------------------------------------------------
      // 4. PUT /api/card/:id (Update card with editToken)
      // -------------------------------------------------------------
      if (cardMatch && method === 'PUT') {
        const reqCardId = cardMatch[1];
        const authHeader = request.headers.get('Authorization') || '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();

        if (!token) {
          return corsResponse({ error: 'Yêu cầu token xác thực để cập nhật danh thiếp.' }, 401);
        }

        const rawCard = await env.INID_KV.get(`card:${reqCardId}`);
        if (!rawCard) {
          return corsResponse({ error: 'Không tìm thấy danh thiếp.' }, 404);
        }
        const card = JSON.parse(rawCard);

        const hasValidToken = (card.editTokens || []).some(t => t.token === token);
        if (!hasValidToken) {
          return corsResponse({ error: 'Phiên xác thực không hợp lệ hoặc đã hết hạn.' }, 403);
        }

        const body = await request.json().catch(() => ({}));
        if (!body.profile) {
          return corsResponse({ error: 'Thiếu dữ liệu profile.' }, 400);
        }

        card.profile = Object.assign(card.profile || {}, body.profile);
        card.updatedAt = new Date().toISOString();

        await env.INID_KV.put(`card:${reqCardId}`, JSON.stringify(card));

        return corsResponse({
          success: true,
          message: 'Đã cập nhật danh thiếp thành công!',
          card: {
            id: card.id,
            profile: card.profile,
            updatedAt: card.updatedAt
          }
        });
      }

      // Fallback 404 for unknown endpoints
      return corsResponse({ error: 'Endpoint không tồn tại.', endpoint: path }, 404);

    } catch (err) {
      console.error('Worker internal error:', err);
      return corsResponse({ error: 'Lỗi máy chủ nội bộ: ' + err.message }, 500);
    }
  }
};
