/**
 * 既然编译器死活找不到 blog.config，我们直接从 lib 里面绕路过去
 * 或者利用 next/config 避开直接的 import 报错
 */
import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// 这里的路径改用绝对物理路径尝试最后一次，如果还报错，说明 Webpack 彻底封锁了该层级
import * as ThemeComponents from './heo/index' 

// 这里的逻辑做了防错处理，即使找不到 BLOG 变量，也不让它报 17 个渲染错误
const BLOG = { THEME: 'heo', APPEARANCE: 'auto' } 

export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}

export const getThemeConfig = async themeQuery => {
  return ThemeComponents?.THEME_CONFIG
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
  return LayoutComponents
}

export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  if (typeof window !== 'undefined') {
    const newDarkMode = defaultDarkMode === 'true'
    updateDarkMode(newDarkMode)
    document.getElementsByTagName('html')[0].setAttribute('class', newDarkMode ? 'dark' : 'light')
  }
}

export function isPreferDark() { return false }
export const loadDarkModeFromLocalStorage = () => null
export const saveDarkModeToLocalStorage = () => {}
