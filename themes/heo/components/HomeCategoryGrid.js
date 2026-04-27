import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

const heroThumbCap = () =>
  siteConfig('HOME_HERO_THUMB_MAX_WIDTH', 560, CONFIG)

const deskCategoryCoverCap = 560

/**
 * 首页全部分类 - 与 Hero「热销款」TopGroup 同款：
 * 手机两列一屏、小卡、横滑 + 顶栏「左右滑动查看更多」；桌面大卡片多列网格。
 */
export default function HomeCategoryGrid(props) {
  const { categoryOptions } = props
  const categoryImages = siteConfig('HEO_CATEGORY_IMAGES', {}, CONFIG) || {}

  if (!categoryOptions || categoryOptions.length === 0) {
    return null
  }

  const pairColumns = []
  for (let i = 0; i < categoryOptions.length; i += 2) {
    pairColumns.push(categoryOptions.slice(i, i + 2))
  }

  return (
    <div id='category-grid' className='wow fadeInUp mb-8'>
      {/* 与 Hero 热销款：仅手机显示标题+提示（xl 与 Hero 断点一致） */}
      <div className='mb-2 flex items-baseline justify-between gap-2 xl:hidden'>
        <div className='text-lg font-bold dark:text-gray-200'>商品分类</div>
        <span className='max-w-[9rem] shrink-0 text-right text-[10px] leading-tight text-gray-500 dark:text-gray-400'>
          左右滑动查看更多
        </span>
      </div>
      <div className='mb-3 hidden text-2xl font-bold text-gray-900 dark:text-gray-200 xl:block'>
        商品分类
      </div>

      {/* 手机：同 TopGroup #top-group */}
      <div
        className='flex w-full min-w-0 flex-nowrap gap-2 overflow-x-auto overflow-y-hidden scroll-smooth pb-1 [-webkit-overflow-scrolling:touch] snap-x snap-mandatory xl:hidden'>
        {pairColumns.map((pair, colIdx) => (
          <div
            key={pair[0]?.name || `cc-${colIdx}`}
            className='flex w-[5.75rem] shrink-0 flex-col gap-1.5 snap-start sm:w-24'
          >
            {pair.map((category, rowIdx) => {
              if (!category) {
                return null
              }
              const imgSrc = categoryImages[category.name]
              return (
                <SmartLink
                  key={category.name}
                  href={`/category/${category.name}`}
                >
                  <div className='group relative flex h-[6.4rem] w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-100/90 bg-white shadow-sm dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-white'>
                    {imgSrc ? (
                      <LazyImage
                        priority={colIdx === 0 && rowIdx === 0}
                        compressMaxWidth={heroThumbCap()}
                        className='h-12 w-full shrink-0 object-cover'
                        alt={category.name}
                        src={imgSrc}
                      />
                    ) : (
                      <div className='flex h-12 w-full shrink-0 items-center justify-center bg-gray-100 dark:bg-gray-800'>
                        <i className='fas fa-folder text-2xl text-gray-400 dark:text-gray-500' />
                      </div>
                    )}
                    <div className='line-clamp-2 min-h-0 flex-1 overflow-hidden px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-gray-800 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-yellow-500'>
                      {category.name}
                    </div>
                  </div>
                </SmartLink>
              )
            })}
          </div>
        ))}
      </div>

      {/* 桌面：同 TopGroup 三列大卡片，分类较多时多行 */}
      <div className='hidden w-full space-x-0 xl:grid xl:grid-cols-3 xl:gap-3 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6'>
        {categoryOptions.map((category, index) => {
          const imgSrc = categoryImages[category.name]
          return (
            <SmartLink key={category.name} href={`/category/${category.name}`}>
              <div className='group relative flex min-h-[164px] w-52 max-w-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow dark:bg-black dark:text-white xl:w-full'>
                {imgSrc ? (
                  <LazyImage
                    priority={index < 3}
                    compressMaxWidth={deskCategoryCoverCap}
                    className='h-24 w-full object-cover'
                    alt={category.name}
                    src={imgSrc}
                  />
                ) : (
                  <div className='flex h-24 w-full items-center justify-center bg-gray-100 dark:bg-gray-800'>
                    <i className='fas fa-folder text-4xl text-gray-400 dark:text-gray-500' />
                  </div>
                )}
                <div className='m-2 line-clamp-2 overflow-hidden font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-yellow-600'>
                  {category.name}
                </div>
                <div className='mx-2 -mt-1 mb-2 text-xs text-gray-500 dark:text-gray-400'>
                  共 {category.count} 件
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}
