/**
 * 密码验证 API
 * 验证通过后设置 Cookie，改密码后旧 Cookie 自动失效
 */
import crypto from 'crypto'

function getAccessToken(password) {
  if (!password) return ''
  return crypto.createHash('sha256').update(password + 'site_access_salt').digest('hex')
}

// 去除首尾空格和不可见字符
function normalize(str) {
  return String(str || '').replace(/[\s\u200B-\u200D\uFEFF]/g, '').trim()
}

export const config = {
  api: { bodyParser: { sizeLimit: '1kb' } }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sitePassword = normalize(process.env.SITE_PASSWORD)
  if (!sitePassword) {
    return res.status(500).json({ error: '网站未配置密码，请联系管理员' })
  }

  let password = ''
  let from = ''
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    password = normalize(body.password ?? body['password'] ?? '')
    from = (body.from ?? body['from'] ?? '').trim()
  } catch (_) {
    password = ''
    from = ''
  }

  // 调试模式：添加 SITE_PASSWORD_DEBUG=1 可查看接收情况（排查完请删除此变量）
  if (process.env.SITE_PASSWORD_DEBUG === '1') {
    return res.status(200).json({
      debug: true,
      receivedLength: password.length,
      expectedLength: sitePassword.length,
      match: password === sitePassword
    })
  }

  const inputToken = getAccessToken(password)
  const correctToken = getAccessToken(sitePassword)

  if (inputToken && inputToken === correctToken) {
    // 验证通过，设置 Cookie（30 天有效）
    res.setHeader('Set-Cookie', [
      `site_access=${inputToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000; Secure`
    ])
    const redirectTo = (from && !from.includes('/password')) ? from : '/'
    return res.redirect(302, redirectTo)
  }

  // 验证失败，重定向回密码页并带错误参数
  const passwordUrl = from ? `/password?error=1&from=${encodeURIComponent(from)}` : '/password?error=1'
  return res.redirect(302, passwordUrl)
}
