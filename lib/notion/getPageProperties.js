import BLOG from '@/blog.config'
import { getBlockTitle, getDateValue, getTextContent, getPageProperty } from 'notion-utils'
import formatDate from '../utils/formatDate'
// import { createHash } from 'crypto'
import md5 from 'js-md5'
import { siteConfig } from '../config'
import { convertUrlStartWithOneSlash, getLastSegmentFromUrl, isHttpLink, isMailOrTelLink } from '../utils'
import { extractLangPrefix } from '../utils/pageId'
import { mapImgUrl } from './mapImage'
import notionAPI from '@/lib/notion/getNotionAPI'

/**
 * 获取页面元素成员属性
 * @param {*} id
 * @param {*} value
 * @param {*} schema
 * @param {*} authToken
 * @param {*} tagOptions
 * @returns
 */
export default async function getPageProperties(
  id,
  value,
  schema,
  authToken,
  tagOptions,
  recordMap = null,
  blockObj = null
) {
  const rawProperties = Object.entries(value?.properties || [])
  const excludeProperties = ['date', 'select', 'multi_select', 'person']
  const properties = { id }

  // 若有 recordMap，优先用 notion-utils 的 getPageProperty 按属性名提取（支持 title/price/category/tags 等）
  if (recordMap && value) {
    const propNames = ['title', 'Name', 'Aa title', 'price', 'category', 'tags', 'summary', 'slug', 'type', 'status']
    for (const name of propNames) {
      try {
        const val = getPageProperty(name, value, recordMap)
        if (val !== null && val !== undefined && val !== '') {
          if (name === 'title' || name === 'Name' || name === 'Aa title') {
            if (!properties.title && String(val).trim()) properties.title = val
          } else if (name === 'price') {
            properties.price = typeof val === 'number' ? val : (parseFloat(val) || val)
          } else if (name === 'category') {
            properties.category = Array.isArray(val) ? val[0] : val
            properties.allCategories = Array.isArray(val) ? val.join(',') : val
          } else if (name === 'tags') {
            properties.tags = Array.isArray(val) ? val : (typeof val === 'string' ? val.split(',') : [val])
          } else if (name === 'summary') {
            properties.summary = val
          } else if (name === 'slug') {
            properties.slug = val
          } else if (name === 'type') {
            properties.type = Array.isArray(val) ? val[0] : val
          } else if (name === 'status') {
            properties.status = Array.isArray(val) ? val[0] : val
          }
        }
      } catch (_) {}
    }
  }

  // 标题兜底：getBlockTitle、value.properties.title、schema type title
  if (!properties.title || !String(properties.title).trim()) {
    const blockTitle = getBlockTitle(value, recordMap)
    if (blockTitle && String(blockTitle).trim()) properties.title = blockTitle
  }
  if ((!properties.title || !properties.title.trim()) && value?.properties?.title) {
    const t = getTextContent(value.properties.title)
    if (t && String(t).trim()) properties.title = t
  }
  // 从 schema 按 type=title 找标题列，兼容 propId 带/不带横线
  if ((!properties.title || !String(properties.title).trim()) && schema && typeof schema === 'object') {
    const normId = (s) => (s || '').replace(/-/g, '')
    const props = value?.properties || {}
    const tryGetTitle = (pid) => {
      const rawVal = props[pid] ?? props[normId(pid)]
      if (rawVal) {
        const t = getTextContent(rawVal)
        return (t && String(t).trim()) ? t : null
      }
      return null
    }
    for (const [propId, propSchema] of Object.entries(schema)) {
      if (propSchema?.type === 'title') {
        const t = tryGetTitle(propId)
        if (t) { properties.title = t; break }
      }
    }
    if (!properties.title && Object.keys(props).length > 0) {
      for (const [propId, rawVal] of Object.entries(props)) {
        const sc = schema[propId] || schema[normId(propId)] || Object.entries(schema || {}).find(([k]) => normId(k) === normId(propId))?.[1]
        if (sc?.type === 'title') {
          const t = getTextContent(rawVal)
          if (t && String(t).trim()) { properties.title = t; break }
        }
      }
    }
  }

  // 辅助：用 propId 或规范化 id 查找 schema（Notion 有时用带/不带横线的 id）
  const normId = (s) => (s || '').replace(/-/g, '')
  const getSchema = (propId) => {
    if (!schema || !propId) return null
    return schema[propId] || schema[normId(propId)] || (() => {
      const pid = normId(propId)
      const found = Object.entries(schema || {}).find(([k]) => normId(k) === pid)
      return found ? found[1] : null
    })()
  }

  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i]
    const propSchema = getSchema(key)
    properties.id = id
    if (propSchema?.type && !excludeProperties.includes(propSchema.type)) {
      // number 类型：Notion 格式可能是 [[190]] 或 [["190"]] 等
      if (propSchema.type === 'number') {
        let numVal = val?.[0]?.[1] ?? val?.[0]?.[0]
        if (numVal === undefined && Array.isArray(val?.[0])) numVal = val[0][val[0].length - 1]
        const parsed = typeof numVal === 'number' ? numVal : parseFloat(String(numVal || getTextContent(val) || ''))
        properties[propSchema.name] = (Number.isFinite(parsed) ? parsed : '')
      } else {
        properties[propSchema.name] = getTextContent(val)
      }
    } else {
      switch (propSchema?.type) {
        case 'date': {
          const dateProperty = getDateValue(val)
          delete dateProperty?.type
          properties[propSchema.name] = dateProperty
          break
        }
        case 'select':
        case 'multi_select': {
          const selects = getTextContent(val)
          if (selects && String(selects).trim()) {
            properties[propSchema.name] = selects.split(',').map(s => s?.trim()).filter(Boolean)
          }
          break
        }
        case 'person': {
          const rawUsers = val.flat()
          const users = []

          for (let i = 0; i < rawUsers.length; i++) {
            if (rawUsers[i][0][1]) {
              const userId = rawUsers[i][0]
              const res = await notionAPI.getUsers(userId)
              const resValue =
                res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value
              const user = {
                id: resValue?.id,
                first_name: resValue?.given_name,
                last_name: resValue?.family_name,
                profile_photo: resValue?.profile_photo
              }
              users.push(user)
            }
          }
          if (propSchema?.name) properties[propSchema.name] = users
          break
        }
        default:
          break
      }
    }
  }

  // 映射键：用户自定义表头名 + 常见中英文列名兜底（支持 Notion 用中文列名如 商品名称/价格/分类）
  const fieldNames = BLOG.NOTION_PROPERTY_NAME || {}
  const SCHEMA_NAME_ALTERNATIVES = {
    title: ['title', 'Name', 'Aa title', '商品名称', '名称', '标题', fieldNames.title].filter(Boolean),
    price: ['price', '价格', fieldNames.price].filter(Boolean),
    category: ['category', '分类', fieldNames.category].filter(Boolean),
    tags: ['tags', '标签', fieldNames.tags].filter(Boolean),
    summary: ['summary', '摘要', '描述', fieldNames.summary].filter(Boolean),
    slug: ['slug', 'slug', fieldNames.slug].filter(Boolean),
    type: ['type', '类型', fieldNames.type].filter(Boolean),
    status: ['status', '状态', fieldNames.status].filter(Boolean)
  }
  for (const [internalKey, possibleNames] of Object.entries(SCHEMA_NAME_ALTERNATIVES)) {
    const uniqueNames = [...new Set(possibleNames)]
    for (const schemaName of uniqueNames) {
      const v = properties[schemaName]
      if (v !== undefined && v !== null && v !== '' && String(v).trim() !== '') {
        if (internalKey === 'category' || internalKey === 'tags') {
          properties[internalKey] = Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : v)
          if (internalKey === 'category') properties.allCategories = Array.isArray(properties.category) ? properties.category.join(',') : properties.category
        } else {
          properties[internalKey] = v
        }
        break
      }
    }
  }
  // Notion 默认数据库标题列名为 Name，若 title 为空则尝试
  if (!properties.title && properties.Name) {
    properties.title = properties.Name
  }

  // type\status\category 是单选下拉框，可能是数组或字符串
  properties.type = Array.isArray(properties.type) ? properties.type[0] : (properties.type || '')
  properties.status = Array.isArray(properties.status) ? properties.status[0] : (properties.status || '')
