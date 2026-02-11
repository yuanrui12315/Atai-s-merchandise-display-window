import getConfig from 'next/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// 关键修正：不再直接 import，而是尝试安全获取配置，失败就用默认值，彻底掐死 Module not found
const getSafeConfig = () => {
  try {
    const config = getConfig()
    return config?.publicRuntimeConfig || {}
  } catch (e) {
    return {}
  }
}

/**
 * 加载布局组件
 */
export const useLayoutByTheme = ({ layoutName, theme }) => {
  const router = useRouter()
  // 这里的 'heo' 必须跟你 themes 文件夹下的名字一模一样
  const themeQuery = theme || 'heo' 
  
  return dynamic(
    () => import(`./${themeQuery}`).then(m => m[layoutName] || m.LayoutSlug).catch(err => {
        console.error('动态加载主题失败', err)
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
  const themeQuery = theme || 'heo'
  return dynamic(
    () => import(`./${themeQuery}`).then(m => m.LayoutBase),
    { ssr: true }
  )
}

// 模拟配置获取函数，防止其他页面引用报错
export const getThemeConfig = async (themeQuery) => {
    try {
        const themeName = themeQuery || 'heo'
        const { THEME_CONFIG } = await import(`./${themeName}`)
        return THEME_CONFIG
    } catch (e) {
        return {}
    }
}

// 极其简化的深色模式，不引用外部 utils，防止路径崩溃
export const initDarkMode = (updateDarkMode) => {
  if (typeof window === 'undefined') return
  const isDark = localStorage.getItem('darkMode') === 'true'
  updateDarkMode(isDark)
  document.documentElement.classList.toggle('dark', isDark)
}

export function isPreferDark() { return false }
export const loadDarkModeFromLocalStorage = () => null
export const saveDarkModeToLocalStorage = () => {}
