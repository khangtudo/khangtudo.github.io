import assert from 'node:assert';

console.log('=== HARDENING TEST: REGEX URL & XSS SANITIZATION ===');

// Social Presets Registry
const SOCIAL_PRESETS = [
  { id: 'fb', name: 'Facebook', prefix: 'https://facebook.com/', allowedHosts: ['facebook.com', 'fb.com', 'fb.me'] },
  { id: 'insta', name: 'Instagram', prefix: 'https://instagram.com/', allowedHosts: ['instagram.com'] },
  { id: 'threads', name: 'Threads', prefix: 'https://threads.net/@', allowedHosts: ['threads.net'] },
  { id: 'tiktok', name: 'TikTok', prefix: 'https://tiktok.com/@', allowedHosts: ['tiktok.com'] },
  { id: 'li', name: 'LinkedIn', prefix: 'https://linkedin.com/in/', allowedHosts: ['linkedin.com'] },
  { id: 'x', name: 'X / Twitter', prefix: 'https://x.com/', allowedHosts: ['x.com', 'twitter.com'] },
  { id: 'gh', name: 'GitHub', prefix: 'https://github.com/', allowedHosts: ['github.com'] },
  { id: 'yt', name: 'YouTube', prefix: 'https://youtube.com/@', allowedHosts: ['youtube.com', 'youtu.be'] },
  { id: 'zalo', name: 'Zalo', prefix: 'https://zalo.me/', allowedHosts: ['zalo.me'] },
  { id: 'web', name: 'Link Khác', prefix: 'https://', allowedHosts: [] }
];

export function sanitizeSocialUrl(platformId, rawInput) {
  let val = String(rawInput || '').trim();
  // Anti-XSS guard: reject javascript: data: vbscript:
  if (/^(javascript|data|vbscript):/i.test(val)) {
    return { handle: '', url: '' };
  }
  
  const preset = SOCIAL_PRESETS.find(p => p.id === platformId) || SOCIAL_PRESETS[0];

  // Case 1: Generic Website
  if (preset.id === 'web') {
    const clean = val.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
    return { handle: clean, url: clean ? `https://${clean}` : '' };
  }

  // Case 2: Full URL pasted -> check allowed host
  if (/^https?:\/\//i.test(val)) {
    try {
      const parsed = new URL(val);
      const isAllowed = preset.allowedHosts.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h));
      if (!isAllowed) {
        // Cross-domain mismatch: treat as generic web or reject
        return { handle: '', url: '' };
      }
      // Extract clean handle from pathname
      let handle = parsed.pathname.replace(/^\/+|\/+$/g, '').replace(/^@/, '');
      if (preset.id === 'li') handle = handle.replace(/^in\//, '');
      return { handle: handle, url: `${preset.prefix}${handle}` };
    } catch(e) {
      return { handle: '', url: '' };
    }
  }

  // Case 3: Bare username or @handle
  const cleanHandle = val.replace(/^@+/, '').replace(/^\/+|\/+$/g, '');
  return { handle: cleanHandle, url: cleanHandle ? `${preset.prefix}${cleanHandle}` : '' };
}

// Unit Tests
assert.strictEqual(sanitizeSocialUrl('fb', 'https://facebook.com/phanmanhkhang').handle, 'phanmanhkhang');
assert.strictEqual(sanitizeSocialUrl('fb', '@phanmanhkhang').handle, 'phanmanhkhang');
assert.strictEqual(sanitizeSocialUrl('fb', 'phanmanhkhang').handle, 'phanmanhkhang');
assert.strictEqual(sanitizeSocialUrl('fb', 'https://x.com/wrongsite').handle, '', 'Cross-domain must be rejected');
assert.strictEqual(sanitizeSocialUrl('fb', 'javascript:alert(1)').handle, '', 'XSS payload must be rejected');

assert.strictEqual(sanitizeSocialUrl('threads', 'https://threads.net/@minhtam').handle, 'minhtam');
assert.strictEqual(sanitizeSocialUrl('threads', '@minhtam').handle, 'minhtam');
assert.strictEqual(sanitizeSocialUrl('threads', 'minhtam').url, 'https://threads.net/@minhtam');

assert.strictEqual(sanitizeSocialUrl('li', 'https://www.linkedin.com/in/john-doe').handle, 'john-doe');
assert.strictEqual(sanitizeSocialUrl('li', 'john-doe').url, 'https://linkedin.com/in/john-doe');

console.log('✅ ALL SANITIZATION & URL PARSER TESTS PASSED 100%!');
