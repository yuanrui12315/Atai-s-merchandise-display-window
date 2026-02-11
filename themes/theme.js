import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

/**
 * 【终极修正】阿泰注意：
 * 我们直接把 BLOG 配置写在这里，不再引用外部 blog.config.js，
 * 这样就彻底跳过了那些该死的 require('./conf/...') 路径报错。
 */
const BLOG = {
  THEME: 'heo',
  APPEARANCE: 'light',
  APPEARANCE_DARK_TIME: [18, 6],
  SITE_TITLE: '阿泰小店 - 爆珠专卖',
  AUTHOR: '阿泰',
  LAYOUT_MAPPINGS: {
    '/': 'LayoutIndex',
    '/archive': 'LayoutArchive',
    '/search': 'LayoutSearch',
    '/category': 'LayoutCategory',
    '/tag': 'LayoutTag'
  }
}

// 安全获取配置函数
export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}

/**
 * 加载布局组件
 */
export const useLayoutByTheme = ({ layoutName, theme }) => {
  const router = useRouter()
  // 强制指定为 heo，这是你截图里显示的文件夹名
  const themeQuery = theme || BLOG.THEME
  
  return dynamic(
    () => import(`./${themeQuery}`).then(m => m[layoutName] || m.LayoutSlug).catch(err => {
        console.error('主题加载失败:', err)
        return () => <div className="hidden">Loading...</div>
    }),
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

export const getThemeConfig = async (themeQuery) => {
    try {
        const themeName = themeQuery || BLOG.THEME
        const { THEME_CONFIG } = await import(`./${themeName}`)
        return THEME_CONFIG || {}
    } catch (e) {
        return {}
    }
}

/**
 * 深色模式逻辑（完全独立，不依赖 utils）
 */
export const initDarkMode = (updateDarkMode) => {
  if (typeof window === 'undefined') return
  let isDark = false
  const userDarkMode = localStorage.getItem('darkMode')
  if (userDarkMode) {
    isDark = userDarkMode === 'dark' || userDarkMode === 'true'
  } else {
    isDark = BLOG.APPEARANCE === 'dark'
  }
  
  updateDarkMode(isDark)
  const html = document.getElementsByTagName('html')[0]
  if (html) {
    html.setAttribute('class', isDark ? 'dark' : 'light')
  }
}

export function isPreferDark() { return false }
export const loadDarkModeFromLocalStorage = () => typeof window !== 'undefined' ? localStorage.getItem('darkMode') : null
export const saveDarkModeToLocalStorage = (newTheme) => { if (typeof window !== 'undefined') localStorage.setItem('darkMode', newTheme) }
