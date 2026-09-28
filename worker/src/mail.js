/**
 * Mail service helper for inid.me Worker
 * Supports:
 * 1. Brevo (Sendinblue) API - 300 emails/day free tier (Key: BREVO_API_KEY)
 * 2. Resend API - 100 emails/day free tier (Key: RESEND_API_KEY)
 * 3. MailChannels native Cloudflare Worker relay
 */

export async function sendOtpEmail(env, { email, otp, link, purpose = 'create' }) {
  const isCreate = purpose === 'create';
  const subject = isCreate
    ? `[inid.me] Mã xác thực OTP tạo danh thiếp: ${otp}`
    : `[inid.me] Mã xác thực OTP chỉnh sửa danh thiếp: ${otp}`;

  const purposeText = isCreate
    ? 'Bạn đang yêu cầu tạo mới Danh Thiếp Thông Minh tại <strong>inid.me</strong>.'
    : 'Bạn đang yêu cầu xác thực quyền sở hữu để chỉnh sửa Danh Thiếp Thông Minh trên thiết bị này.';

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin:0; padding:0; background-color:#070a12; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#cbd5e1; }
    .container { max-width:540px; margin:30px auto; background:#0f172a; border-radius:16px; border:1px solid rgba(56,189,248,0.25); overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.6); }
    .header { padding:28px; text-align:center; background:linear-gradient(180deg, rgba(56,189,248,0.12) 0%, transparent 100%); border-bottom:1px solid rgba(255,255,255,0.06); }
    .brand { font-size:24px; font-weight:800; color:#ffffff; letter-spacing:-0.5px; }
    .brand-accent { color:#38bdf8; }
    .tagline { font-size:12px; color:#94a3b8; margin-top:4px; text-transform:uppercase; letter-spacing:1px; }
    .content { padding:32px 28px; }
    .h1 { font-size:18px; font-weight:600; color:#ffffff; margin:0 0 12px 0; text-align:center; }
    .desc { font-size:14px; line-height:1.6; color:#94a3b8; text-align:center; margin-bottom:24px; }
    .otp-box { background:#070a12; border:2px dashed #38bdf8; border-radius:12px; padding:20px; text-align:center; margin:24px 0; }
    .otp-label { font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#38bdf8; font-weight:700; margin-bottom:8px; }
    .otp-code { font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:36px; font-weight:800; color:#38bdf8; letter-spacing:8px; margin:0; }
    .expiry { font-size:12px; color:#64748b; margin-top:8px; }
    .info-card { background:rgba(255,255,255,0.03); border-radius:10px; padding:16px; margin-top:24px; font-size:13px; line-height:1.5; color:#94a3b8; }
    .info-card strong { color:#e2e8f0; }
    .footer { padding:20px; text-align:center; font-size:12px; color:#475569; border-top:1px solid rgba(255,255,255,0.05); }
    .footer a { color:#38bdf8; text-decoration:none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">inid<span class="brand-accent">.me</span></div>
      <div class="tagline">Smart AR & Offline vCard Platform</div>
    </div>
    <div class="content">
      <h1 class="h1">Xác Thực Danh Thiếp</h1>
      <p class="desc">${purposeText}<br>Sử dụng mã OTP bên dưới để hoàn tất xác thực.</p>
      
      <div class="otp-box">
        <div class="otp-label">Mã Xác Thực Một Lần (OTP)</div>
        <div class="otp-code">${otp}</div>
        <div class="expiry">Mã có hiệu lực trong 10 phút. Tuyệt đối không chia sẻ mã này.</div>
      </div>

      <div class="info-card">
        <strong>🌐 Liên kết định danh độc nhất là gì?</strong><br>
        Đây là địa chỉ web cố định và riêng biệt dành cho danh thiếp thông minh của bạn. Khi bạn đổi thiết bị (từ máy tính sang điện thoại hay máy tính bảng), chỉ cần mở liên kết và xác thực lại bằng mã OTP gửi về email này để tiếp tục cập nhật thông tin.
      </div>
    </div>
    <div class="footer">
      Email tự động từ hệ thống <a href="https://inid.me" target="_blank">inid.me</a>.<br>
      Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.
    </div>
  </div>
</body>
</html>`;

  // 1. Try MailChannels API if MAILCHANNELS_API_KEY is configured or requested
  if (env && (env.MAILCHANNELS_API_KEY || env.MAIL_PROVIDER === 'mailchannels')) {
    try {
      const senderEmail = env.SENDER_EMAIL || 'auth@inid.me';
      const senderName = env.SENDER_NAME || 'inid.me Smart AR';

      const mcHeaders = {
        'content-type': 'application/json'
      };
      if (env.MAILCHANNELS_API_KEY) {
        mcHeaders['X-Api-Key'] = env.MAILCHANNELS_API_KEY;
      }

      const personalization = {
        to: [{ email: email, name: email.split('@')[0] }]
      };
      // Always specify DKIM for inid.me if not configured
      personalization.dkim_domain = env.MAILCHANNELS_DKIM_DOMAIN || 'inid.me';
      personalization.dkim_selector = env.MAILCHANNELS_DKIM_SELECTOR || 'mc';

      const mcPayload = {
        personalizations: [personalization],
        from: {
          email: senderEmail,
          name: senderName
        },
        subject: subject,
        content: [
          {
            type: 'text/html',
            value: html
          }
        ]
      };

      const mcRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: mcHeaders,
        body: JSON.stringify(mcPayload)
      });

      if (mcRes.ok || mcRes.status === 202) {
        const mcJson = await mcRes.json().catch(() => null);
        if (mcJson && Array.isArray(mcJson.results) && mcJson.results[0]?.status === 'failed') {
          console.warn('MailChannels rejected message:', mcJson.results[0]?.reason);
          return { success: false, error: mcJson.results[0]?.reason, debug: { mcJson, hasKey: Boolean(env.MAILCHANNELS_API_KEY) } };
        } else {
          return { success: true, provider: 'mailchannels' };
        }
      } else {
        const errText = await mcRes.text();
        console.warn('MailChannels API response not ok:', mcRes.status, errText);
        return { success: false, error: `MailChannels status ${mcRes.status}: ${errText}`, debug: { hasKey: Boolean(env.MAILCHANNELS_API_KEY) } };
      }
    } catch (err) {
      console.error('MailChannels exception:', err);
      return { success: false, error: `MailChannels exception: ${err.message}`, debug: { hasKey: Boolean(env.MAILCHANNELS_API_KEY) } };
    }
  }

  // 2. Try Brevo (Sendinblue) API if BREVO_API_KEY is configured (300 emails/day)
  if (env && env.BREVO_API_KEY) {
    try {
      const senderEmail = env.SENDER_EMAIL || 'auth@inid.me';
      const senderName = env.SENDER_NAME || 'inid.me Smart AR';

      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: email, name: email.split('@')[0] }],
          subject: subject,
          htmlContent: html
        })
      });

      if (brevoRes.ok) {
        return { success: true, provider: 'brevo' };
      }
      const errText = await brevoRes.text();
      console.warn('Brevo API response not ok:', brevoRes.status, errText);
    } catch (e) {
      console.error('Brevo API exception:', e);
    }
  }

  // 3. Try Resend API if RESEND_API_KEY is configured (100 emails/day)
  if (env && env.RESEND_API_KEY) {
    try {
      const senderFrom = env.SENDER_EMAIL ? `inid.me <${env.SENDER_EMAIL}>` : 'inid.me <onboarding@resend.dev>';
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: senderFrom,
          to: [email],
          subject: subject,
          html: html
        })
      });

      if (resendRes.ok) {
        return { success: true, provider: 'resend' };
      }
      const errText = await resendRes.text();
      console.warn('Resend API response not ok:', resendRes.status, errText);
    } catch (e) {
      console.error('Resend fallback exception:', e);
    }
  }

  // 4. If dev mode sandbox is explicitly allowed via DEV_SANDBOX_MAIL=true
  if (env && (env.DEV_SANDBOX_MAIL === 'true' || env.DEV_SANDBOX_MAIL === true)) {
    return { success: true, provider: 'kv-saved', note: 'Dev sandbox: OTP saved in KV only' };
  }

  // All providers failed or unconfigured in production
  return {
    success: false,
    error: 'Không thể gửi email OTP qua các nhà cung cấp dịch vụ (chưa cấu hình API key hoặc nhà cung cấp từ chối).'
  };
}
