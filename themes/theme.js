// 1. 使用最原始的相对路径，避开所有 @ 符号别名
import BLOG, { LAYOUT_MAPPINGS } from '../blog.config'
import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'

/**
 * 【核心修正】阿泰注意：
 * 我现在不用 import * as ThemeComponents 了，
 * 这种写法在你的 Vercel 环境下容易找不到 index。
 * 我们直接动态加载它。
 */

// 在next.config.js中扫描所有主题
export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}

/**
 * 获取主题配置
 */
export const getThemeConfig = async (themeQuery) => {
  const themeName = (typeof themeQuery === 'string' && themeQuery.trim()) 
    ? themeQuery.split(',')[0].trim() 
    : BLOG.THEME
  
  try {
    const { THEME_CONFIG } = await import(`./${themeName}`)
    return THEME_CONFIG
  } catch (err) {
    return {}
  }
}

/**
 * 加载布局
 */
export const useLayoutByTheme = ({ layoutName, theme }) => {
  const router = useRouter()
  const themeQuery = getQueryParam(router?.asPath, 'theme') || theme || BLOG.THEME
  
  // 强制动态导入具体主题文件夹
  return dynamic(
    () => import(`./${themeQuery}`).then(m => m[layoutName] || m.LayoutSlug),
    { ssr: true }
  )
}

export const DynamicLayout = (props) => {
  const SelectedLayout = useLayoutByTheme({ layoutName: props.layoutName, theme: props.theme })
  return <SelectedLayout {...props} />
}

export const getBaseLayoutByTheme = (theme) => {
  const themeQuery = theme || BLOG.THEME
  return dynamic(
    () => import(`./${themeQuery}`).then(m => m.LayoutBase),
    { ssr: true }
  )
}

// --- 以下是深色模式逻辑，保持原样但增加 isBrowser 安全保护 ---

export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  if (!isBrowser) return
  let newDarkMode = isPreferDark()
  const userDarkMode = localStorage.getItem('darkMode')
  if (userDarkMode) newDarkMode = (userDarkMode === 'dark' || userDarkMode === 'true')
  if (defaultDarkMode === 'true') newDarkMode = true
  
  updateDarkMode(newDarkMode)
  const html = document.getElementsByTagName('html')[0]
  if (html) {
    html.setAttribute('class', newDarkMode ? 'dark' : 'light')
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
