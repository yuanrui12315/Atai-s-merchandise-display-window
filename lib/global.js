import { APPEARANCE, LANG, NOTION_PAGE_ID, THEME } from '@/blog.config'
import {
  THEMES,
  getThemeConfig,
  initDarkMode,
  saveDarkModeToLocalStorage
} from '@/themes/theme'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { generateLocaleDict, initLocale, redirectUserLang } from './lang'

/**
 * 全局上下文
 */
const GlobalContext = createContext()

export function GlobalContextProvider(props) {
  const {
    post,
    children,
    siteInfo,
    categoryOptions,
    tagOptions,
    NOTION_CONFIG
  } = props

  const [lang, updateLang] = useState(NOTION_CONFIG?.LANG || LANG) // 默认语言
  const [locale, updateLocale] = useState(
    generateLocaleDict(NOTION_CONFIG?.LANG || LANG)
  ) // 默认语言
  const [theme, setTheme] = useState(NOTION_CONFIG?.THEME || THEME) // 默认博客主题
  const [THEME_CONFIG, SET_THEME_CONFIG] = useState(null) // 主题配置
  const [isLiteMode,setLiteMode] = useState(false)

  const defaultDarkMode = NOTION_CONFIG?.APPEARANCE || APPEARANCE
  const [isDarkMode, updateDarkMode] = useState(defaultDarkMode === 'dark') // 默认深色模式
  const [onLoading, setOnLoading] = useState(false) // 抓取文章数据
  const router = useRouter()

  // 登录验证相关
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const { isLoaded, isSignedIn, user } = enableClerk
    ? /* eslint-disable-next-line react-hooks/rules-of-hooks */
      useUser()
    : { isLoaded: true, isSignedIn: false, user: false }

  // 是否全屏
  const fullWidth = post?.fullWidth ?? false

  // 切换主题
  function switchTheme() {
    const query = router.query
    const currentTheme = query.theme || theme
    const currentIndex = THEMES.indexOf(currentTheme)
    const newIndex = currentIndex < THEMES.length - 1 ? currentIndex + 1 : 0
    const newTheme = THEMES[newIndex]
    query.theme = newTheme
    router.push({ pathname: router.pathname, query })
    return newTheme
  }

  // 抓取主题配置
  const updateThemeConfig = async theme => {
    const config = await getThemeConfig(theme)
    SET_THEME_CONFIG(config)
  }

  // 切换深色模式
  const toggleDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  function changeLang(lang) {
    if (lang) {
      updateLang(lang)
      updateLocale(generateLocaleDict(lang))
    }
  }

  // 添加路由变化时的语言处理
  useEffect(() => {
    initLocale(router.locale, changeLang, updateLocale)
    // 处理极简模式
    if (router.query.lite && router.query.lite==='true') {
      setLiteMode(true)
    }
}, [router])


  // 首次加载成功
  useEffect(() => {
    initDarkMode(updateDarkMode, defaultDarkMode)
    // 处理多语言自动重定向
    if (
      NOTION_CONFIG?.REDIRECT_LANG &&
      JSON.parse(NOTION_CONFIG?.REDIRECT_LANG)
    ) {
      redirectUserLang(NOTION_PAGE_ID)
    }
    setOnLoading(false)
  }, [])

  // 勿把 onLoading 放进依赖：handleStop 会闭包到过期的 onLoading，
  // routeChangeComplete 若早于 setState 合并执行，会导致永远不 setOnLoading(false)，LoadingCover 卡死。
  useEffect(() => {
    const handleStart = url => {
      const themeValue = router.query.theme
      const themeStr = Array.isArray(themeValue) ? themeValue[0] : themeValue

      // 勿在 routeChangeStart 里同步 router.push：会打断当前跳转，部分环境下 routeChangeComplete 丢失 → LoadingCover 永久卡住
      if (themeStr && !url.includes(`theme=${themeStr}`)) {
        const sep = url.includes('?') ? '&' : '?'
        const newUrl = `${url}${sep}theme=${encodeURIComponent(themeStr)}`
        setTimeout(() => {
          void router.replace(newUrl, newUrl, { scroll: false })
        }, 0)
      }

      setOnLoading(true)
    }

    const handleStop = () => {
      setOnLoading(false)
    }

    const currentTheme = router?.query?.theme || theme
    updateThemeConfig(currentTheme)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeError', handleStop)
    router.events.on('routeChangeComplete', handleStop)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router, theme])

  // 与「真实 URL」同步：只要 asPath 随本次跳转落到新值，说明路由已落盘，收起 LoadingCover。
  // 补齐仅依赖 router.events 时偶发的 complete 丢失（嵌套 replace、中断链路等）。
  useEffect(() => {
    if (!router.isReady) return
    setOnLoading(false)
  }, [router.asPath, router.isReady])

  return (
    <GlobalContext.Provider
      value={{
        isLiteMode,
        isLoaded,
        isSignedIn,
        user,
        fullWidth,
        NOTION_CONFIG,
        THEME_CONFIG,
        toggleDarkMode,
        onLoading,
        setOnLoading,
        lang,
        changeLang,
        locale,
        updateLocale,
        isDarkMode,
        updateDarkMode,
        theme,
        setTheme,
        switchTheme,
        siteInfo,
        categoryOptions,
        tagOptions
      }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = () => useContext(GlobalContext)
