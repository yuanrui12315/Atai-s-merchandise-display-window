/**
 * 图片代理 API - 解决 Notion 图片在国内加载慢的问题
 * 通过 Vercel 服务器中转，利用 Cloudflare CDN 加速
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

  try {
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NotionNext-Image-Proxy/1.0)',
        'Accept': 'image/*,*/*'
      },
      signal: AbortSignal.timeout(15000)
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const cacheControl = 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=2592000'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', cacheControl)
    res.setHeader('Access-Control-Allow-Origin', '*')

    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (error) {
    console.error('[proxy-image]', error.message)
    res.status(500).json({ error: 'Image proxy failed' })
  }
}
