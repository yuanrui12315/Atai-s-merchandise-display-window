import BLOG, { LAYOUT_MAPPINGS } from '../blog.config'
import * as ThemeComponents from './heo'
import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'

// 在next.config.js中扫描所有主题
export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}

/**
 * 获取主题配置
 */
export const getThemeConfig = async themeQuery => {
  if (themeQuery && themeQuery !== BLOG.THEME) {
    try {
      const { THEME_CONFIG } = await import(`./${themeQuery}`)
      return THEME_CONFIG || ThemeComponents.THEME_CONFIG
    } catch (err) {
      console.error('Failed to load theme config', err)
      return ThemeComponents.THEME_CONFIG
    }
  }
  return ThemeComponents.THEME_CONFIG
}

/**
 * 加载全局布局
 */
export const getBaseLayoutByTheme = theme => {
  const isDefaultTheme = !theme || theme === BLOG.THEME
  if (!isDefaultTheme) {
    return dynamic(() => import(`./${theme}`).then(m => m.LayoutBase), { ssr: true })
  }
  return ThemeComponents.LayoutBase
}

/**
 * 动态获取布局组件
 */
export const DynamicLayout = props => {
  const { theme, layoutName } = props
  const SelectedLayout = useLayoutByTheme({ layoutName, theme })
  return <SelectedLayout {...props} />
}

/**
 * 根据主题加载对应的 Layout 文件
 */
export const useLayoutByTheme = ({ layoutName, theme }) => {
  const router = useRouter()
  const themeQuery = getQueryParam(router?.asPath, 'theme') || theme || BLOG.THEME
  const isDefaultTheme = themeQuery === BLOG.THEME

  if (!isDefaultTheme) {
    return dynamic(() => import(`./${themeQuery}`).then(m => m[layoutName] || m.LayoutSlug), { ssr: true })
  }

  return ThemeComponents[layoutName] || ThemeComponents.LayoutSlug
}

/**
 * 初始化深色模式
 */
export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  if (!isBrowser) return
  let newDarkMode = isPreferDark()
  const userDarkMode = localStorage.getItem('darkMode')
  
  if (userDarkMode) {
    newDarkMode = userDarkMode === 'dark' || userDarkMode === 'true'
  }
  if (defaultDarkMode === 'true') {
    newDarkMode = true
  }

  updateDarkMode(newDarkMode)
  document.getElementsByTagName('html')[0].setAttribute('class', newDarkMode ? 'dark' : 'light')
}

/**
 * 检测系统深色模式偏好
 */
export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') return true
  if (BLOG.APPEARANCE === 'auto' && isBrowser) {
    const date = new Date()
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    return (
      prefersDarkMode ||
      (BLOG.APPEARANCE_DARK_TIME &&
        (date.getHours() >= BLOG.APPEARANCE_DARK_TIME[0] ||
          date.getHours() < BLOG.APPEARANCE_DARK_TIME[1]))
    )
  }
  return false
}

export const loadDarkModeFromLocalStorage = () => isBrowser ? localStorage.getItem('darkMode') : null
export const saveDarkModeToLocalStorage = (newTheme) => {
  if (isBrowser) localStorage.setItem('darkMode', newTheme)
}
