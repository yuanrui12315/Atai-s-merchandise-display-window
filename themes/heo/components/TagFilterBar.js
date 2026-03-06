import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 根据标签名返回视觉风格类型
 */
function getTagStyle(tagName, index) {
  if (tagName.includes('必看')) {
    return 'highlight' // 必看类：琥珀橙
  }
  if (tagName.includes('焦油')) {
    // 焦油类：按数值区间用不同色系
    const match = tagName.match(/^([\d.]+)焦油/)
    const val = match ? parseFloat(match[1]) : 5
    if (val <= 1) return 'low'    // 低焦油：蓝
    if (val <= 6) return 'mid'    // 中焦油：绿
    if (val <= 10) return 'high'  // 高焦油：紫
    return 'extra'                // 超高：靛蓝
  }
  // 其他：按 index 循环
  const styles = ['low', 'mid', 'high', 'extra']
  return styles[index % 4]
}

/**
 * 标签的基础样式（未选中）
 */
const TAG_STYLES = {
  highlight: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700',
  low: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  mid: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  high: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700',
  extra: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700'
}

const TAG_HOVER = {
  highlight: 'hover:bg-amber-200 dark:hover:bg-amber-800/50 hover:border-amber-400 hover:shadow-md',
  low: 'hover:bg-blue-100 dark:hover:bg-blue-800/50 hover:border-blue-400 hover:shadow-md',
  mid: 'hover:bg-emerald-100 dark:hover:bg-emerald-800/50 hover:border-emerald-400 hover:shadow-md',
  high: 'hover:bg-violet-100 dark:hover:bg-violet-800/50 hover:border-violet-400 hover:shadow-md',
  extra: 'hover:bg-indigo-100 dark:hover:bg-indigo-800/50 hover:border-indigo-400 hover:shadow-md'
}

/**
 * 主内容区标签筛选条 - 与商品分类网格视觉统一，色彩分层更易辨识
 */
export default function TagFilterBar(props) {
  const { tagOptions } = props
  const router = useRouter()
  const { tag: currentTag } = router.query

  if (!tagOptions || tagOptions.length === 0) return null

  // 分组：必看优先，其余按原序
  const sortedTags = [...tagOptions].sort((a, b) => {
    const aHighlight = a.name.includes('必看') ? 1 : 0
    const bHighlight = b.name.includes('必看') ? 1 : 0
    if (aHighlight !== bHighlight) return bHighlight - aHighlight
    return 0
  })

  return (
    <div
      id='tag-filter-bar'
      className='wow fadeInUp mb-8'>
      <div className='text-2xl font-bold dark:text-gray-200 mb-4'>
        按标签筛选
      </div>
      <div className='p-5 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-xl hover:border-indigo-600 dark:hover:border-yellow-600 transition-colors duration-200 shadow-sm'>
        <div className='flex flex-wrap gap-3'>
          {/* 全部 */}
          <SmartLink href='/' passHref className='cursor-pointer inline-block'>
            <span
              className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 transform hover:scale-105 ${
                !currentTag
                  ? 'bg-indigo-600 dark:bg-yellow-600 text-white border-indigo-600 dark:border-yellow-600 shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-indigo-600 dark:hover:bg-yellow-600 hover:text-white hover:border-indigo-600 dark:hover:border-yellow-600'
              }`}>
              全部
            </span>
          </SmartLink>
          {sortedTags.map((tag, index) => {
            const selected = currentTag === tag.name
            const styleType = getTagStyle(tag.name, index)
            const baseStyle = TAG_STYLES[styleType]
            const hoverStyle = TAG_HOVER[styleType]
            return (
              <SmartLink
                key={index}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                passHref
                className='cursor-pointer inline-block'>
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 transform hover:scale-105 ${
                    selected
                      ? 'bg-indigo-600 dark:bg-yellow-600 text-white border-indigo-600 dark:border-yellow-600 shadow-md'
                      : `${baseStyle} border ${hoverStyle}`
                  }`}>
                  {tag.name}
                  {tag.count != null && (
                    <sup className='ml-1 text-xs opacity-90'>{tag.count}</sup>
                  )}
                </span>
              </SmartLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
