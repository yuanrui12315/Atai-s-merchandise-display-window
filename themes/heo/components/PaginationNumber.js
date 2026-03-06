import { ChevronDoubleRight } from '@/components/HeroIcons'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 数字翻页插件
 * @param page 当前页码
 * @param showNext 是否有下一页
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationNumber = ({
  page,
  totalPage,
  postCount,
  currentPageCount = 0
}) => {
  const router = useRouter()
  const { locale, NOTION_CONFIG } = useGlobal()
  const currentPage = +page
  const showNext = page < totalPage
  const showPrev = currentPage !== 1
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 80, NOTION_CONFIG)
  // 按当前页实际商品数量动态计算，与页面真实展示一致
  const startItem = postCount ? (currentPage - 1) * POSTS_PER_PAGE + 1 : 0
  const endItem =
    postCount && currentPageCount > 0
      ? startItem + currentPageCount - 1
      : postCount
        ? Math.min(currentPage * POSTS_PER_PAGE, postCount)
        : 0
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')
  const pages = generatePages(pagePrefix, page, currentPage, totalPage)

  const [value, setValue] = useState('')

  const handleInputChange = event => {
    const newValue = event.target.value.replace(/[^0-9]/g, '')
    setValue(newValue)
  }

  /**
   * 调到指定页
   */
  const jumpToPage = () => {
    if (value) {
      router.push(
        value === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${value}`
      )
    }
  }

  const rangeText =
    postCount &&
    locale?.PAGINATION?.RANGE &&
    locale.PAGINATION.RANGE.replace('%start%', startItem)
      .replace('%end%', endItem)
      .replace('%total%', postCount)

  const navBtnClass =
    'flex items-center gap-2 px-4 py-2.5 min-w-[5rem] justify-center text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-500 dark:hover:border-yellow-500 hover:text-indigo-600 dark:hover:text-yellow-400 transition-all duration-200 cursor-pointer'

  return (
    <>
      {/* 整排分页：范围文案 + 导航按钮，统一卡片样式 */}
      <div className='mt-8 rounded-2xl bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 shadow-md px-5 py-4'>
        {/* PC端：范围文案与按钮同一行 */}
        <div className='hidden lg:flex flex-wrap items-center justify-between gap-4'>
          {/* 显示第X-Y条，共Z件商品 - 数字高亮 */}
          {rangeText && (
            <div className='flex items-center shrink-0'>
              <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                显示第{' '}
              </span>
              <span className='mx-1 font-bold text-indigo-600 dark:text-yellow-400 tabular-nums'>
                {startItem}–{endItem}
              </span>
              <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {' '}条，共{' '}
              </span>
              <span className='mx-1 font-bold text-indigo-600 dark:text-yellow-400 tabular-nums'>
                {postCount}
              </span>
              <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {' '}件商品
              </span>
            </div>
          )}

          {/* pc端分页按钮：首页/上一页/页码/下一页/尾页 */}
          <div className='flex flex-1 justify-between items-center gap-2 overflow-x-auto min-w-0'>
        {/* 左侧：首页 + 上一页 */}
        <div className='flex items-center gap-2'>
          {/* 首页 */}
          <SmartLink
            href={{
              pathname: `${pagePrefix}/`,
              query: router.query.s ? { s: router.query.s } : {}
            }}
            className={currentPage === 1 ? 'invisible' : 'block'}>
            <div className={navBtnClass}>
              <i className='fas fa-angle-double-left text-xs' />
              <span>{locale.PAGINATION?.FIRST || '首页'}</span>
            </div>
          </SmartLink>
          {/* 上一页 */}
          <SmartLink
            href={{
              pathname:
                currentPage === 2
                  ? `${pagePrefix}/`
                  : `${pagePrefix}/page/${currentPage - 1}`,
              query: router.query.s ? { s: router.query.s } : {}
            }}
            rel='prev'
            className={currentPage === 1 ? 'invisible' : 'block'}>
            <div className={navBtnClass}>
              <i className='fas fa-chevron-left text-xs' />
              <span>{locale.PAGINATION.PREV}</span>
            </div>
          </SmartLink>
        </div>

        {/* 分页数字 + 跳转 */}
        <div className='flex items-center gap-2'>
          {pages}

          {/* 跳转页码 */}
          <div className='flex items-center bg-white dark:bg-[#1e1e1e] h-10 border dark:border-gray-600 rounded-xl group hover:border-indigo-500 dark:hover:border-yellow-500 transition-all duration-200 overflow-hidden'>
            <input
              value={value}
              className='w-0 group-hover:w-16 group-hover:px-2 transition-all duration-200 bg-transparent border-none outline-none h-full text-sm text-center'
              onInput={handleInputChange}
            />
            <div
              onClick={jumpToPage}
              className='cursor-pointer px-3 py-2 text-gray-500 hover:text-indigo-600 dark:hover:text-yellow-400 transition-colors'>
              <ChevronDoubleRight className='w-4 h-4' />
            </div>
          </div>
        </div>

        {/* 右侧：下一页 + 尾页 */}
        <div className='flex items-center gap-2'>
          {/* 下一页 */}
          <SmartLink
            href={{
              pathname: `${pagePrefix}/page/${currentPage + 1}`,
              query: router.query.s ? { s: router.query.s } : {}
            }}
            rel='next'
            className={showNext ? 'block' : 'invisible'}>
            <div className={navBtnClass}>
              <span>{locale.PAGINATION.NEXT}</span>
              <i className='fas fa-chevron-right text-xs' />
            </div>
          </SmartLink>
          {/* 尾页 */}
          <SmartLink
            href={{
              pathname:
                totalPage === 1
                  ? `${pagePrefix}/`
                  : `${pagePrefix}/page/${totalPage}`,
              query: router.query.s ? { s: router.query.s } : {}
            }}
            className={currentPage === totalPage ? 'invisible' : 'block'}>
            <div className={navBtnClass}>
              <span>{locale.PAGINATION?.LAST || '尾页'}</span>
              <i className='fas fa-angle-double-right text-xs' />
            </div>
          </SmartLink>
        </div>
      </div>
        </div>

      {/* 移动端：范围文案 + 首页/上一页/下一页/尾页 */}
      {rangeText && (
        <div className='lg:hidden flex items-center justify-center mb-3 text-sm'>
          <span className='text-gray-600 dark:text-gray-400'>显示第 </span>
          <span className='font-bold text-indigo-600 dark:text-yellow-400 tabular-nums mx-0.5'>{startItem}–{endItem}</span>
          <span className='text-gray-600 dark:text-gray-400'> 条，共 </span>
          <span className='font-bold text-indigo-600 dark:text-yellow-400 tabular-nums mx-0.5'>{postCount}</span>
          <span className='text-gray-600 dark:text-gray-400'> 件商品</span>
        </div>
      )}
      <div className='lg:hidden w-full flex flex-wrap gap-2'>
        {showPrev && (
          <>
            <SmartLink
              href={{
                pathname: `${pagePrefix}/`,
                query: router.query.s ? { s: router.query.s } : {}
              }}
              className='flex flex-1 min-w-[4.5rem] items-center justify-center gap-1 h-11 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-xl active:scale-[0.98]'>
              <i className='fas fa-angle-double-left' />
              {locale.PAGINATION?.FIRST || '首页'}
            </SmartLink>
            <SmartLink
              href={{
                pathname:
                  currentPage === 2
                    ? `${pagePrefix}/`
                    : `${pagePrefix}/page/${currentPage - 1}`,
                query: router.query.s ? { s: router.query.s } : {}
              }}
              rel='prev'
              className='flex flex-1 min-w-[4.5rem] items-center justify-center gap-1 h-11 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-xl active:scale-[0.98]'>
              <i className='fas fa-chevron-left' />
              {locale.PAGINATION.PREV}
            </SmartLink>
          </>
        )}
        {showNext && (
          <>
            <SmartLink
              href={{
                pathname: `${pagePrefix}/page/${currentPage + 1}`,
                query: router.query.s ? { s: router.query.s } : {}
              }}
              rel='next'
              className='flex flex-1 min-w-[4.5rem] items-center justify-center gap-1 h-11 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-xl active:scale-[0.98]'>
              {locale.PAGINATION.NEXT}
              <i className='fas fa-chevron-right' />
            </SmartLink>
            <SmartLink
              href={{
                pathname:
                  totalPage === 1
                    ? `${pagePrefix}/`
                    : `${pagePrefix}/page/${totalPage}`,
                query: router.query.s ? { s: router.query.s } : {}
              }}
              className='flex flex-1 min-w-[4.5rem] items-center justify-center gap-1 h-11 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e1e1e] border dark:border-gray-600 rounded-xl active:scale-[0.98]'>
              {locale.PAGINATION?.LAST || '尾页'}
              <i className='fas fa-angle-double-right' />
            </SmartLink>
          </>
        )}
      </div>
      </div>
    </>
  )
}

/**
 * 页码按钮
 * @param {*} page
 * @param {*} currentPage
 * @param {*} pagePrefix
 * @returns
 */
function getPageElement(page, currentPage, pagePrefix) {
  const selected = page + '' === currentPage + ''
  if (!page) {
    return <></>
  }
  return (
    <SmartLink
      href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
      key={page}
      passHref
      className={
        (selected
          ? 'bg-indigo-600 dark:bg-yellow-600 text-white font-semibold shadow-md '
          : 'bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 font-medium ') +
        'inline-flex min-w-[2.5rem] h-10 items-center justify-center border dark:border-gray-600 rounded-xl hover:border-indigo-500 dark:hover:border-yellow-500 hover:text-indigo-600 dark:hover:text-yellow-400 duration-200 transition-all'
      }>
      {page}
    </SmartLink>
  )
}

/**
 * 获取所有页码
 * @param {*} pagePrefix
 * @param {*} page
 * @param {*} currentPage
 * @param {*} totalPage
 * @returns
 */
function generatePages(pagePrefix, page, currentPage, totalPage) {
  const pages = []
  const groupCount = 7 // 最多显示页签数
  if (totalPage <= groupCount) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(i, page, pagePrefix))
    }
  } else {
    pages.push(getPageElement(1, page, pagePrefix))
    const dynamicGroupCount = groupCount - 2
    let startPage = currentPage - 2
    if (startPage <= 1) {
      startPage = 2
    }
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount
    }
    if (startPage > 2) {
      pages.push(
        <span key={-1} className='inline-flex items-center px-1 text-gray-400 dark:text-gray-500 font-medium'>
          …
        </span>
      )
    }

    for (let i = 0; i < dynamicGroupCount; i++) {
      if (startPage + i < totalPage) {
        pages.push(getPageElement(startPage + i, page, pagePrefix))
      }
    }

    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(
        <span key={-2} className='inline-flex items-center px-1 text-gray-400 dark:text-gray-500 font-medium'>
          …
        </span>
      )
    }

    pages.push(getPageElement(totalPage, page, pagePrefix))
  }
  return pages
}
export default PaginationNumber
