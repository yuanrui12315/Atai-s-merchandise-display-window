'use client'
import { useEffect, useState } from 'react'

/**
 * 回到顶部按钮
 * 仅当滚动到底部时显示，位置：主内容区右下角（避免遮挡侧边栏）
 */
const BOTTOM_THRESHOLD = 100 // 距离底部多少 px 时显示
const MOBILE_THRESHOLD = 150 // 手机端阈值稍大，避免首页内容未完全渲染时漏显

export default function BackToTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function checkScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const distanceFromBottom = scrollHeight - scrollY - clientHeight
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
      const threshold = isMobile ? MOBILE_THRESHOLD : BOTTOM_THRESHOLD
      setShow(distanceFromBottom <= threshold)
    }

    checkScroll()
    const rafCheck = () => requestAnimationFrame(checkScroll)
    window.addEventListener('scroll', rafCheck, { passive: true })
    window.addEventListener('resize', rafCheck)
    const t = setTimeout(checkScroll, 300)
    return () => {
      window.removeEventListener('scroll', rafCheck)
      window.removeEventListener('resize', rafCheck)
      clearTimeout(t)
    }
  }, [])

  if (!show) return null

  return (
    <button
      type='button'
      title='回到顶部'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed z-40 w-12 h-12 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-indigo-600 dark:bg-gray-600 dark:hover:bg-yellow-500 text-white shadow-lg transition-all duration-200 bottom-6 right-6 xl:right-[20.5rem]'
      aria-label='回到顶部'>
      <i className='fas fa-chevron-up text-2xl' />
    </button>
  )
}
