import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 关联推荐商品（按分类）
 * @param {prev,next} param0
 * @returns
 */
export default function PostRecommend({ recommendPosts, siteInfo }) {
  const { locale } = useGlobal()

  if (
    !siteConfig('HEO_ARTICLE_RECOMMEND', null, CONFIG) ||
    !recommendPosts ||
    recommendPosts.length === 0
  ) {
    return <></>
  }

  return (
    <div className='pt-6 md:pt-8'>
      {/* 推荐商品（手机与 PC 同一 recommendPosts；手机卡片略小） */}
      <div className='mb-2 flex flex-nowrap justify-between px-1'>
        <div className='text-base font-bold dark:text-gray-300 md:text-lg'>
          <i className='fas fa-thumbs-up mr-2' />
          {locale.COMMON.RELATE_POSTS}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4'>
        {recommendPosts.map((post, index) => {
          const headerImage = post?.pageCoverThumbnail
            ? post?.pageCoverThumbnail
            : siteInfo?.pageCover

          return (
            <SmartLink
              key={post?.id}
              title={post?.title}
              href={post?.href}
              passHref
              className='block h-28 cursor-pointer overflow-hidden rounded-xl md:h-40 md:rounded-2xl'>
              <div className='group relative h-full w-full overflow-hidden'>
                {/* 必须包一层 inset-0：LazyImage 观察的 div 要有宽高；img 勿再 absolute，否则外层塌成 0，IntersectionObserver 永远不触发，永远占位图 */}
                <div className='absolute inset-0 z-0'>
                  <LazyImage
                    priority={index < 3}
                    src={headerImage}
                    alt={post.title || ''}
                    className='h-full w-full object-cover object-center duration-200 group-hover:scale-110 group-hover:brightness-50'
                    compressMaxWidth={siteConfig(
                      'HOME_LIST_COVER_MAX_WIDTH',
                      480,
                      CONFIG
                    )}
                    compressMobileProxyQuality={Number(
                      siteConfig('HOME_LIST_MOBILE_PROXY_QUALITY', 0, CONFIG)
                    )}
                  />
                </div>
                <div className='pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-3/4'>
                  <div className='h-full w-full bg-gradient-to-b from-transparent to-black opacity-80 transition-all duration-1000 group-hover:opacity-100' />
                </div>
                <div className='relative z-[2] flex h-full items-center justify-center px-2 duration-300 md:px-4'>
                  <div className='shadow-text line-clamp-3 text-center text-[11px] font-bold text-white select-none sm:text-xs md:line-clamp-none md:text-lg'>
                    {post.title}
                  </div>
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}
