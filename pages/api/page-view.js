/**
 * 真实访问统计 API
 * 规则：同一访客 24 小时内对同一页面只计 1 次（通过 Cookie 实现）
 * 需要 Upstash Redis：在 Vercel 环境变量配置 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN
 */
const COOKIE_NAME = 'pv_visited'
const COOKIE_MAX_AGE = 86400 // 24 小时
const COOKIE_PATH = '/'

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  try {
    const { Redis } = require('@upstash/redis')
    return new Redis({ url, token })
  } catch {
    return null
  }
}

function getViewedPages(req) {
  const raw = req.headers.cookie || ''
  const prefix = COOKIE_NAME + '='
  const start = raw.indexOf(prefix)
  if (start < 0) return {}
  const val = raw.slice(start + prefix.length).split(';')[0].trim()
  try {
    const parsed = JSON.parse(decodeURIComponent(val))
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function shouldCount(viewedPages, pageId) {
  const ts = viewedPages[pageId]
  if (!ts) return true
  return Date.now() - ts > COOKIE_MAX_AGE * 1000
}

function buildCookie(viewedPages, pageId) {
  const next = { ...viewedPages, [pageId]: Date.now() }
  const val = encodeURIComponent(JSON.stringify(next))
  return `${COOKIE_NAME}=${val}; Path=${COOKIE_PATH}; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; HttpOnly`
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const pageId = req.query.pageId || req.query.id
  if (!pageId || typeof pageId !== 'string') {
    return res.status(400).json({ error: 'Missing pageId', count: 0 })
  }

  const redis = getRedis()
  if (!redis) {
    return res.status(200).json({ count: 0, ok: false, msg: 'Redis not configured' })
  }

  const key = `pv:${pageId}`

  if (req.method === 'GET') {
    try {
      const count = await redis.get(key)
      return res.status(200).json({ count: parseInt(count, 10) || 0, ok: true })
    } catch (e) {
      return res.status(200).json({ count: 0, ok: false })
    }
  }

  // POST: 尝试增加计数
  const viewed = getViewedPages(req)
  if (!shouldCount(viewed, pageId)) {
    try {
      const count = await redis.get(key)
      return res
        .status(200)
        .setHeader('Cache-Control', 'no-store')
        .json({ count: parseInt(count, 10) || 0, ok: true, incremented: false })
    } catch {
      return res.status(200).json({ count: 0, ok: false })
    }
  }

  try {
    const count = await redis.incr(key)
    res.setHeader('Set-Cookie', buildCookie(viewed, pageId))
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ count, ok: true, incremented: true })
  } catch (e) {
    return res.status(200).json({ count: 0, ok: false })
  }
}
