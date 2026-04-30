import { useGlobal } from '@/lib/global'

/**
 * 空白博客 列表
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListEmpty = ({ currentSearch }) => {
  const { locale } = useGlobal()
  const isSearch = Boolean(currentSearch && String(currentSearch).trim())
  const noResults =
    locale.COMMON.SEARCH_NO_RESULTS ?? locale.COMMON.NO_MORE
  const hint = locale.COMMON.SEARCH_NO_RESULTS_HINT
  return (
    <div className='flex w-full flex-col items-center justify-center min-h-screen mx-auto md:-mt-20 gap-2 px-4 text-center'>
      <div className='text-gray-500 dark:text-gray-300'>
        {isSearch ? noResults : locale.COMMON.NO_MORE}
      </div>
      {isSearch && hint && (
        <div className='text-sm text-gray-400 dark:text-gray-400'>{hint}</div>
      )}
      {isSearch && (
        <div className='text-sm text-gray-400 dark:text-gray-500'>
          「{String(currentSearch).trim()}」
        </div>
      )}
    </div>
  )
}
export default BlogPostListEmpty
