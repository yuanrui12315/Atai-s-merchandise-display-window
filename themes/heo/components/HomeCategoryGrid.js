import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 首页全部分类网格（参考同行：分类带图、商品数）
 * @param {*} props
 * @returns
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
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {categoryOptions.map(category => {
          const imgSrc = categoryImages[category.name]
          return (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              legacyBehavior>
              <div className='group flex flex-col items-center p-4 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-xl hover:border-indigo-600 dark:hover:border-yellow-600 hover:shadow-lg transition-all duration-200 cursor-pointer'>
                <div className='w-16 h-16 mb-2 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center'>
                  {imgSrc ? (
                    <LazyImage
                      src={imgSrc}
                      alt={category.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-200'
                    />
                  ) : (
                    <i className='fas fa-folder text-2xl text-gray-400 dark:text-gray-500' />
                  )}
                </div>
                <div className='text-sm font-medium text-center text-gray-900 dark:text-gray-100 line-clamp-2'>
                  {category.name}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {category.count} 件
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}
