import { siteConfig } from '@/lib/config'
import { useEffect } from 'react'

const canCopyVal = () => {
  const v = siteConfig('CAN_COPY')
  if (v === false) return false
  if (v === true) return true
  try {
    return JSON.parse(String(v ?? 'true'))
  } catch {
    return true
  }
}

/**
 * 高级防复制：禁止选择、复制、剪切、拖拽、快捷键
 * PC + 手机端，主流浏览器均生效
 */
export default function DisableCopy() {
  useEffect(() => {
    if (canCopyVal()) return

    const html = document.documentElement
    html.classList.add('forbid-copy')

    const prevent = e => {
      e.preventDefault()
      e.stopPropagation()
    }

    const preventCopy = e => {
      prevent(e)
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('抱歉，本网页内容不可复制！')
      }
    }

    // 复制
    const onCopy = preventCopy
    // 剪切
    const onCut = preventCopy
    // 禁止选择开始（IE/旧 Edge）
    const onSelectStart = prevent
    // 禁止拖拽选中内容
    const onDragStart = prevent
    // 快捷键：Ctrl+C / Ctrl+X / Cmd+C / Cmd+X（排除输入框）
    const onKeyDown = e => {
      const tag = e.target?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea') return
      if ((e.ctrlKey || e.metaKey) && ['c', 'x'].includes(e.key.toLowerCase())) {
        prevent(e)
        window.alert?.('抱歉，本网页内容不可复制！')
      }
    }

    document.addEventListener('copy', onCopy, true)
    document.addEventListener('cut', onCut, true)
    document.addEventListener('selectstart', onSelectStart, true)
    document.addEventListener('dragstart', onDragStart, true)
    document.addEventListener('keydown', onKeyDown, true)

    return () => {
      html.classList.remove('forbid-copy')
      document.removeEventListener('copy', onCopy, true)
      document.removeEventListener('cut', onCut, true)
      document.removeEventListener('selectstart', onSelectStart, true)
      document.removeEventListener('dragstart', onDragStart, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [])

  return null
}
