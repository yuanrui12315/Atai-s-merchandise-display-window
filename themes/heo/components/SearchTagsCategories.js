import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import Card from './Card'
import TagItemMini from './TagItemMini'

/**
 * 搜索页下方的分类和标签展示（无搜索框版本）
 * @param {*} props
 * @returns
 */
export default function SearchTagsCategories(props) {
  const { tagOptions, categoryOptions } = props
  const { locale } = useGlobal()

  return (
    <div className='my-6 px-2'>
      {/* 分类 */}
      {categoryOptions?.length > 0 && (
        <Card className='w-full mt-4 bg-white dark:bg-[#1a191d]'>
          <div className='dark:text-gray-200 mb-5 mx-3 text-3xl'>
            {locale.COMMON.CATEGORY}:
          </div>
          <div id='category-list' className='duration-200 flex flex-wrap mx-8'>
            {categoryOptions.map(category => (
              <SmartLink
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior>
                <div className='duration-300 dark:hover:text-white dark:text-gray-200 rounded-2xl px-3 cursor-pointer py-1 hover:bg-indigo-600 dark:hover:bg-yellow-600 hover:text-white'>
                  <i className='mr-4 fas fa-folder' />
                  {category.name}({category.count})
                </div>
              </SmartLink>
            ))}
          </div>
        </Card>
      )}
      {/* 标签 */}
      {tagOptions?.length > 0 && (
        <Card className='w-full mt-4 bg-white dark:bg-[#1a191d]'>
          <div className='dark:text-gray-200 mb-5 ml-4 text-3xl'>
            {locale.COMMON.TAGS}:
          </div>
          <div id='tags-list' className='duration-200 flex flex-wrap ml-8'>
            {tagOptions.map(tag => (
              <div key={tag.name} className='p-2'>
                <TagItemMini key={tag.name} tag={tag} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
