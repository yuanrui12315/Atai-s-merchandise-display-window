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
        {recommendPosts.map(post => {
          const headerImage = post?.pageCoverThumbnail
            ? post?.pageCoverThumbnail
            : siteInfo?.pageCover

          return (
            <SmartLink
              key={post?.id}
              title={post?.title}
              href={post?.href}
              passHref
              className='flex h-28 cursor-pointer overflow-hidden rounded-xl md:h-40 md:rounded-2xl'>
              <div className='relative h-full w-full group'>
                <div className='flex h-full w-full items-center justify-center duration-300'>
                  <div className='shadow-text z-10 line-clamp-3 px-2 text-center text-[11px] font-bold text-white select-none sm:text-xs md:line-clamp-none md:px-4 md:text-lg'>
                    {post.title}
                  </div>
                </div>
                <LazyImage
                  src={headerImage}
                  className='absolute top-0 h-full w-full transform object-cover object-center duration-200 group-hover:scale-110 group-hover:brightness-50'
                />
                {/* 卡片的阴影遮罩，为了凸显图片上的文字 */}
                <div className='h-3/4 w-full absolute left-0 bottom-0'>
                  <div className='h-full w-full absolute opacity-80 group-hover:opacity-100 transition-all duration-1000 bg-gradient-to-b from-transparent to-black'></div>
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}
