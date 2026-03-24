import { NotionAPI as NotionLibrary } from 'notion-client'
import BLOG from '@/blog.config'
import path from 'path'
import { RateLimiter } from './RateLimiter'

// NOTION_BUILD_THROTTLE：package.json build 显式设置，保证 Vercel/Next 子进程一定开启
const useRateLimiter = Boolean(
  process.env.NOTION_BUILD_THROTTLE ||
    process.env.BUILD_MODE ||
    process.env.EXPORT ||
    process.env.CI === '1' ||
    process.env.CI === 'true' ||
    process.env.npm_lifecycle_event === 'build'
)
const lockFilePath = path.resolve(process.cwd(), '.notion-api-lock')
const rateLimiter = new RateLimiter(200, lockFilePath)

const globalStore = { notion: null, inflight: new Map() }

async function rewriteSyncEndpoint(options) {
  const u = options?.url != null ? String(options.url) : ''
  if (
    u.includes('/api/v3/syncRecordValues') &&
    !u.includes('syncRecordValuesMain')
  ) {
    options.url = u.replace(
      '/api/v3/syncRecordValues',
      '/api/v3/syncRecordValuesMain'
    )
  }
}

function mergeGotRewriteOnly(userGot = {}) {
  const userHooks = userGot.hooks || {}
  return {
    ...userGot,
    hooks: {
      ...userHooks,
      beforeRequest: [
        rewriteSyncEndpoint,
        ...(userHooks.beforeRequest || [])
      ]
    }
  }
}

/**
 * notion-client@6.x 使用 got（不是 ky），需在 gotOptions.hooks 里限流。
 * 单次 getPage 内部会并发多个 POST，必须对每个 HTTP 做 FIFO + 间隔。
 */
function createGotThrottleMerge() {
  let tail = Promise.resolve()
  const pendingReleases = []
  const gapMs = Number(process.env.NOTION_HTTP_GAP_MS || 400)

  return function mergeGotThrottleOptions(userGot = {}) {
    const userHooks = userGot.hooks || {}

    const throttleBeforeRequest = async (options) => {
      await tail
      let resolveNext
      tail = new Promise((r) => {
        resolveNext = r
      })
      pendingReleases.push(resolveNext)
      if (gapMs > 0) {
        await new Promise((r) => setTimeout(r, gapMs))
      }
      await rewriteSyncEndpoint(options)
    }


    const throttleAfterResponse = async (response) => {
      const rel = pendingReleases.shift()
      rel?.()
      return response
    }

    const throttleBeforeError = (error) => {
      const rel = pendingReleases.shift()
      rel?.()
      throw error
    }

    return {
      ...userGot,
      hooks: {
        beforeRequest: [
          throttleBeforeRequest,
          ...(userHooks.beforeRequest || [])
        ],
        afterResponse: [
          ...(userHooks.afterResponse || []),
          throttleAfterResponse
        ],
        beforeError: [
          throttleBeforeError,
          ...(userHooks.beforeError || [])
        ]
      }
    }
  }
}

const mergeGotThrottleOptions = useRateLimiter
  ? createGotThrottleMerge()
  : (g) => g

function getRawNotion() {
  if (!globalStore.notion) {
    const notion = new NotionLibrary({
      apiBaseUrl: BLOG.API_BASE_URL || 'https://www.notion.so/api/v3',
      activeUser: BLOG.NOTION_ACTIVE_USER || null,
      authToken: BLOG.NOTION_TOKEN_V2 || null,
      userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
    const origFetch = notion.fetch.bind(notion)
    notion.fetch = async (params) =>
      origFetch({
        ...params,
        gotOptions: useRateLimiter
          ? mergeGotThrottleOptions(params.gotOptions)
          : mergeGotRewriteOnly(params.gotOptions)
      })
    globalStore.notion = notion
  }
  return globalStore.notion
}

async function callNotion(methodName, ...args) {
  const notion = getRawNotion()
  const original = notion[methodName]
  if (typeof original !== 'function') throw new Error(`${methodName} is not a function`)

  const key = `${methodName}-${JSON.stringify(args)}`

  if (globalStore.inflight.has(key)) return globalStore.inflight.get(key)

  const execute = async () => original.apply(notion, args)
  const promise = useRateLimiter
    ? rateLimiter.enqueue(key, execute)
    : execute()

  globalStore.inflight.set(key, promise)
  promise.finally(() => globalStore.inflight.delete(key))
  return promise
}

export const notionAPI = {
  getPage: (...args) => callNotion('getPage', ...args),
  getBlocks: (...args) => callNotion('getBlocks', ...args),
  getUsers: (...args) => callNotion('getUsers', ...args),
  getCollectionData: (...args) => callNotion('getCollectionData', ...args),
  __call: callNotion
}

export default notionAPI
