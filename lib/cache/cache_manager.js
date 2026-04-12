import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'
import RedisCache from './redis_cache'

// 配置是否开启Vercel环境中的缓存，因为Vercel中现有两种缓存方式在无服务环境下基本都是无意义的，纯粹的浪费资源
const enableCacheInVercel =
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_lifecycle_event === 'export' ||
  !BLOG['isProd']

/** 站点数据缓存中「无法连接 Notion」占位（勿当有效数据长期命中 Redis） */
function isSiteDataNotionErrorPlaceholder(data) {
  if (!data || !Array.isArray(data.allPages) || data.allPages.length !== 1) {
    return false
  }
  const first = data.allPages[0]
  return (
    first?.slug === 'oops' &&
    /无法获取Notion数据/.test(String(first?.title || ''))
  )
}

/**
 * 尝试从缓存中获取数据，如果没有则尝试获取数据并写入缓存，最终返回所需数据
 * @param key
 * @param getDataFunction
 * @param getDataArgs
 * @returns {Promise<*|null>}
 */
export async function getOrSetDataWithCache(
  key,
  getDataFunction,
  ...getDataArgs
) {
  return getOrSetDataWithCustomCache(key, null, getDataFunction, ...getDataArgs)
}

/**
 * 尝试从缓存中获取数据，如果没有则尝试获取数据并自定义写入缓存，最终返回所需数据
 * @param key
 * @param customCacheTime
 * @param getDataFunction
 * @param getDataArgs
 * @returns {Promise<*|null>}
 */
export async function getOrSetDataWithCustomCache(
  key,
  customCacheTime,
  getDataFunction,
  ...getDataArgs
) {
  const rawCached = await getDataFromCache(key)
  // 构建期 ENABLE_CACHE 为 true 时会读 Redis；若曾写入占位 EmptyData，必须视为未命中并重新拉 Notion
  const dataFromCache =
    rawCached &&
    !(
      String(key).startsWith('site_data_') &&
      isSiteDataNotionErrorPlaceholder(rawCached)
    )
      ? rawCached
      : null
  if (dataFromCache) {
    // console.log('[缓存-->>API]:', key) // 避免过多的缓存日志输出
    return dataFromCache
  }
  const data = await getDataFunction(...getDataArgs)
  const shouldCache =
    data &&
    !(
      String(key).startsWith('site_data_') &&
      isSiteDataNotionErrorPlaceholder(data)
    )
  if (shouldCache) {
    // console.log('[API-->>缓存]:', key)
    await setDataToCache(key, data, customCacheTime)
  }
  return data || null
}

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key, force) {
  const wantCache = JSON.parse(BLOG.ENABLE_CACHE) || force
  if (!wantCache) {
    return null
  }
  // 与 setDataToCache 对齐：Vercel 生产运行时默认不写缓存，若仍读 Redis 会长期吃到构建期写入的旧数据且无法刷新
  if (!enableCacheInVercel && !force) {
    return null
  }
  const dataFromCache = await getApi().getCache(key)
  if (!dataFromCache || JSON.stringify(dataFromCache) === '[]') {
    return null
  }
  // console.trace('[API-->>缓存]:', key, dataFromCache)
  return dataFromCache
}

/**
 * 写入缓存
 * @param {*} key
 * @param {*} data
 * @param {*} customCacheTime
 * @returns
 */
export async function setDataToCache(key, data, customCacheTime) {
  if (!enableCacheInVercel || !data) {
    return
  }
  //   console.trace('[API-->>缓存写入]:', key)
  await getApi().setCache(key, data, customCacheTime)
}

export async function delCacheData(key) {
  if (!JSON.parse(BLOG.ENABLE_CACHE)) {
    return
  }
  await getApi().delCache(key)
}

/**
 * 缓存实现类
 * @returns
 */
export function getApi() {
  if (BLOG.REDIS_URL) {
    return RedisCache
  } else if (process.env.ENABLE_FILE_CACHE) {
    return FileCache
  } else {
    return MemoryCache
  }
}
