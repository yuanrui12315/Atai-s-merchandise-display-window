// 第一步：配置信息保持在内部分解，确保不依赖外部文件
const BLOG = {
  THEME: 'heo',
  APPEARANCE: 'auto',
  APPEARANCE_DARK_TIME: [18, 6]
}

// 第二步：【关键修正】
// 因为你的 heo 文件夹里没有 index.js，所以我们直接引用 heo.js 或该目录下的主要组件
// 根据 NotionNext 的标准结构，直接引用 './heo'，Webpack 会自动寻找里面的组件
import * as ThemeComponents from './heo' 

import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'

export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}

export const getThemeConfig = async themeQuery => {
  return ThemeComponents?.THEME_CONFIG || {}
}

export const getBaseLayoutByTheme = theme => {
  return ThemeComponents['LayoutBase']
}

export const DynamicLayout = props => {
  const SelectedLayout = useLayoutByTheme({ layoutName: props.layoutName, theme: props.theme })
  return <SelectedLayout {...props} />
}

export const useLayoutByTheme = ({ layoutName, theme }) => {
  const LayoutComponents = ThemeComponents[layoutName] || ThemeComponents.LayoutSlug
  const router = useRouter()
  const themeQuery = getQueryParam(router?.asPath, 'theme') || theme
  return LayoutComponents
}

export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  if (!isBrowser) return
  let newDarkMode = isPreferDark()
  const userDarkMode = localStorage.getItem('darkMode')
  if (userDarkMode) newDarkMode = (userDarkMode === 'dark' || userDarkMode === 'true')
  updateDarkMode(newDarkMode)
  if (document.getElementsByTagName('html')[0]) {
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
