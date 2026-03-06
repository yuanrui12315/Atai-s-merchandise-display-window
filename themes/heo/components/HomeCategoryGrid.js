import Image from 'next/image'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

// 分类卡片顶部细线色（与标签的彩色 pill 区分，用极淡的色条增加层次）
const CARD_ACCENTS = [
  'border-t-indigo-300 dark:border-t-indigo-600',
  'border-t-violet-300 dark:border-t-violet-600',
  'border-t-slate-400 dark:border-t-slate-500',
  'border-t-sky-300 dark:border-t-sky-600',
  'border-t-amber-300 dark:border-t-amber-600',
  'border-t-rose-300 dark:border-t-rose-600'
]

/**
 * 首页全部分类网格 - 图片为主、卡片式，与标签 pill 风格区分
 * 使用 Next.js Image 自动压缩，大幅加速加载
 */
export default function HomeCategoryGrid(props) {
  const { categoryOptions } = props
  const categoryImages = siteConfig('HEO_CATEGORY_IMAGES', {}, CONFIG) || {}

  if (!categoryOptions || categoryOptions.length === 0) {
    return null
  }

  return (
    <div id='category-grid' className='wow fadeInUp mb-8'>
      <div className='text-2xl font-bold dark:text-gray-200 mb-4'>
        商品分类
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5'>
        {categoryOptions.map((category, index) => {
          const imgSrc = categoryImages[category.name]
          const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]
          return (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              legacyBehavior>
              <div
                className={`group relative flex flex-col overflow-hidden bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-2xl border-t-4 ${accent} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}>
                {/* 图片区：更大、圆角、悬停时图片放大 */}
                <div className='aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-700/50'>
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={category.name}
                      width={160}
                      height={160}
                      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
                      loading={index < 12 ? 'eager' : 'lazy'}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <i className='fas fa-folder text-4xl text-gray-400 dark:text-gray-500' />
                    </div>
                  )}
                </div>
                {/* 文字区 */}
                <div className='p-3 flex flex-col items-center'>
                  <div className='text-sm font-semibold text-center text-gray-900 dark:text-gray-100 line-clamp-2'>
                    {category.name}
                  </div>
                  <span className='mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                    {category.count} 件
                  </span>
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}
