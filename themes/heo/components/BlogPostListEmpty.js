import { useGlobal } from '@/lib/global'

/**
 * 空白博客 列表
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListEmpty = ({ currentSearch }) => {
  const { locale } = useGlobal()
  const main =
    currentSearch != null && currentSearch !== ''
      ? locale.COMMON.SEARCH_LIST_EMPTY ?? locale.COMMON.SEARCH_NO_RESULTS
      : locale.COMMON.NO_MORE
  return (
    <div className='flex min-h-screen w-full items-center justify-center mx-auto md:-mt-20'>
      <div className='max-w-md px-4 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-300'>
        {main}
        {currentSearch ? (
          <div className='mt-2 text-xs opacity-90'>{currentSearch}</div>
        ) : null}
      </div>
    </div>
  )
}
export default BlogPostListEmpty
