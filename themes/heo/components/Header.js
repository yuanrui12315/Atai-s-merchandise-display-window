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
        {/* 手机：单独一行 flex（flex-1 min-w-0 overflow-hidden），避免 grid/clip 在部分机型上不生效导致压住图标 */}
        <div className='mx-auto flex h-full w-full max-w-[86rem] items-center justify-between gap-2 px-4 lg:hidden'>
          <div className='min-h-0 min-w-0 flex-1 basis-0 overflow-hidden'>
            <Logo {...props} />
          </div>
          <div className='flex shrink-0 items-center gap-0.5'>
            <RandomPostButton {...props} />
            {!JSON.parse(siteConfig('THEME_SWITCH')) && (
              <div className='hidden shrink-0 md:block'>
                <DarkModeButton {...props} />
              </div>
            )}
            <div className='flex shrink-0 items-center'>
              <SearchButton {...props} />
            </div>
            <ReadingProgress />
            <div
              onClick={toggleMenuOpen}
              className='flex h-8 w-8 cursor-pointer items-center justify-center'>
              <i className='fas fa-bars' />
            </div>
          </div>
        </div>

        {/* PC：Logo | 搜索+菜单 | 右侧工具 */}
        <div className='mx-auto hidden h-full w-full max-w-[86rem] items-center justify-between gap-4 px-6 lg:flex'>
          <div className='shrink-0'>
            <Logo {...props} />
          </div>
          <div className='flex min-w-0 flex-1 items-center gap-6'>
            <div className='max-w-2xl min-w-0 flex-1'>
              <div className='flex w-full items-center rounded-lg border border-gray-200 bg-white py-1.5 pl-4 pr-2 shadow-sm dark:border-gray-500 dark:bg-gray-600'>
                <SearchInput {...props} className='border-0 shadow-none' />
              </div>
            </div>
            <div className='shrink-0'>
              <MenuListTop {...props} />
            </div>
          </div>
          <div className='flex w-48 shrink-0 items-center justify-end gap-2'>
            <RandomPostButton {...props} />
            {!JSON.parse(siteConfig('THEME_SWITCH')) && (
              <DarkModeButton {...props} />
            )}
            <ReadingProgress />
          </div>
        </div>
        {/* 侧拉抽屉不参与顶栏 flex 排版，避免占位/层叠异常 */}
        <SlideOver cRef={slideOverRef} {...props} />
      </nav>
    </>
  )
}

export default Header
