// import Image from 'next/image'
import { ArrowSmallRight, PlusSmall } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { applyWidthCapToImageSrc } from '@/lib/utils/homeImageUrl'
import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'
import CONFIG from '../config'

const heroThumbCap = () =>
  siteConfig('HOME_HERO_THUMB_MAX_WIDTH', 560, CONFIG)
const heroIconCap = () =>
  siteConfig('HOME_HERO_ICON_MAX_WIDTH', 300, CONFIG)
const heroCardCap = () =>
  siteConfig('HOME_HERO_CARD_MAX_WIDTH', 780, CONFIG)

/**
 * 顶部英雄区
 * 左右布局，
 * 左侧：banner组
 * 右侧：今日卡牌遮罩
 * @returns
 */
const Hero = props => {
  const HEO_HERO_REVERSE = siteConfig('HEO_HERO_REVERSE', false, CONFIG)
  return (
    <div
      id='hero-wrapper'
      className='recent-top-post-group w-full overflow-hidden select-none px-5 mb-4'>
      <div className='flex items-baseline justify-between gap-2 mb-2 xl:hidden'>
        <div className='text-lg font-bold dark:text-gray-200'>热销款</div>
        <span className='text-[10px] text-gray-500 dark:text-gray-400 shrink-0 text-right leading-tight max-w-[9rem]'>
          左右滑动查看更多
        </span>
      </div>
      <div
        id='hero'
        style={{ zIndex: 1 }}
        className={`${HEO_HERO_REVERSE ? 'xl:flex-row-reverse' : ''}
           recent-post-top rounded-[12px] 2xl:px-5 recent-top-post-group max-w-[86rem] overflow-x-scroll w-full mx-auto flex-row flex-nowrap flex relative`}>
        {/* 左侧banner组 */}
        <BannerGroup {...props} />

        {/* 中间留白（仅桌面左右分栏时需要；手机端 Banner 已不占位） */}
        <div className='hidden h-full px-1.5 xl:block' />

        {/* 右侧置顶文章组 */}
        <TopGroup {...props} />
      </div>
    </div>
  )
}

/**
 * 英雄区左侧banner组
 * @returns
 */
function BannerGroup(props) {
  return (
    // 左侧英雄区
    <div
      id='bannerGroup'
      className='hidden max-w-[42rem] flex-col justify-between xl:mr-2 xl:flex xl:flex-1'>
      {/* 动图 */}
      <Banner {...props} />
      {/* 导航分类 */}
      <GroupMenu />
    </div>
  )
}

/**
 * 英雄区左上角banner动图
 * @returns
 */
