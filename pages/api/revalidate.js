/**
 * 按需刷新某条路径的 ISR（不必整站 Redeploy）。
 * Vercel 环境变量：REVALIDATE_SECRET=随机长字符串
 *
 * 用法（浏览器或 curl，GET）：
 *   /api/revalidate?secret=你的密钥&path=/article/商品slug
 * 多条路径用英文逗号：
 *   &path=/,/article/foo,/search
 */
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ ok: false, message: '仅支持 GET 或 POST' })
  }

  const secret =
    req.query.secret ||
    (typeof req.body === 'object' && req.body && req.body.secret)
  const expected = process.env.REVALIDATE_SECRET
  if (!expected || secret !== expected) {
    return res.status(401).json({ ok: false, message: 'secret 无效或未配置 REVALIDATE_SECRET' })
  }

  const rawPath =
    req.query.path ||
    (typeof req.body === 'object' && req.body && req.body.path)
  if (!rawPath || typeof rawPath !== 'string') {
    return res.status(400).json({
      ok: false,
      message: '缺少 path，例如 ?path=/ 或 ?path=/article/xxx'
    })
  }

  const paths = rawPath
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)

  const results = []
  try {
    for (const p of paths) {
      await res.revalidate(p)
      results.push({ path: p, ok: true })
    }
    return res.status(200).json({ ok: true, revalidated: results })
  } catch (e) {
    console.error('[revalidate]', e)
    return res.status(500).json({
      ok: false,
      message: e?.message || String(e),
      partial: results
    })
  }
}
