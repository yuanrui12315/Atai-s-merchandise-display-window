import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import DarkModeButton from './DarkModeButton'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import RandomPostButton from './RandomPostButton'
import ReadingProgress from './ReadingProgress'
import SearchButton from './SearchButton'
import SearchInput from './SearchInput'
import SlideOver from './SlideOver'

/**
 * 页头：顶部导航
 * @param {*} param0
 * @returns
 */
const Header = props => {
  const [fixedNav, setFixedNav] = useState(false)
  const [textWhite, setTextWhite] = useState(false)
  const [navBgWhite, setBgWhite] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const router = useRouter()
  const slideOverRef = useRef()

  const toggleMenuOpen = () => {
    slideOverRef?.current?.toggleSlideOvers()
  }

  /**
   * 根据滚动条，切换导航栏样式
   */
  const scrollTrigger = useCallback(
    throttle(() => {
      const scrollS = window.scrollY
      // 导航栏设置 白色背景
      if (scrollS <= 1) {
        setFixedNav(false)
        setBgWhite(false)
        setTextWhite(false)

        // 文章详情页特殊处理
        if (document?.querySelector('#post-bg')) {
          setFixedNav(true)
          setTextWhite(true)
        }
      } else {
        // 向下滚动后的导航样式
        setFixedNav(true)
        setTextWhite(false)
        setBgWhite(true)
      }
    }, 100)
  )
  useEffect(() => {
    scrollTrigger()
  }, [router])

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  // 导航栏根据滚动轮播菜单内容
  useEffect(() => {
    let prevScrollY = 0
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (currentScrollY > prevScrollY) {
            setActiveIndex(1) // 向下滚动时设置activeIndex为1
          } else {
            setActiveIndex(0) // 向上滚动时设置activeIndex为0
          }
          prevScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    if (isBrowser) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (isBrowser) {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0.5;
            transform: translateY(-30%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0.5;
            transform: translateY(30%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-down {
          animation: fade-in-down 0.3s ease-in-out;
        }

        .fade-in-up {
          animation: fade-in-up 0.3s ease-in-out;
        }
      `}</style>

      {/* fixed时留白高度 */}
      {fixedNav && !document?.querySelector('#post-bg') && (
        <div className='h-16'></div>
      )}

      {/* 顶部导航菜单栏 */}
      <nav
        id='nav'
        className={`z-20 h-16 top-0 w-full duration-300 transition-all
            ${fixedNav ? 'fixed' : 'relative bg-transparent'} 
            ${textWhite ? 'text-white ' : 'text-black dark:text-white'}  
            ${navBgWhite ? 'bg-white dark:bg-[#18171d] shadow' : 'bg-transparent'}`}>
        {/* 手机：两列 grid 明确分出标题区与图标区，避免 flex+overflow-hidden 把整列 Logo 裁没；PC：横向 flex */}
        <div className='mx-auto grid h-full w-full max-w-[86rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-4 lg:flex lg:items-center lg:justify-between lg:gap-4 lg:px-6'>
          {/* 手机：overflow-x-clip 防止 Logo 行 intrinsic 宽度超出第一列、画到搜索按钮上 */}
          <div className='min-w-0 max-w-full overflow-x-clip pr-1 lg:overflow-visible lg:pr-0'>
            <Logo {...props} />
          </div>

          {/* 中间：大搜索框 + 菜单（PC端，vapingcountry 风格） */}
          <div className='hidden min-w-0 flex-1 items-center gap-6 lg:flex'>
            <div className='flex-1 min-w-0 max-w-2xl'>
              <div className='w-full flex items-center bg-white dark:bg-gray-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 pl-4 pr-2 py-1.5'>
                <SearchInput {...props} className='border-0 shadow-none' />
              </div>
            </div>
            <div className='flex-shrink-0'>
              <MenuListTop {...props} />
            </div>
          </div>

          <div className='flex w-max shrink-0 items-center justify-end justify-self-end gap-1 lg:w-48 lg:justify-self-auto lg:gap-2'>
            <RandomPostButton {...props} />
            {/* 移动端显示搜索图标，PC端已用大搜索框替代 */}
            <div className='lg:hidden'>
              <SearchButton {...props} />
            </div>
            {!JSON.parse(siteConfig('THEME_SWITCH')) && (
              <div className='hidden md:block'>
                <DarkModeButton {...props} />
              </div>
            )}
            <ReadingProgress />

            {/* 移动端菜单按钮 */}
            <div
              onClick={toggleMenuOpen}
              className='flex lg:hidden w-8 justify-center items-center h-8 cursor-pointer'>
              <i className='fas fa-bars' />
            </div>
          </div>
        </div>
        {/* 侧拉抽屉不参与顶栏 flex 排版，避免占位/层叠异常 */}
        <SlideOver cRef={slideOverRef} {...props} />
      </nav>
    </>
  )
}

export default Header
