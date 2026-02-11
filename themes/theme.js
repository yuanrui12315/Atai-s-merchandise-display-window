import BLOG, { LAYOUT_MAPPINGS } from '@/blog.config'
// 关键修正：直接引用 heo 文件夹，打破别名死循环
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
  if (typeof themeQuery === 'string' && themeQuery.trim()) {
    const themeName = themeQuery.split(',')[0].trim()
    if (themeName !== BLOG.THEME) {
      try {
        const THEME_CONFIG = await import(`@/themes/${themeName}`)
          .then(m => m.THEME_CONFIG)
          .catch(err => {
            console.error(`Failed to load theme ${themeName}:`, err)
            return null
          })
        if (THEME_CONFIG) return THEME_CONFIG
      } catch (error) {
        console.error(`Error loading theme configuration for ${themeName}:`, error)
        return ThemeComponents?.THEME_CONFIG
      }
    }
  }
  return ThemeComponents?.THEME_CONFIG
}

/**
 * 加载全局布局
 */
export const getBaseLayoutByTheme = theme => {
  const LayoutBase = ThemeComponents['LayoutBase']
  const isDefaultTheme = !theme || theme === BLOG.THEME
  if (!isDefaultTheme) {
    return dynamic(
      () => import(`@/themes/${theme}`).then(m => m['LayoutBase']),
      { ssr: true }
    )
  }
  return LayoutBase
}

/**
 * 动态获取布局
 */
export const DynamicLayout = props => {
  const { theme, layoutName } = props
  const SelectedLayout = useLayoutByTheme({ layoutName, theme })
  return <SelectedLayout {...props} />
}

/**
 * 加载主题文件
 */
export const useLayoutByTheme = ({ layoutName, theme }) => {
  const LayoutComponents = ThemeComponents[layoutName] || ThemeComponents.LayoutSlug
  const router = useRouter()
  const themeQuery = getQueryParam(router?.asPath, 'theme') || theme
  const isDefaultTheme = !themeQuery || themeQuery === BLOG.THEME

  if (!isDefaultTheme) {
    const loadThemeComponents = componentsSource => {
      const components = componentsSource[layoutName] || componentsSource.LayoutSlug
      return components
    }
    return dynamic(
      () => import(`@/themes/${themeQuery}`).then(m => loadThemeComponents(m)),
      { ssr: true }
    )
  }

  return LayoutComponents
}

/**
 * 初始化主题
 */
export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  let newDarkMode = isPreferDark()
  const userDarkMode = loadDarkModeFromLocalStorage()
  if (userDarkMode) {
    newDarkMode = userDarkMode === 'dark' || userDarkMode === 'true'
    saveDarkModeToLocalStorage(newDarkMode)
  }
  if (defaultDarkMode === 'true') newDarkMode = true
  const queryMode = getQueryVariable('mode')
  if (queryMode) newDarkMode = queryMode === 'dark'

  updateDarkMode(newDarkMode)
  if (isBrowser) {
    document.getElementsByTagName('html')[0].setAttribute('class', newDarkMode ? 'dark' : 'light')
  }
}

/**
 * 是否优先深色模式
 */
export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') return true
  if (BLOG.APPEARANCE === 'auto') {
    const date = new Date()
    if (isBrowser) {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      return (
        prefersDarkMode ||
        (BLOG.APPEARANCE_DARK_TIME &&
          (date.getHours() >= BLOG.APPEARANCE_DARK_TIME[0] ||
            date.getHours() < BLOG.APPEARANCE_DARK_TIME[1]))
      )
    }
  }
  return false
}

/**
 * 读取深色模式
 */
export const loadDarkModeFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('darkMode') : null
}

/**
 * 保存深色模式
 */
export const saveDarkModeToLocalStorage = newTheme => {
  if (isBrowser) localStorage.setItem('darkMode', newTheme)
}
