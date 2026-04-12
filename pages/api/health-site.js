import BLOG from '@/blog.config'
import { getGlobalData } from '@/lib/db/getSiteData'

/**
 * 仅用于定位「全站占位 / 无商品」：需环境变量 SITE_DIAG_SECRET（建议 16+ 随机字符）。
 * 请求：GET /api/health-site
 * 鉴权：Authorization: Bearer <SITE_DIAG_SECRET> 或 ?secret=<SITE_DIAG_SECRET>
 * 不返回任何 Token 内容；勿对公网泄露 secret。
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }

  const expected = process.env.SITE_DIAG_SECRET
  if (
    !expected ||
    typeof expected !== 'string' ||
    String(expected).trim().length < 8
  ) {
    return res.status(404).end()
  }

  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '').trim()
  const q = req.query?.secret
  const token =
    bearer || (typeof q === 'string' ? q.trim() : '') || ''
  if (token !== String(expected).trim()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const data = await getGlobalData({ from: 'api-health-site' })
    const pages = Array.isArray(data?.allPages) ? data.allPages : []
    const first = pages[0]
    const isPlaceholder =
      first?.slug === 'oops' &&
      /无法获取Notion数据/.test(String(first?.title || ''))

    return res.status(200).json({
      at: new Date().toISOString(),
      notionPageIdConfigured: Boolean(BLOG.NOTION_PAGE_ID),
      notionTokenConfigured: Boolean(BLOG.NOTION_ACCESS_TOKEN),
      isPlaceholder,
      allPagesCount: pages.length,
      postCount: data?.postCount ?? null,
      firstSlug: first?.slug ?? null,
      /** 若为占位，说明 Notion 数据链未跑通；请同时在 Vercel 日志搜 [NOTION_SITE_DATA] */
      ok: Boolean(!isPlaceholder && pages.length > 0)
    })
  } catch (e) {
    return res.status(500).json({
      error: 'health_check_failed',
      message: String(e?.message || e).slice(0, 400)
    })
  }
}