function Banner(props) {
  const router = useRouter()
  const { allNavPages } = props
  /**
   * 随机跳转文章
   */
  function handleClickBanner() {
    const randomIndex = Math.floor(Math.random() * allNavPages.length)
    const randomPost = allNavPages[randomIndex]
    router.push(`${siteConfig('SUB_PATH', '')}/${randomPost?.slug}`)
  }

  // 遮罩文字
  const coverTitle = siteConfig('HEO_HERO_COVER_TITLE')

  return (
    <div
      id='banners'
      onClick={handleClickBanner}
      className='hidden xl:flex xl:flex-col group h-full bg-white dark:bg-[#1e1e1e] rounded-xl border dark:border-gray-700 mb-3 relative overflow-hidden'>
      <div
        id='banner-title'
        className='z-10 flex flex-col absolute top-10 left-10'>
        <div className='text-4xl font-bold mb-3  dark:text-white'>
          {siteConfig('HEO_HERO_TITLE_1', null, CONFIG)}
          <br />
          {siteConfig('HEO_HERO_TITLE_2', null, CONFIG)}
        </div>
        <div className='text-xs text-gray-600  dark:text-gray-200'>
          {siteConfig('HEO_HERO_TITLE_3', null, CONFIG)}
        </div>
      </div>

      {/* 斜向滚动的图标 */}
      <TagsGroupBar />

      {/* 遮罩 */}
      <div
        id='banner-cover'
        style={{ backdropFilter: 'blur(15px)' }}
        className={
          'z-20 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 duration-300 transition-all bg-[#4259efdd] dark:bg-[#dca846] dark:text-white cursor-pointer absolute w-full h-full top-0 flex justify-start items-center'
        }>
        <div className='ml-12 -translate-x-32 group-hover:translate-x-0 duration-300 transition-all ease-in'>
          <div className='text-7xl text-white font-extrabold'>{coverTitle}</div>
          <div className='-ml-3 text-gray-300'>
            <ArrowSmallRight className={'w-24 h-24 stroke-2'} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 图标滚动标签组
 * 英雄区左上角banner条中斜向滚动的图标
 */
function TagsGroupBar() {
  let groupIcons = siteConfig('HEO_GROUP_ICONS', null, CONFIG)
  if (groupIcons) {
    groupIcons = groupIcons.concat(groupIcons)
  }
  return (
    <div className='tags-group-all flex -rotate-[30deg] h-full'>
      <div className='tags-group-wrapper flex flex-nowrap absolute top-16'>
        {groupIcons?.map((g, index) => {
          return (
            <div key={index} className='tags-group-icon-pair ml-6 select-none'>
              <div
                style={{ background: g.color_1 }}
                className={
                  'tags-group-icon w-28 h-28 rounded-3xl flex items-center justify-center text-white text-lg font-bold shadow-md'
                }>
                <LazyImage
                  priority={false}
                  compressMaxWidth={heroIconCap()}
                  src={g.img_1}
                  title={g.title_1}
                  className='w-2/3 hidden xl:block'
                />
              </div>
              <div
                style={{ background: g.color_2 }}
                className={
                  'tags-group-icon  mt-5 w-28 h-28 rounded-3xl flex items-center justify-center text-white text-lg font-bold shadow-md'
                }>
                <LazyImage
                  priority={false}
                  compressMaxWidth={heroIconCap()}
                  src={g.img_2}
                  title={g.title_2}
                  className='w-2/3 hidden xl:block'
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 英雄区左下角3个指定分类按钮
 * @returns
 */
function GroupMenu() {
  const url_1 = siteConfig('HEO_HERO_CATEGORY_1', {}, CONFIG)?.url || ''
  const title_1 = siteConfig('HEO_HERO_CATEGORY_1', {}, CONFIG)?.title || ''
  const url_2 = siteConfig('HEO_HERO_CATEGORY_2', {}, CONFIG)?.url || ''
  const title_2 = siteConfig('HEO_HERO_CATEGORY_2', {}, CONFIG)?.title || ''
  const url_3 = siteConfig('HEO_HERO_CATEGORY_3', {}, CONFIG)?.url || ''
  const title_3 = siteConfig('HEO_HERO_CATEGORY_3', {}, CONFIG)?.title || ''

return null
}

/**
 * 置顶文章区域
 */
function TopGroup(props) {
  const { latestPosts, allNavPages, siteInfo } = props
  const { locale } = useGlobal()
  const todayCardRef = useRef()

  function handleMouseLeave() {
    todayCardRef.current?.coverUp?.()
  }

  // 获取置顶推荐文章
  const topPosts = getTopPosts({ latestPosts, allNavPages })
  const pairColumns = []
  if (topPosts?.length) {
    for (let i = 0; i < topPosts.length; i += 2) {
      pairColumns.push(topPosts.slice(i, i + 2))
    }
  }

  const deskThumbW = 560

  return (
    <div
      id='hero-right-wrapper'
      onMouseLeave={handleMouseLeave}
      className='relative flex min-w-0 w-full flex-1'>
      {/* PC：仅标题；列表为竖向滚轮滚动区域（与手机横滑分离） */}
      <div className='mb-2 hidden shrink-0 self-stretch xl:flex xl:flex-col xl:justify-start xl:pr-3'>
        <div className='text-lg font-bold [writing-mode:vertical-rl] dark:text-gray-200 xl:mt-1'>
          热销款
        </div>
      </div>
      {/* 手机：横滑；xl：多列换行 + 固定高度内竖向滚轮浏览 */}
      <div
        id='top-group'
        className='flex min-w-0 w-full flex-nowrap gap-2 overflow-x-auto overflow-y-hidden scroll-smooth pb-1 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] xl:w-0 xl:flex-1 xl:flex-wrap xl:content-start xl:gap-3 xl:overflow-x-hidden xl:overflow-y-auto xl:pb-2 xl:max-h-[min(380px,46vh)] xl:snap-none xl:min-h-0'>
        {pairColumns.map((pair, colIdx) => (
          <div
            key={pair[0]?.id || `col-${colIdx}`}
            className='flex w-[5.75rem] shrink-0 snap-start flex-col gap-1.5 sm:w-24 xl:w-52 xl:shrink-0 xl:gap-3'>
            {pair.map((p, rowIdx) => {
              if (!p) {
                return null
              }
              return (
                <SmartLink
                  href={`${siteConfig('SUB_PATH', '')}/${p?.slug}`}
                  key={p.id || `${colIdx}-${rowIdx}`}>
                  <div className='group relative flex h-[6.4rem] w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-100/90 bg-white shadow-sm dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-white xl:h-[164px] xl:rounded-xl xl:border-0 xl:bg-white xl:shadow-sm dark:xl:border-0 xl:dark:bg-black'>
                    <LazyImage
                      priority={colIdx === 0 && rowIdx === 0}
                      compressMaxWidth={deskThumbW}
                      className='h-12 w-full shrink-0 object-cover xl:h-24'
                      alt={p?.title}
                      src={p?.pageCoverThumbnail || siteInfo?.pageCover}
                    />
                    <div className='line-clamp-2 min-h-0 flex-1 overflow-hidden px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-gray-800 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-yellow-500 xl:m-2 xl:flex-none xl:px-0 xl:py-0 xl:text-base'>
                      {p?.title}
                    </div>
                    <div className='pointer-events-none absolute -left-1 -top-1 overflow-hidden rounded-lg bg-indigo-600 py-1.5 pl-2.5 pr-1.5 pt-2 text-[10px] text-white opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 dark:bg-yellow-600 -translate-x-2 xl:-left-2 xl:-top-2 xl:rounded-xl xl:text-xs xl:-translate-x-4'>
                      {locale.COMMON.RECOMMEND_BADGES}
                    </div>
                  </div>
                </SmartLink>
              )
            })}
          </div>
        ))}
      </div>
      {/* 一个大的跳转文章卡片，可通过 config 关闭 */}
      {siteConfig('HEO_HERO_TODAY_CARD_ENABLE', true, CONFIG) && (
        <TodayCard cRef={todayCardRef} siteInfo={siteInfo} />
      )}
    </div>
  )
}

/** 首页横滑条数量上限（themes/heo/config.js HEO_HERO_TOP_MAX，默认 80，最大 80） */
function getHeroTopMax() {
  const n = Number(siteConfig('HEO_HERO_TOP_MAX', 80, CONFIG))
  if (!Number.isFinite(n) || n < 1) return 80
  return Math.min(80, Math.floor(n))
}

/**
 * 获取推荐置顶文章
 * 优先级：① Notion「首页置顶」数字列 ② 环境变量 slug 列表 ③ 推荐标签 ④ 最近更新
 */
function getTopPosts({ latestPosts, allNavPages }) {
  const pages = allNavPages || []
  const max = getHeroTopMax()

  // ① Notion 数字列 heroPinOrder：1 最前，2 其次…；仅展示填了正整数的商品
  const notionPinned = pages
    .filter(p => p?.heroPinOrder > 0)
    .sort((a, b) => (a.heroPinOrder || 999) - (b.heroPinOrder || 999))
  if (notionPinned.length > 0) {
    return notionPinned.slice(0, max)
  }

  // ② 环境变量 slug 列表（无 Notion 置顶时使用）
  const pinnedRaw = siteConfig('HERO_PINNED_SLUGS', '', CONFIG)
  if (pinnedRaw && String(pinnedRaw).trim()) {
    const slugs = String(pinnedRaw)
      .split(/[,，\n\r]+/)
      .map(s => s.trim())
      .filter(Boolean)
    const bySlug = new Map(pages.map(p => [p?.slug, p]))
    const pinned = []
    for (const slug of slugs) {
      const post = bySlug.get(slug)
      if (post) pinned.push(post)
      if (pinned.length >= max) break
    }
    if (pinned.length > 0) {
      return pinned
    }
  }

  const tagName = siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG)
  // 默认展示最近更新（条数与横滑上限一致，受 getSiteData 的 latestPosts 原始长度限制）
  if (!tagName || tagName === '') {
    return (latestPosts || []).slice(0, max)
  }

  // ③ 显示包含指定标签的文章（最多 6 篇）
  let sortPosts = []
  const sortByUpdate = siteConfig(
    'HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME',
    false,
    CONFIG
  )
  const useUpdateSort =
    sortByUpdate === true ||
    sortByUpdate === 'true' ||
    (typeof sortByUpdate === 'string' && JSON.parse(sortByUpdate) === true)

  if (useUpdateSort) {
    sortPosts = Object.create(pages).sort((a, b) => {
      const dateA = new Date(a?.lastEditedDate)
      const dateB = new Date(b?.lastEditedDate)
      return dateB - dateA
    })
  } else {
    sortPosts = Object.create(pages)
  }

  const topPosts = []
  for (const post of sortPosts) {
    if (topPosts.length >= 6) {
      break
    }
    if (post?.tags?.indexOf(tagName) >= 0) {
      topPosts.push(post)
    }
  }
  return topPosts
}

/**
 * 英雄区右侧，今日卡牌
 * @returns
 */
function TodayCard({ cRef, siteInfo }) {
  const router = useRouter()
  const link = siteConfig('HEO_HERO_TITLE_LINK', null, CONFIG)
  const { locale } = useGlobal()
  // 卡牌是否盖住下层
  const [isCoverUp, setIsCoverUp] = useState(true)

  /**
   * 外部可以调用此方法
   */
  useImperativeHandle(cRef, () => {
    return {
      coverUp: () => {
        setIsCoverUp(true)
      }
    }
  })

  /**
   * 查看更多
   * @param {*} e
   */
  function handleClickShowMore(e) {
    e.stopPropagation()
    setIsCoverUp(false)
  }

  /**
   * 点击卡片跳转的链接
   * @param {*} e
   */
  function handleCardClick(e) {
    router.push(link)
  }

  return (
    <div
      id='today-card'
      className={`${
        isCoverUp ? ' ' : 'pointer-events-none'
      } overflow-hidden absolute hidden xl:flex flex-1 flex-col h-full top-0 w-full`}>
      <div
        id='card-body'
        onClick={handleCardClick}
        className={`${
          isCoverUp
            ? 'opacity-100 cursor-pointer'
            : 'opacity-0 transform scale-110 pointer-events-none'
        } shadow transition-all duration-200 today-card h-full bg-black rounded-xl relative overflow-hidden flex items-end`}>
        {/* 卡片文字信息 */}
        <div
          id='today-card-info'
          className='flex justify-between w-full relative text-white p-10 items-end'>
          <div className='flex flex-col'>
            <div className='text-xs font-light'>
              {siteConfig('HEO_HERO_TITLE_4', null, CONFIG)}
            </div>
            <div className='text-3xl font-bold'>
              {siteConfig('HEO_HERO_TITLE_5', null, CONFIG)}
            </div>
          </div>
          {/* 查看更多的按钮 */}
          <div
            onClick={handleClickShowMore}
            className={`'${isCoverUp ? '' : 'hidden pointer-events-none'} z-10 group flex items-center px-3 h-10 justify-center  rounded-3xl
            glassmorphism transition-colors duration-100 `}>
            <PlusSmall
              className={
                'group-hover:rotate-180 duration-500 transition-all w-6 h-6 mr-2 bg-white rounded-full stroke-black'
              }
            />
            <div id='more' className='select-none'>
              {locale.COMMON.RECOMMEND_POSTS}
            </div>
          </div>
        </div>

        {/* 封面图 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={applyWidthCapToImageSrc(
            siteInfo?.pageCover,
            heroCardCap()
          )}
          id='today-card-cover'
          className={`${
            isCoverUp ? '' : ' pointer-events-none'
          } hover:scale-110 duration-1000 object-cover cursor-pointer today-card-cover absolute w-full h-full top-0`}
        />
      </div>
    </div>
  )
}

export default Hero
