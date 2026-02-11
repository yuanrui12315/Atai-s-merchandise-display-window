// 【绝对修正】：不用 @ 符号，直接用物理相对路径向上跳一级找配置文件
import BLOG, { LAYOUT_MAPPINGS } from '../blog.config'
// 【绝对修正】：直接指向同级目录下的 heo 主题文件夹
import * as ThemeComponents from './heo' 

import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'

export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}

export const getThemeConfig = async themeQuery => {
  if (typeof themeQuery === 'string' && themeQuery.trim()) {
    const themeName = themeQuery.split(',')[0].trim()
    if (themeName !== BLOG.THEME) {
      try {
        const THEME_CONFIG = await import(`../themes/${themeName}`)
          .then(m => m.THEME_CONFIG)
          .catch(err => {
            console.error(`Failed to load theme ${themeName}:`, err)
            return null
          })
        if (THEME_CONFIG) return THEME_CONFIG
      } catch (error) {
        return ThemeComponents?.THEME_CONFIG
      }
    }
  }
  return ThemeComponents?.THEME_CONFIG
}

export const getBaseLayoutByTheme = theme => {
  const LayoutBase = ThemeComponents['LayoutBase']
  const isDefaultTheme = !theme || theme === BLOG.THEME
  if (!isDefaultTheme) {
    return dynamic(
      () => import(`../themes/${theme}`).then(m => m['LayoutBase']),
      { ssr: true }
    )
  }
  return LayoutBase
}

export const DynamicLayout = props => {
  const { theme, layoutName } = props
  const SelectedLayout = useLayoutByTheme({ layoutName, theme })
  return <SelectedLayout {...props} />
}

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
      () => import(`../themes/${themeQuery}`).then(m => loadThemeComponents(m)),
      { ssr: true }
    )
  }
  return LayoutComponents
}

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

export const loadDarkModeFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem('darkMode') : null
}

export const saveDarkModeToLocalStorage = newTheme => {
  if (isBrowser) localStorage.setItem('darkMode', newTheme)
}
