'use client'
import { useGlobal } from '@/lib/global'
import { useEffect, useState, useRef } from 'react'

/**
 * 可爱二次元风格加载动画 - 柔和马卡龙配色 + 萌系角色 + 进度条
 * 参考：pastel 粉紫、银发、大眼、腮红、漂浮粒子
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
          ? 'linear-gradient(160deg, #2d1f3d 0%, #1e1a2e 40%, #1a2438 100%)'
          : 'linear-gradient(160deg, #fff5f8 0%, #f8f0ff 35%, #f0f4ff 70%, #e8f4ff 100%)',
      }}>
      <style global>{`
        @keyframes loading-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes loading-sparkle {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes loading-heart-float {
          0%, 100% { opacity: 0.4; transform: translateY(0) rotate(0deg); }
          50% { opacity: 0.8; transform: translateY(-6px) rotate(5deg); }
        }
      `}</style>

      {/* 背景漂浮粒子 */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='absolute w-2 h-2 rounded-full'
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: isDarkMode ? 'rgba(255,182,193,0.4)' : 'rgba(255,182,193,0.6)',
              animation: `loading-sparkle 2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <div
            key={`h-${i}`}
            className='absolute text-lg opacity-40'
            style={{
              left: `${25 + i * 20}%`,
              top: `${30 + (i % 2) * 40}%`,
              animation: `loading-heart-float 3s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}>
            ♡
          </div>
        ))}
      </div>

      <div className='loading-cover-content flex flex-col items-center gap-5 px-8 relative z-10'>
        {/* 萌系动漫少女 - 柔和马卡龙配色 */}
        <div className='relative animate-[loading-float_2.5s_ease-in-out_infinite]'>
          <svg width='130' height='130' viewBox='0 0 130 130' className='drop-shadow-2xl'>
            {/* 后层头发 - 银灰粉 */}
            <path
              d='M 20 45 Q 35 18 65 12 Q 95 18 110 45 L 112 95 Q 108 115 85 120 L 45 120 Q 22 115 18 95 Z'
              fill={isDarkMode ? '#4a3d5c' : '#e8dce8'}
              stroke={isDarkMode ? '#3d3250' : '#ddd0e0'}
              strokeWidth='1'
            />
            {/* 刘海 */}
            <path
              d='M 28 50 Q 40 28 65 24 Q 90 28 102 50 L 100 72 L 30 72 Z'
              fill={isDarkMode ? '#5c4d6e' : '#f0e4f0'}
              stroke={isDarkMode ? '#4a3d5c' : '#e5d8e8'}
              strokeWidth='1'
            />
            {/* 呆毛 */}
            <path d='M 62 8 Q 58 0 65 2 Q 72 0 68 8 L 65 18' stroke={isDarkMode ? '#6b5b7a' : '#d8c8e0'} strokeWidth='2' fill='none' strokeLinecap='round' />
            {/* 脸 - 柔和肤色 */}
            <ellipse cx='65' cy='75' rx='34' ry='38' fill={isDarkMode ? '#c9b8a8' : '#ffe8e0'} stroke={isDarkMode ? '#b8a898' : '#f5d8d0'} strokeWidth='1.5' />
            {/* 腮红 */}
            <ellipse cx='42' cy='82' rx='8' ry='4' fill='#ffb6c1' opacity='0.7' />
            <ellipse cx='88' cy='82' rx='8' ry='4' fill='#ffb6c1' opacity='0.7' />
            {/* 左眼 - 紫蓝大眼 */}
            <ellipse cx='46' cy='68' rx='12' ry='14' fill={isDarkMode ? '#a8c8e8' : '#c8d8f0'} stroke={isDarkMode ? '#7ba3d0' : '#a8c0e0'} strokeWidth='1' />
            <ellipse cx='48' cy='64' rx='4' ry='5' fill='#fff' opacity='0.95' />
            <ellipse cx='46' cy='70' rx='2.5' ry='3' fill={isDarkMode ? '#4a5a7a' : '#5a6a8a'} />
            {/* 右眼 */}
            <ellipse cx='84' cy='68' rx='12' ry='14' fill={isDarkMode ? '#a8c8e8' : '#c8d8f0'} stroke={isDarkMode ? '#7ba3d0' : '#a8c0e0'} strokeWidth='1' />
            <ellipse cx='86' cy='64' rx='4' ry='5' fill='#fff' opacity='0.95' />
            <ellipse cx='84' cy='70' rx='2.5' ry='3' fill={isDarkMode ? '#4a5a7a' : '#5a6a8a'} />
            {/* 嘴巴 - 可爱小嘴 */}
            <path d='M 58 92 Q 65 98 72 92' stroke={isDarkMode ? '#c09890' : '#e8a8a0'} strokeWidth='1.5' fill='none' strokeLinecap='round' />
            {/* 蝴蝶结头饰 - 粉紫 */}
            <ellipse cx='38' cy='28' rx='10' ry='6' fill='#ffb6c1' />
            <ellipse cx='92' cy='28' rx='10' ry='6' fill='#ffb6c1' />
            <circle cx='65' cy='28' r='4' fill='#e8a0b8' />
            {/* 白色小团子 */}
            <ellipse cx='95' cy='55' rx='12' ry='14' fill='#fff' opacity='0.95' stroke='#f0f0f0' strokeWidth='1' />
            <ellipse cx='93' cy='52' rx='2' ry='2.5' fill='#ddd' />
            <ellipse cx='98' cy='54' rx='2' ry='2.5' fill='#ddd' />
          </svg>
        </div>

        <p className={`text-base font-medium ${isDarkMode ? 'text-pink-300' : 'text-pink-500/90'}`} style={{ fontFamily: 'cursive' }}>
          加载中...
        </p>

        {/* 进度条 - 柔和渐变 */}
        <div className={`w-44 h-2 rounded-full overflow-hidden shadow-inner ${isDarkMode ? 'bg-black/30' : 'bg-white/70'}`}>
          <div
            className='h-full rounded-full transition-all duration-200 ease-out'
            style={{
              width: `${progress}%`,
              background: isDarkMode
                ? 'linear-gradient(90deg, #c8a0d8, #e8b8f0)'
                : 'linear-gradient(90deg, #ffc8e0, #e8b8f0)',
            }}
          />
        </div>
        <p className={`text-xs ${isDarkMode ? 'text-pink-400/90' : 'text-pink-500/70'}`}>{progress}%</p>
      </div>
    </div>
  ) : null
}