// 1. 获取原始分类数据（可能是数组，也可能是带逗号的字符串）
let rawCate = properties.category
if (Array.isArray(rawCate)) {
    rawCate = rawCate.join(',')
} else if (typeof rawCate === 'object') {
    rawCate = rawCate?.select?.name || ''
}

// 2. 核心逻辑：给首页一个干净的“单分类”，给详情页一个完整的“多分类”
// 用于生成链接和首页脚本，只取第一个，绝对避免逗号导致崩掉
properties.category = (rawCate || '').split(',')[0] 
// 专门存一份完整的，给详情页显示用
properties.allCategories = rawCate || ''
  
  properties.comment = properties.comment?.[0] || ''

  // 映射值：用户个性化type和status字段的下拉框选项，在此映射回代码的英文标识
  mapProperties(properties)

  // 标题兜底：Notion 常见列名 title/Name/Aa title/标题/商品名称
  if (!properties.title || String(properties.title).trim() === '') {
    const titlePropName = BLOG.NOTION_PROPERTY_NAME?.title || 'title'
    properties.title =
      properties.Name ||
      properties['title'] ||
      properties['Aa title'] ||
      properties['标题'] ||
      properties['商品名称'] ||
      properties.name ||
      (titlePropName && properties[titlePropName]) ||
      `商品-${(properties.id || '').slice(-8)}` ||
      'Untitled'
  }

  const publishTime = new Date(
    properties?.date?.start_date || value.created_time
  ).getTime()
  properties.publishDate = Number.isFinite(publishTime) ? publishTime : Date.now()
  properties.publishDay = formatDate(properties.publishDate, BLOG.LANG)
  const lastEditedTime = new Date(value?.last_edited_time).getTime()
  properties.lastEditedDate = Number.isFinite(lastEditedTime) ? lastEditedTime : properties.publishDate
  properties.lastEditedDay = formatDate(
    Number.isFinite(lastEditedTime) ? lastEditedTime : properties.publishDate,
    BLOG.LANG
  )
  properties.fullWidth = value?.format?.page_full_width ?? false
  const blockForImg = blockObj?.value ? blockObj : { ...value, id: value?.id || id }
  properties.pageIcon = mapImgUrl(value?.format?.page_icon, blockForImg) ?? ''
  properties.pageCover = mapImgUrl(value?.format?.page_cover, blockForImg) ?? ''
  properties.pageCoverThumbnail =
    mapImgUrl(value?.format?.page_cover, blockForImg, 'block') ?? ''
  properties.ext = convertToJSON(properties?.ext)
  properties.content = value.content ?? []
  properties.tagItems =
    properties?.tags?.map(tag => {
      return {
        name: tag,
        color: tagOptions?.find(t => t.value === tag)?.color || 'gray'
      }
    }) || []
  delete properties.content
  return properties
}

