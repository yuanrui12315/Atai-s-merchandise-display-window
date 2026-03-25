/**
 * 首页列表 / Hero 缩略图：把图片 URL 里的 width 限制在 cap 以内（含 /api/proxy-image 内嵌的 Notion 地址）。
 * 商品详情页正文图勿用此函数，保持 mapImage 默认清晰度。
 */
export function applyWidthCapToImageSrc(src, cap) {
  if (!src || typeof src !== 'string') return src
  const capInt = Math.floor(Number(cap))
  if (!Number.isFinite(capInt) || capInt < 32) return src

  try {
    if (src.includes('/api/proxy-image')) {
      const base = 'https://placeholder.local'
      const parsed = new URL(src, base)
      const innerEncoded = parsed.searchParams.get('url')
      if (!innerEncoded) return src
      const inner = decodeURIComponent(innerEncoded)
      const innerNew = setWidthOnHttpUrl(inner, capInt)
      parsed.searchParams.set('url', encodeURIComponent(innerNew))
      const qs = parsed.searchParams.toString()
      const path = parsed.pathname
      return src.startsWith('http') ? `${parsed.origin}${path}?${qs}` : `${path}?${qs}`
    }
    if (src.startsWith('http') || src.startsWith('//')) {
      return setWidthOnHttpUrl(src.startsWith('//') ? `https:${src}` : src, capInt)
    }
  } catch {
    return src
  }
  return src
}

function setWidthOnHttpUrl(urlStr, capInt) {
  const u = new URL(urlStr)
  const notionish =
    u.hostname.includes('notion.so') ||
    u.hostname.includes('notion-static.com') ||
    u.hostname.includes('amazonaws.com')
  const current = u.searchParams.get('width') || u.searchParams.get('w')
  const parsedW = current ? parseInt(current, 10) : NaN
  const next =
    Number.isFinite(parsedW) && parsedW > 0
      ? Math.min(parsedW, capInt)
      : capInt
  u.searchParams.set('width', String(next))
  if (u.searchParams.has('w')) u.searchParams.set('w', String(next))
  if (notionish) u.searchParams.set('cache', 'v2')
  return u.toString()
}
