import { sendOtpEmail, sendCardReadyEmail } from './mail.js';

// List of common disposable / temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com', '10minutemail.net', 'guerrillamail.com', 'guerrillamail.net',
  'guerrillamail.org', 'tempmail.com', 'temp-mail.org', 'mailinator.com',
  'throwawaymail.com', 'fakeinbox.com', 'getairmail.com', 'sharklasers.com',
  'yopmail.com', 'yopmail.fr', 'trashmail.com', 'trashmail.net',
  'maildrop.cc', 'dispostable.com', 'crazymailing.com', 'mytemp.email'
]);

function isDisposableEmail(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase().trim();
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

// CORS response helper
function corsResponse(body, status = 200, headers = {}) {
  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Turnstile-Token',
    ...headers
  };

  if (status === 204) {
    return new Response(null, {
      status: 204,
      headers: defaultHeaders
    });
  }

  defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';

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

// Turnstile token verification helper
async function verifyTurnstileToken(secretKey, token, ip) {
  if (!secretKey) return true; // If TURNSTILE_SECRET_KEY is not configured, bypass gracefully
  if (!token) return false;

  try {
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });
    const outcome = await res.json();
    return outcome.success === true;
  } catch (err) {
    console.error('Turnstile verification error:', err);
    return true; // Fail open if Cloudflare turnstile API is unreachable
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '');
    const method = request.method.toUpperCase();

    // Client IP from Cloudflare header
    const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return corsResponse(null, 204);
    }

    try {
      // -------------------------------------------------------------
      // 1. POST /api/card/request-otp
      // -------------------------------------------------------------
      if (path === '/api/card/request-otp' && method === 'POST') {
        const body = await request.json().catch(() => ({}));
        const email = (body.email || '').trim().toLowerCase();
        const cardId = (body.cardId || '').trim();
        const turnstileToken = body.turnstileToken || request.headers.get('X-Turnstile-Token') || '';

        // Check 1: Valid email format
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return corsResponse({ error: 'Địa chỉ email không hợp lệ.' }, 400);
        }

        // Lớp 2: Chặn Disposable / Temporary Email
        if (isDisposableEmail(email)) {
          return corsResponse({ error: 'Không hỗ trợ sử dụng địa chỉ email rác / tạm thời.' }, 400);
        }

        // Lớp 3: Cloudflare Turnstile Verification (nếu được cấu hình secret)
        if (env && env.TURNSTILE_SECRET_KEY) {
          const isHuman = await verifyTurnstileToken(env.TURNSTILE_SECRET_KEY, turnstileToken, clientIp);
          if (!isHuman) {
            return corsResponse({ error: 'Xác thực bảo mật Turnstile không hợp lệ. Vui lòng thử lại.' }, 403);
          }
        }

        // Lớp 1: IP Rate Limiting (Chặn bào quota từ 1 địa chỉ IP)
        // Quy tắc: Tối đa 5 lượt gửi OTP trong vòng 10 phút trên cùng 1 IP
        const ipKey = `ip_limit:${clientIp}`;
        const ipRaw = await env.INID_KV.get(ipKey);
        let ipData = ipRaw ? JSON.parse(ipRaw) : { count: 0, firstReq: Date.now() };

        if (ipData.count >= 5) {
          return corsResponse({ 
            error: 'Bạn đã yêu cầu gửi mã quá nhiều lần từ thiết bị này. Vui lòng chờ 10 phút.' 
          }, 429);
        }

        // Rate limiting check cho từng Email riêng biệt (cooldown 45s)
        const existingOtpKey = `otp:${email}`;
        const existingOtpRaw = await env.INID_KV.get(existingOtpKey);
        if (existingOtpRaw) {
          const existingData = JSON.parse(existingOtpRaw);
          if (existingData.createdAt && (Date.now() - existingData.createdAt < 45000)) {
            const waitSec = Math.ceil((45000 - (Date.now() - existingData.createdAt)) / 1000);
            return corsResponse({ error: `Vui lòng chờ ${waitSec} giây trước khi yêu cầu mã mới.` }, 429);
          }
        }

        // If cardId is provided, verify card exists and matches owner email
        if (cardId) {
          const rawCard = await env.INID_KV.get(`card:${cardId}`);
          if (!rawCard) {
            return corsResponse({ error: 'Không tìm thấy thông tin danh thiếp.' }, 404);
          }
          const targetCard = JSON.parse(rawCard);
          if (targetCard.email !== email) {
            return corsResponse({ error: 'Email không khớp với chủ sở hữu của danh thiếp này.' }, 403);
          }
        }

        // Tăng đếm rate limit IP và lưu với TTL 600s (10 phút)
        ipData.count += 1;
        await env.INID_KV.put(ipKey, JSON.stringify(ipData), { expirationTtl: 600 });

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

        // Send email via MailChannels / Brevo / Resend
        const mailResult = await sendOtpEmail(env, {
          email,
          otp,
          link: cardId ? `https://inid.me/p/${cardId}` : 'https://inid.me',
          purpose: cardId ? 'edit' : 'create'
        });

        if (!mailResult.success) {
          // Xóa OTP khỏi KV vì gửi mail không thành công, tránh rác và tránh lộ OTP
          await env.INID_KV.delete(existingOtpKey);
          return corsResponse({
            error: 'Không thể gửi mã OTP qua email vào lúc này. Vui lòng thử lại sau hoặc liên hệ quản trị viên.',
            details: mailResult.error || 'Mail delivery failed',
            debug: mailResult.debug || null
          }, 502);
        }

        return corsResponse({
          success: true,
          message: `Mã OTP đã được gửi đến email ${maskEmail(email)}.`,
          emailMasked: maskEmail(email),
          expiresInSeconds: 600,
          provider: mailResult.provider
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
          if (cardData.editTokens.length > 5) {
            cardData.editTokens = cardData.editTokens.slice(-5);
          }
          await env.INID_KV.put(cardKey, JSON.stringify(cardData));

          // Also send email with card URL for record storage
          ctx.waitUntil(
            sendCardReadyEmail(env, {
              email,
              cardId: storedOtp.cardId,
              cardUrl: `https://inid.me/?id=${storedOtp.cardId}`,
              profile: cardData.profile || {}
            }).catch(err => console.warn('Failed to send card info email:', err))
          );

          return corsResponse({
            success: true,
            isNew: false,
            cardId: storedOtp.cardId,
            editToken,
            profile: cardData.profile,
            universalUrl: `https://inid.me/?id=${storedOtp.cardId}`,
            shortUrl: `https://inid.me/p/${storedOtp.cardId}`
          });
        }

        // CASE B: Creating a brand new card
        let newCardId = generateCardId(8);
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

        const userCardsKey = `user_cards:${email}`;
        const rawUserCards = await env.INID_KV.get(userCardsKey);
        const userCards = rawUserCards ? JSON.parse(rawUserCards) : [];
        userCards.push(newCardId);
        await env.INID_KV.put(userCardsKey, JSON.stringify(userCards));

        // Asynchronously send notification email containing the unique URL
        ctx.waitUntil(
          sendCardReadyEmail(env, {
            email,
            cardId: newCardId,
            cardUrl: `https://inid.me/?id=${newCardId}`,
            profile: initialProfile
          }).catch(err => console.warn('Failed to send card ready email:', err))
        );

        return corsResponse({
          success: true,
          isNew: true,
          cardId: newCardId,
          editToken,
          profile: initialProfile,
          universalUrl: `https://inid.me/?id=${newCardId}`,
          shortUrl: `https://inid.me/p/${newCardId}`
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

      return corsResponse({ error: 'Endpoint không tồn tại.', endpoint: path }, 404);

    } catch (err) {
      console.error('Worker internal error:', err);
      return corsResponse({ error: 'Lỗi máy chủ nội bộ: ' + err.message }, 500);
    }
  }
};
