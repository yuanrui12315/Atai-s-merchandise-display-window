'use client'
import { useGlobal } from '@/lib/global'
import { useEffect, useState, useRef } from 'react'

/**
 * 卡哇伊二次元风格加载动画 - 带人物 + 进度条
 */
export default function LoadingCover() {
  const { onLoading, setOnLoading, isDarkMode } = useGlobal()
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isEntering, setIsEntering] = useState(true)
  const progressTimer = useRef(null)

  useEffect(() => {
    if (onLoading) {
      setIsVisible(true)
      setIsLeaving(false)
      setIsEntering(true)
      setProgress(0)
      const t = setTimeout(() => setIsEntering(false), 50)
      let p = 0
      progressTimer.current = setInterval(() => {
        p += Math.random() * 12 + 4
        if (p >= 95) p = 95
        setProgress(Math.floor(p))
      }, 150)
      return () => {
        clearTimeout(t)
        if (progressTimer.current) {
          clearInterval(progressTimer.current)
          progressTimer.current = null
        }
      }
    } else {
      setProgress(100)
      if (progressTimer.current) {
        clearInterval(progressTimer.current)
        progressTimer.current = null
      }
      setIsLeaving(true)
      const t = setTimeout(() => setIsVisible(false), 450)
      return () => clearTimeout(t)
    }
  }, [onLoading])

  const handleClick = () => {
    setOnLoading(false)
  }

  if (typeof window === 'undefined') return null

  return isVisible ? (
    <div
      id='loading-cover'
      onClick={handleClick}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
        isEntering ? 'opacity-0' : ''
      } ${
        isLeaving ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)'
          : 'linear-gradient(135deg, #ffeef8 0%, #e8d5f2 50%, #d4e4f7 100%)',
      }}>
      <style global>{`
        @keyframes kawaii-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes kawaii-blink {
          0%, 45%, 55%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
      <div className='loading-cover-content flex flex-col items-center gap-6 px-8'>
        {/* 可爱角色 - SVG 二次元风格 */}
        <div className='relative animate-[kawaii-bounce_1.2s_ease-in-out_infinite]'>
          <svg width='120' height='120' viewBox='0 0 120 120' className='drop-shadow-lg'>
            {/* 脸 */}
            <ellipse cx='60' cy='65' rx='45' ry='48' fill='#ffecd2' stroke='#e8c4a0' strokeWidth='2' />
            {/* 腮红 */}
            <ellipse cx='35' cy='70' rx='12' ry='8' fill='#ffb7c5' opacity='0.7' />
            <ellipse cx='85' cy='70' rx='12' ry='8' fill='#ffb7c5' opacity='0.7' />
            {/* 眼睛 - 闭眼笑 */}
            <path d='M 38 58 Q 45 65 52 58' stroke='#333' strokeWidth='3' fill='none' strokeLinecap='round' />
            <path d='M 68 58 Q 75 65 82 58' stroke='#333' strokeWidth='3' fill='none' strokeLinecap='round' />
            {/* 嘴巴 */}
            <path d='M 50 78 Q 60 88 70 78' stroke='#e67a7a' strokeWidth='2' fill='none' strokeLinecap='round' />
            {/* 蝴蝶结 */}
            <ellipse cx='60' cy='25' rx='18' ry='12' fill='#ff9ecd' stroke='#ff69b4' strokeWidth='1.5' />
            <circle cx='60' cy='25' r='5' fill='#ff69b4' />
            {/* 星星装饰 */}
            <g className='animate-[sparkle_1.5s_ease-in-out_infinite]' style={{ animationDelay: '0s' }}>
              <path d='M 15 45 L 17 50 L 22 50 L 18 53 L 19 58 L 15 55 L 11 58 L 12 53 L 8 50 L 13 50 Z' fill='#ffd700' opacity='0.9' />
            </g>
            <g className='animate-[sparkle_1.5s_ease-in-out_infinite]' style={{ animationDelay: '0.5s' }}>
              <path d='M 105 45 L 107 50 L 112 50 L 108 53 L 109 58 L 105 55 L 101 58 L 102 53 L 98 50 L 103 50 Z' fill='#ffd700' opacity='0.9' />
            </g>
          </svg>
        </div>

        {/* 加载文字 */}
        <p className={`text-lg font-medium ${isDarkMode ? 'text-pink-300' : 'text-pink-600/90'}`} style={{ fontFamily: 'cursive' }}>
          加载中...
        </p>

        {/* 进度条 */}
        <div className={`w-48 h-2.5 rounded-full overflow-hidden shadow-inner ${isDarkMode ? 'bg-black/40' : 'bg-white/60'}`}>
          <div
            className='h-full rounded-full transition-all duration-200 ease-out'
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #ff9ecd, #ff69b4)',
            }}
          />
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-pink-400' : 'text-pink-500/80'}`}>{progress}%</p>
      </div>
    </div>
  ) : null
}
