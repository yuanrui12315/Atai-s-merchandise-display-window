import LazyImage from '@/components/LazyImage'
import NotionIcon from './NotionIcon'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

const BlogPostCard = ({
  index,
  post,
  showSummary,
  siteInfo,
  /** 仅首页/主列表分页：缩小封面请求以加速；分类/标签/搜索不传 */
  listCoverMaxWidth
}) => {
  const showPreview =
    siteConfig('HEO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  if (
    post &&
    !post.pageCoverThumbnail &&
    siteConfig('HEO_POST_LIST_COVER_DEFAULT', null, CONFIG)
  ) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }
  const showPageCover =
    siteConfig('HEO_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail &&
    !showPreview

  const POST_COLS = siteConfig('HEO_HOME_POST_COLS', 5, CONFIG)
  const POST_TWO_COLS = siteConfig('HEO_HOME_POST_TWO_COLS', true, CONFIG)
  const isFiveCols = POST_COLS === 5
  const COVER_HOVER_ENLARGE = siteConfig(
    'HEO_POST_LIST_COVER_HOVER_ENLARGE',
    true,
    CONFIG
  )
  const listMobileProxyQ = siteConfig(
    'HOME_LIST_MOBILE_PROXY_QUALITY',
    0,
    CONFIG
  )

  return (
    <article
      className={` ${COVER_HOVER_ENLARGE} ? ' hover:transition-all duration-150' : ''}`}>
      <div
        data-wow-delay='.2s'
        className={
          (isFiveCols ? 'flex-col h-auto min-h-[16rem] md:flex-col md:h-auto' : POST_TWO_COLS ? '2xl:h-96 2xl:flex-col' : '') +
          ' wow fadeInUp border bg-white dark:bg-[#1e1e1e] flex mb-2 md:mb-4 flex-col h-[23rem] md:h-52 md:flex-row  group w-full dark:border-gray-600 hover:border-indigo-600  dark:hover:border-yellow-600 duration-300 transition-colors justify-between overflow-hidden rounded-xl'
        }>
        {/* 图片封面 */}
        {showPageCover && (
          <SmartLink href={post?.href} passHref legacyBehavior>
            <div
              className={
                (isFiveCols ? ' w-full aspect-[4/3] md:w-full' : POST_TWO_COLS ? ' 2xl:w-full' : '') +
                ' w-full md:w-5/12 overflow-hidden cursor-pointer select-none'
              }>
              <LazyImage
                priority={index === 0}
                src={post?.pageCoverThumbnail}
                alt={post?.title}
                compressMaxWidth={listCoverMaxWidth}
                compressMobileProxyQuality={
                  listCoverMaxWidth != null &&
                  listCoverMaxWidth > 0 &&
                  listMobileProxyQ > 0
                    ? listMobileProxyQ
                    : undefined
                }
                className='h-full w-full object-cover group-hover:scale-105 group-hover:brightness-75 transition-all duration-500 ease-in-out' //宽高都调整为自适应,保证封面居中
              />
            </div>
          </SmartLink>
        )}

        {/* 文字区块 */}
        <div
          className={
            (isFiveCols
              ? 'w-full flex-1 min-h-0 md:w-full md:h-auto p-2 md:p-3'
              : POST_TWO_COLS
                ? '2xl:p-4 2xl:h-48 2xl:w-full p-6'
                : 'p-6') +
            ' flex flex-col justify-between h-48 md:h-full w-full md:w-7/12'
          }>
          <header>
            {/* 分类 */}
            {post?.category && (
              <div
                className={`flex mb-1 items-center ${showPreview ? 'justify-center' : 'justify-start'} hidden md:block flex-wrap dark:text-gray-300 text-gray-600 hover:text-indigo-700 dark:hover:text-yellow-500`}>
                <SmartLink
                  passHref
                  href={`/category/${post.category}`}
                  className='cursor-pointer text-xs font-normal menu-link '>
                  {post.category}
                </SmartLink>
              </div>
            )}

            {/* 标题和图标 */}
            <SmartLink
              href={post?.href}
              passHref
              className={
                (isFiveCols ? ' text-base font-bold' : ' text-xl font-extrabold') +
                ' group-hover:text-indigo-700 dark:hover:text-yellow-700 dark:group-hover:text-yellow-600 text-black dark:text-gray-100  line-clamp-2 replace cursor-pointer leading-tight'
              }>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon
                icon={post.pageIcon}
                className="heo-icon w-6 h-6 mr-1 align-middle transform translate-y-[-8%]" // 专门为 Heo 主题的图标设置样式
              />
              )}
              <span className='menu-link '>{post.title}</span>
            </SmartLink>
          </header>

          {/* 商品描述：渐变字 + 轻光晕，与详情页同系配色 */}
          {(!showPreview || showSummary) && (
            <main className='line-clamp-2 replace bg-gradient-to-r from-amber-800 via-rose-700 to-violet-800 bg-clip-text text-sm font-semibold leading-snug text-transparent [filter:drop-shadow(0_1px_1px_rgba(255,255,255,0.35))] sm:text-[15px] dark:from-amber-200 dark:via-orange-200 dark:to-rose-200 dark:[filter:drop-shadow(0_0_8px_rgba(251,191,36,0.25))]'>
              {post.summary}
            </main>
          )}

          {/* 价格（商品卡片） */}
          {siteConfig('POST_CARD_PRICE', false) && (post?.price || post?.properties?.price) && (
            <div className={`text-red-600 dark:text-red-400 font-bold mt-1 ${isFiveCols ? 'text-base' : 'text-lg'}`}>
              ￥{post?.price ?? post?.properties?.price}
            </div>
          )}

          <div className='md:flex-nowrap flex-wrap md:justify-start inline-block'>
            <div>
              {' '}
              {post.tagItems?.map(tag => (
                <TagItemMini key={tag.name} tag={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogPostCard
