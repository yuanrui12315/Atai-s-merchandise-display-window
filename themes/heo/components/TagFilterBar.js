import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 主内容区标签筛选条 - 放在商品列表上方，让客户一眼看到
 * 标签也是分类的一种，与商品分类网格同等重要
 */
export default function TagFilterBar(props) {
  const { tagOptions } = props
  const router = useRouter()
  const { tag: currentTag } = router.query

  if (!tagOptions || tagOptions.length === 0) return null

  return (
    <div
      id='tag-filter-bar'
      className='wow fadeInUp mb-6 p-4 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-xl hover:border-indigo-600 dark:hover:border-yellow-600 transition-colors duration-200'>
      <div className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
        按标签筛选
      </div>
      <div className='flex flex-wrap gap-2'>
        <SmartLink
          href='/'
          passHref
          className='cursor-pointer inline-block'>
          <span
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              !currentTag
                ? 'bg-indigo-600 dark:bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 dark:hover:bg-yellow-600 hover:text-white'
            }`}>
            全部
          </span>
        </SmartLink>
        {tagOptions.map((tag, index) => {
          const selected = currentTag === tag.name
          return (
            <SmartLink
              key={index}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              passHref
              className='cursor-pointer inline-block'>
              <span
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  selected
                    ? 'bg-indigo-600 dark:bg-yellow-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 dark:hover:bg-yellow-600 hover:text-white'
                }`}>
                {tag.name}
                {tag.count != null && (
                  <sup className='ml-0.5 opacity-80'>{tag.count}</sup>
                )}
              </span>
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}
