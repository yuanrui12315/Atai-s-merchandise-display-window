import BLOG, { LAYOUT_MAPPINGS } from '../blog.config'
// 直接指向当前文件夹下的 heo 主题，不再绕路别名
import * as ThemeComponents from './heo'
import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'

export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}

export const getThemeConfig = async themeQuery => {
  const themeName = themeQuery || BLOG.THEME
  if (themeName !== BLOG.THEME) {
    try {
      const { THEME_CONFIG } = await import(`./${themeName}`)
      return THEME_CONFIG
    } catch (err) {
      return ThemeComponents.THEME_CONFIG
    }
  }
  return ThemeComponents.THEME_CONFIG
}

export const getBaseLayoutByTheme = theme => {
  const themeName = theme || BLOG.THEME
  if (themeName !== BLOG.THEME) {
    return dynamic(() => import(`./${themeName}`).then(m => m.LayoutBase), { ssr: true })
  }
  return ThemeComponents.LayoutBase
}

export const DynamicLayout = props => {
  const { theme, layoutName } = props
  const SelectedLayout = useLayoutByTheme({ layoutName, theme })
  return <SelectedLayout {...props} />
}

export const useLayoutByTheme = ({ layoutName, theme }) => {
  const router = useRouter()
  const themeQuery = getQueryParam(router?.asPath, 'theme') || theme || BLOG.THEME
  if (themeQuery !== BLOG.THEME) {
    return dynamic(() => import(`./${themeQuery}`).then(m => m[layoutName] || m.LayoutSlug), { ssr: true })
  }
  return ThemeComponents[layoutName] || ThemeComponents.LayoutSlug
}

export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  if (!isBrowser) return
  let newDarkMode = isPreferDark()
  const userDarkMode = localStorage.getItem('darkMode')
  if (userDarkMode) newDarkMode = (userDarkMode === 'dark' || userDarkMode === 'true')
  if (defaultDarkMode === 'true') newDarkMode = true
  updateDarkMode(newDarkMode)
  document.documentElement.classList.toggle('dark', newDarkMode)
}

export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') return true
  if (BLOG.APPEARANCE === 'auto' && isBrowser) {
    const date = new Date()
    return window.matchMedia('(prefers-color-scheme: dark)').matches || 
           (BLOG.APPEARANCE_DARK_TIME && (date.getHours() >= BLOG.APPEARANCE_DARK_TIME[0] || date.getHours() < BLOG.APPEARANCE_DARK_TIME[1]))
  }
  return false
}

export const loadDarkModeFromLocalStorage = () => isBrowser ? localStorage.getItem('darkMode') : null
export const saveDarkModeToLocalStorage = (newTheme) => { if (isBrowser) localStorage.setItem('darkMode', newTheme) }
