import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import PaginationNumber from './PaginationNumber'

/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListPage = ({
  page = 1,
  posts = [],
  postCount,
  siteInfo,
  listCoverMaxWidth
}) => {
  const { NOTION_CONFIG } = useGlobal()
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, NOTION_CONFIG)
  const totalPage = Math.ceil(postCount / POSTS_PER_PAGE)
  const showPagination = postCount >= POSTS_PER_PAGE
  const POST_COLS = siteConfig('HEO_HOME_POST_COLS', 5, CONFIG)
  const gridCols = POST_COLS === 5
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4'
    : siteConfig('HEO_HOME_POST_TWO_COLS', true, CONFIG)
      ? 'grid grid-cols-1 2xl:grid 2xl:grid-cols-2 gap-5'
      : 'grid grid-cols-1 gap-5'
  if (!posts || posts.length === 0 || page > totalPage) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div id='container' className='w-full'>
        {/* 文章列表 */}
        <div className={gridCols}>
          {posts?.map(post => (
            <BlogPostCard
              index={posts.indexOf(post)}
              key={post.id}
              post={post}
              siteInfo={siteInfo}
              listCoverMaxWidth={listCoverMaxWidth}
            />
          ))}
        </div>

        {showPagination && (
          <PaginationNumber
            page={page}
            totalPage={totalPage}
            postCount={postCount}
            currentPageCount={posts?.length ?? 0}
          />
        )}
      </div>
    )
  }
}

export default BlogPostListPage