/**
 * 字符串转json
 * @param {*} str
 * @returns
 */
function convertToJSON(str) {
  if (!str) {
    return {}
  }
  // 使用正则表达式去除空格和换行符
  try {
    return JSON.parse(str.replace(/\s/g, ''))
  } catch (error) {
    console.warn('无效JSON', str)
    return {}
  }
}

/**
 * 映射用户自定义表头
 */
function mapProperties(properties) {
  const typeMap = {
    [BLOG.NOTION_PROPERTY_NAME.type_post]: 'Post',
    [BLOG.NOTION_PROPERTY_NAME.type_page]: 'Page',
    [BLOG.NOTION_PROPERTY_NAME.type_notice]: 'Notice',
    [BLOG.NOTION_PROPERTY_NAME.type_menu]: 'Menu',
    [BLOG.NOTION_PROPERTY_NAME.type_sub_menu]: 'SubMenu'
  }

  const statusMap = {
    [BLOG.NOTION_PROPERTY_NAME.status_publish]: 'Published',
    [BLOG.NOTION_PROPERTY_NAME.status_invisible]: 'Invisible'
  }

  // 商品目录等场景可能未设置 type/status，空值时默认按文章展示
  if (!properties.type || properties.type === '') {
    properties.type = 'Post'
  } else if (typeMap[properties.type]) {
    properties.type = typeMap[properties.type]
  }

  if (!properties.status || properties.status === '') {
    properties.status = 'Published'
  } else if (statusMap[properties.status]) {
    properties.status = statusMap[properties.status]
  }
}

/**
 * 过滤处理页面数据
 * 过滤处理过程会用到NOTION_CONFIG中的配置
 */
