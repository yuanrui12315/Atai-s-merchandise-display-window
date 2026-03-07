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
        @keyframes anime-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes anime-eye-shine {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes hair-sway {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
      `}</style>
      <div className='loading-cover-content flex flex-col items-center gap-6 px-8'>
        {/* 动漫少女 - 大眼二次元风格 */}
        <div className='relative animate-[anime-float_2s_ease-in-out_infinite]'>
          <svg width='140' height='140' viewBox='0 0 140 140' className='drop-shadow-xl'>
            {/* 后层头发 */}
            <path d='M 15 50 Q 25 25 70 18 Q 115 25 125 50 L 128 100 Q 125 120 100 125 L 40 125 Q 15 120 12 100 Z' fill='#3d2e22' />
            {/* 刘海 */}
            <path d='M 25 55 Q 35 35 70 30 Q 105 35 115 55 L 112 75 L 28 75 Z' fill='#5c4033' stroke='#4a3728' strokeWidth='1' />
            {/* 脸 */}
            <ellipse cx='70' cy='78' rx='36' ry='40' fill='#ffe4c9' stroke='#e8c4a0' strokeWidth='2' />
            {/* 腮红 */}
            <ellipse cx='44' cy='85' rx='9' ry='5' fill='#ff9eb5' opacity='0.75' />
            <ellipse cx='96' cy='85' rx='9' ry='5' fill='#ff9eb5' opacity='0.75' />
            {/* 动漫大眼 - 左 */}
            <ellipse cx='48' cy='70' rx='13' ry='16' fill='#7dd3fc' stroke='#0ea5e9' strokeWidth='1.5' />
            <ellipse cx='51' cy='64' rx='4' ry='6' fill='#fff' className='animate-[anime-eye-shine_2s_ease-in-out_infinite]' />
            <ellipse cx='48' cy='72' rx='3' ry='4' fill='#1e3a5f' />
            {/* 动漫大眼 - 右 */}
            <ellipse cx='92' cy='70' rx='13' ry='16' fill='#7dd3fc' stroke='#0ea5e9' strokeWidth='1.5' />
            <ellipse cx='95' cy='64' rx='4' ry='6' fill='#fff' className='animate-[anime-eye-shine_2s_ease-in-out_infinite]' style={{ animationDelay: '0.15s' }} />
            <ellipse cx='92' cy='72' rx='3' ry='4' fill='#1e3a5f' />
            {/* 嘴巴 */}
            <path d='M 62 95 Q 70 102 78 95' stroke='#e67a7a' strokeWidth='2' fill='none' strokeLinecap='round' />
            {/* 蝴蝶结头饰 */}
            <ellipse cx='42' cy='32' rx='11' ry='7' fill='#ff69b4' />
            <ellipse cx='98' cy='32' rx='11' ry='7' fill='#ff69b4' />
            <circle cx='70' cy='32' r='5' fill='#ff1493' />
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
