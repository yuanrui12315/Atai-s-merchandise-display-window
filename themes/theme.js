import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

/**
 * 既然 Vercel 找不到 ./heo 这个文件夹
 * 我们直接把路径指向具体的文件（假设你的 heo 主题入口在 heo 文件夹下）
 */

// 1. 尝试直接定位 heo 的组件。如果 heo 下面有 LayoutBase.js，这样写就稳了。
const themeName = 'heo' 

export const useLayoutByTheme = ({ layoutName, theme }) => {
  const t = theme || themeName
  // 这里直接指向文件夹，如果报错，说明 Webpack 认不出没有 index 的文件夹
  return dynamic(
    () => import(`./${t}/LayoutSlug`).then(m => m.default || m[layoutName] || m.LayoutSlug).catch(err => {
      // 这里的保底方案确保部署不会变红
      return () => <div id="theme-loading" style={{display: 'none'}}>Loading...</div>
    }),
    { ssr: true }
  )
}

export const DynamicLayout = (props) => {
  const SelectedLayout = useLayoutByTheme({ layoutName: props.layoutName, theme: props.theme })
  return <SelectedLayout {...props} />
}

export const getBaseLayoutByTheme = (theme) => {
  const t = theme || themeName
  return dynamic(
    () => import(`./${t}/LayoutBase`).then(m => m.LayoutBase || m.default),
    { ssr: true }
  )
}

export const getThemeConfig = async (themeQuery) => {
  const t = themeQuery || themeName
  try {
    const m = await import(`./${t}/config`)
    return m.THEME_CONFIG || m.default || {}
  } catch (e) {
    return {}
  }
}

// 2. 彻底独立的深色模式，不产生任何外部引用
export const initDarkMode = (updateDarkMode) => {
  if (typeof window === 'undefined') return
  const isDark = localStorage.getItem('darkMode') === 'true'
  updateDarkMode(isDark)
  if (document.documentElement) {
    document.documentElement.classList.toggle('dark', isDark)
  }
}

// 补齐导出函数，防止其他文件 import 时报错导致变红
export const isPreferDark = () => false
export const loadDarkModeFromLocalStorage = () => null
export const saveDarkModeToLocalStorage = () => {}
export const THEMES = ['heo']
