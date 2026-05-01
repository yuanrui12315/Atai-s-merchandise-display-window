/**
 * 图片代理 API - 解决 Notion 图片在国内加载慢的问题
 * 通过 Vercel 服务器中转，利用 Cloudflare CDN 加速
 * 可选 q=1–100：列表等场景用 sharp 转 WebP 降体积（手机列表 URL 带 q）
 */
const ALLOWED_HOSTS = [
  'www.notion.so',
  'notion.so',
  'notion.site',
  'secure.notion-static.com',
  'prod-files-secure.s3.us-west-2.amazonaws.com',
  's3.us-west-2.amazonaws.com'
]

function isAllowedUrl(url) {
  try {
    const parsed = new URL(url)
    return ALLOWED_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h))
  } catch {
    return false
  }
}

function loadSharp() {
  try {
    return require('sharp')
  } catch (e) {
    console.error('[proxy-image] sharp require failed:', e?.message || e)
    return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = req.query.url
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' })
  }

  let decodedUrl
  try {
    decodedUrl = decodeURIComponent(url)
  } catch {
    return res.status(400).json({ error: 'Invalid url encoding' })
  }

  if (!isAllowedUrl(decodedUrl)) {
    return res.status(403).json({ error: 'URL not allowed' })
  }

  const qRaw = req.query.q
  let targetQuality = null
  if (qRaw != null && qRaw !== '') {
    const n = parseInt(Array.isArray(qRaw) ? qRaw[0] : qRaw, 10)
    if (Number.isFinite(n)) {
      targetQuality = Math.min(100, Math.max(1, n))
    }
  }

  try {
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NotionNext-Image-Proxy/1.0)',
        Accept: 'image/*,*/*'
      },
      signal: AbortSignal.timeout(15000)
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const cacheControl =
      'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=2592000' // 30天

    const origBuffer = Buffer.from(await response.arrayBuffer())
    let buffer = origBuffer
    let outType = contentType

    if (
      targetQuality != null &&
      !contentType.includes('svg') &&
      !contentType.includes('gif')
    ) {
      const sharp = loadSharp()
      if (!sharp) {
        console.error(
          '[proxy-image] skip WebP: sharp unavailable (check standalone trace / Vercel logs)'
        )
      } else {
        try {
          buffer = await sharp(origBuffer, { failOn: 'none' })
            .webp({ quality: targetQuality, effort: 4 })
            .toBuffer()
          outType = 'image/webp'
        } catch (e) {
          console.error(
            '[proxy-image] sharp WebP failed, passthrough:',
            e?.message || e
          )
          buffer = origBuffer
          outType = contentType
        }
      }
    }

    res.setHeader('Content-Type', outType)
    res.setHeader('Cache-Control', cacheControl)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(buffer)
  } catch (error) {
    console.error('[proxy-image]', error.message)
    res.status(500).json({ error: 'Image proxy failed' })
  }
}
