// 修正：使用相对路径确保能找到根目录的配置文件
import BLOG, { LAYOUT_MAPPINGS } from '../blog.config'
// 修正：直接指向 heo 文件夹
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

        if (THEME_CONFIG) {
          return THEME_CONFIG
        } else {
          return ThemeComponents?.THEME_CONFIG
        }
      } catch (error) {
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
  const LayoutComponents =
    ThemeComponents[layoutName] || ThemeComponents.LayoutSlug

  const router = useRouter()
  const themeQuery = getQueryParam(router?.asPath, 'theme') || theme
  const isDefaultTheme = !themeQuery || themeQuery === BLOG.THEME

  if (!isDefaultTheme) {
    const loadThemeComponents = componentsSource => {
      const components =
        componentsSource[layoutName] || componentsSource.LayoutSlug
      setTimeout(fixThemeDOM, 500)
      return components
    }
    return dynamic(
      () => import(`@/themes/${themeQuery}`).then(m => loadThemeComponents(m)),
      { ssr: true }
    )
  }

  setTimeout(fixThemeDOM, 100)
  return LayoutComponents
}

/**
 * 根据路径 获取对应的layout名称
 */
const getLayoutNameByPath = path => {
  return LAYOUT_MAPPINGS[path] || 'LayoutSlug'
}

/**
 * 切换主题时的特殊处理
 */
const fixThemeDOM = () => {
  if (isBrowser) {
    const elements = document.querySelectorAll('[id^="theme-"]')
    if (elements?.length > 1) {
      for (let i = 0; i < elements.length - 1; i++) {
        if (
          elements[i] &&
          elements[i].parentNode &&
          elements[i].parentNode.contains(elements[i])
        ) {
          elements[i].parentNode.removeChild(elements[i])
        }
      }
      elements[0]?.scrollIntoView()
    }
  }
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
  if (defaultDarkMode === 'true') {
    newDarkMode = true
  }
  const queryMode = getQueryVariable('mode')
  if (queryMode) {
    newDarkMode = queryMode === 'dark'
  }
  updateDarkMode(newDarkMode)
  if (isBrowser) {
    document.getElementsByTagName('html')[0].setAttribute('class', newDarkMode ? 'dark' : 'light')
  }
}

export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') return true
  if (BLOG.APPEARANCE === 'auto') {
    const date = new Date()
    if (typeof window !== 'undefined') {
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

export const loadDarkModeFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('darkMode') : null
}

export const saveDarkModeToLocalStorage = newTheme => {
  if (isBrowser) localStorage.setItem('darkMode', newTheme)
}
