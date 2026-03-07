'use client'

import { useEffect, useState } from 'react'

/**
 * 真实访问量展示（24h 内同一访客只计 1 次）
 * 需配置 Upstash Redis 环境变量
 */
export default function PageViewCount({ pageId, className = '' }) {
  const [count, setCount] = useState(null)

  useEffect(() => {
    if (!pageId) return

    const base = typeof window !== 'undefined' ? window.location.origin : ''
    const api = `${base}/api/page-view?pageId=${encodeURIComponent(pageId)}`

    const run = async () => {
      try {
        const res = await fetch(api, { method: 'POST', credentials: 'include' })
        const data = await res.json()
        if (data.ok === true && typeof data.count === 'number') {
          setCount(data.count)
        }
      } catch {
        setCount(null)
      }
    }

    run()
  }, [pageId])

  if (count === null) return null

  return (
    <span className={`font-light mr-2 ${className}`}>
      <i className='fa-solid fa-fire-flame-curved' /> {count}
    </span>
  )
}