export function adjustPageProperties(properties, NOTION_CONFIG) {
  // 处理URL
  // 1.按照用户配置的URL_PREFIX 转换一下slug
  // 2.为文章添加一个href字段，存储最终调整的路径
  if (properties.type === 'Post') {
    properties.slug = generateCustomizeSlug(properties, NOTION_CONFIG)
    properties.href = (properties.slug || properties.id || '').toString()
  } else if (properties.type === 'Page') {
    properties.href = properties.slug ?? properties.id
  } else if (properties.type === 'Menu' || properties.type === 'SubMenu') {
    // 菜单路径为空、作为可展开菜单使用
    properties.href = properties.slug ?? '#'
    properties.name = properties.title ?? ''
  }

  // http or https 开头的视为外链
  if (isHttpLink(properties?.href)) {
    properties.href = properties?.slug
    properties.target = '_blank'
  } else if (isMailOrTelLink(properties?.href)) {
    properties.href = properties?.slug
    properties.target = '_self'
  } else {
    properties.target = '_self'
    // 伪静态路径右侧拼接.html
    if (siteConfig('PSEUDO_STATIC', false, NOTION_CONFIG)) {
      if (
        !properties?.href?.endsWith('.html') &&
        properties?.href !== '' &&
        properties?.href !== '#' &&
        properties?.href !== '/'
      ) {
        properties.href += '.html'
      }
    }

    // 相对路径转绝对路径：url左侧拼接 /
    properties.href = convertUrlStartWithOneSlash(properties?.href)
  }

  // 如果跳转链接是多语言，则在新窗口打开
  if (BLOG.NOTION_PAGE_ID.indexOf(',') > 0) {
    const siteIds = BLOG.NOTION_PAGE_ID.split(',')
    for (let index = 0; index < siteIds.length; index++) {
      const siteId = siteIds[index]
      const prefix = extractLangPrefix(siteId)
      if (getLastSegmentFromUrl(properties.href) === prefix) {
        properties.target = '_blank'
      }
    }
  }

  // 密码字段md5
  properties.password = properties.password
    ? md5(properties.slug + properties.password)
    : ''
}

/**
 * 获取自定义URL
 * 可以根据变量生成URL
 * 支持：%category%/%year%/%month%/%day%/%slug%
 * @param {*} postProperties
 * @returns
 */
function generateCustomizeSlug(postProperties, NOTION_CONFIG) {
  // 外链不处理
  if (isHttpLink(postProperties.slug)) {
    return postProperties.slug
  }
  let fullPrefix = ''
  let allSlugPatterns = NOTION_CONFIG?.POST_URL_PREFIX
  if (allSlugPatterns === undefined || allSlugPatterns === null) {
    allSlugPatterns = siteConfig(
      'POST_URL_PREFIX',
      BLOG.POST_URL_PREFIX,
      NOTION_CONFIG
    ).split('/')
  } else {
    allSlugPatterns = allSlugPatterns.split('/')
  }

  const POST_URL_PREFIX_MAPPING_CATEGORY = siteConfig(
    'POST_URL_PREFIX_MAPPING_CATEGORY',
    {},
    NOTION_CONFIG
  )

  allSlugPatterns.forEach((pattern, idx) => {
    if (pattern === '%year%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay)
      fullPrefix += formatPostCreatedDate.getUTCFullYear()
    } else if (pattern === '%month%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay)
      fullPrefix += String(formatPostCreatedDate.getUTCMonth() + 1).padStart(
        2,
        0
      )
    } else if (pattern === '%day%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay)
      fullPrefix += String(formatPostCreatedDate.getUTCDate()).padStart(2, 0)
    } else if (pattern === '%slug%') {
      fullPrefix += (postProperties.slug || postProperties.id || '').toString()
    } else if (pattern === '%category%' && postProperties?.category) {
      let categoryPrefix = postProperties.category
      // 允许映射分类名，通常用来将中文分类映射成英文，美化url.
      if (POST_URL_PREFIX_MAPPING_CATEGORY[postProperties?.category]) {
        categoryPrefix =
          POST_URL_PREFIX_MAPPING_CATEGORY[postProperties?.category]
      }
      fullPrefix += categoryPrefix
    } else if (!pattern.includes('%')) {
      fullPrefix += pattern
    } else {
      return
    }
    if (idx !== allSlugPatterns.length - 1) {
      fullPrefix += '/'
    }
  })
  if (fullPrefix.startsWith('/')) {
    fullPrefix = fullPrefix.substring(1) // 去掉头部的"/"
  }
  if (fullPrefix.endsWith('/')) {
    fullPrefix = fullPrefix.substring(0, fullPrefix.length - 1) // 去掉尾部部的"/"
  }

  const slugPart = (postProperties.slug || postProperties.id || '').toString()
  if (!slugPart) return 'untitled'
  if (fullPrefix) {
    return `${fullPrefix}/${slugPart}`
  }
  return slugPart
}
