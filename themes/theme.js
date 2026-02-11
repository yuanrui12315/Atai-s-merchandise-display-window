// 【核心修改】：现在我们直接在同级目录找刚才复制进来的配置文件
import BLOG, { LAYOUT_MAPPINGS } from './blog.config'
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
        const THEME_CONFIG = await import(`@/themes/${themeName}`).then(m => m.THEME_CONFIG)
        return THEME_CONFIG || ThemeComponents?.THEME_CONFIG
      } catch (error) {
        return ThemeComponents?.THEME_CONFIG
      }
    }
  }
  return ThemeComponents?.THEME_CONFIG
}

export const getBaseLayoutByTheme = theme => {
  const LayoutBase = ThemeComponents['LayoutBase']
  if (theme && theme !== BLOG.THEME) {
    return dynamic(() => import(`@/themes/${theme}`).then(m => m['LayoutBase']), { ssr: true })
  }
  return LayoutBase
}

export const DynamicLayout = props => {
  const SelectedLayout = useLayoutByTheme({ layoutName: props.layoutName, theme: props.theme })
  return <SelectedLayout {...props} />
}

export const useLayoutByTheme = ({ layoutName, theme }) => {
  const LayoutComponents = ThemeComponents[layoutName] || ThemeComponents.LayoutSlug
  const router = useRouter()
  const themeQuery = getQueryParam(router?.asPath, 'theme') || theme
  if (themeQuery && themeQuery !== BLOG.THEME) {
    return dynamic(() => import(`@/themes/${themeQuery}`).then(m => m[layoutName] || m.LayoutSlug), { ssr: true })
  }
  return LayoutComponents
}

export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  let newDarkMode = isPreferDark()
  const userDarkMode = isBrowser ? localStorage.getItem('darkMode') : null
  if (userDarkMode) newDarkMode = (userDarkMode === 'dark' || userDarkMode === 'true')
  if (isBrowser) {
    updateDarkMode(newDarkMode)
    document.getElementsByTagName('html')[0].setAttribute('class', newDarkMode ? 'dark' : 'light')
  }
}

export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') return true
  if (BLOG.APPEARANCE === 'auto' && isBrowser) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

export const loadDarkModeFromLocalStorage = () => isBrowser ? localStorage.getItem('darkMode') : null
export const saveDarkModeToLocalStorage = newTheme => { if (isBrowser) localStorage.setItem('darkMode', newTheme) }
