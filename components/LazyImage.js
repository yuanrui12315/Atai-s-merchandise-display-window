import { siteConfig } from '@/lib/config'
import {
  applyWidthCapToImageSrc,
  appendProxyImageQuality
} from '@/lib/utils/homeImageUrl'
import Head from 'next/head'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

function subscribeNarrow767(callback) {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(max-width: 767px)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getNarrow767() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 767px)').matches
}

/**
 * 图片懒加载
 * @param {*} param0
 * @returns
 */
export default function LazyImage({
  priority,
  id,
  src,
  alt,
  placeholderSrc,
  className,
  width,
  height,
  title,
  onLoad,
  onClick,
  style,
  /** 仅首页/列表卡等传入：限制请求宽度以加速；详情页勿传 */
  compressMaxWidth,
  /** 与 compressMaxWidth 同用：窄屏直接请求带 q= 的代理 WebP */
  compressMobileProxyQuality
}) {
  const maxWidth = siteConfig('IMAGE_COMPRESS_WIDTH')
  const defaultPlaceholderSrc = siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  const imageRef = useRef(null)
  const observerTargetRef = useRef(null)
  /** null = 未解析，占位图；{ d,
   * m? } = 桌面用 d，m 为带 q 的代理（仅当需要手机降质时存在） */
  const [resolved, setResolved] = useState(null)

  const narrowViewport = useSyncExternalStore(
    subscribeNarrow767,
    getNarrow767,
    () => false
  )

  const placeholder = placeholderSrc || defaultPlaceholderSrc
  const desktopSrc = resolved?.d ?? placeholder
  const mobileSrc = resolved?.m
  const chosenSrc =
    mobileSrc && narrowViewport ? mobileSrc : desktopSrc

  function resolveDeskAndMob() {
    const desk =
      (compressMaxWidth != null && compressMaxWidth > 0
        ? applyWidthCapToImageSrc(src, compressMaxWidth)
        : adjustImgSize(src, maxWidth)) || defaultPlaceholderSrc
    const mq = Number(compressMobileProxyQuality)
    if (
      compressMaxWidth != null &&
      compressMaxWidth > 0 &&
      Number.isFinite(mq) &&
      mq > 0
    ) {
      const mob = appendProxyImageQuality(desk, mq)
      if (mob !== desk) {
        return { d: desk, m: mob }
      }
    }
    return { d: desk, m: undefined }
  }

  const handleThumbnailLoaded = () => {
    if (typeof onLoad === 'function') {
      // onLoad()
    }
  }

  const handleImageLoaded = () => {
    if (typeof onLoad === 'function') {
      onLoad()
    }
    if (imageRef.current) {
      imageRef.current.classList.remove('lazy-image-placeholder')
    }
  }

  const handleImageError = () => {
    if (imageRef.current) {
      if (imageRef.current.src !== placeholderSrc && placeholderSrc) {
        imageRef.current.src = placeholderSrc
      } else {
        imageRef.current.src = defaultPlaceholderSrc
      }
      if (imageRef.current) {
        imageRef.current.classList.remove('lazy-image-placeholder')
      }
    }
  }

  function pickLoadUrl(adjustedDesk, mobileCand) {
    if (
      mobileCand &&
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 767px)').matches
    ) {
      return mobileCand
    }
    return adjustedDesk
  }

  useEffect(() => {
    setResolved(null)

    const { d: adjustedImageSrc, m: mobileCand } = resolveDeskAndMob()

    if (priority) {
      const loadUrl = pickLoadUrl(adjustedImageSrc, mobileCand)
      const img = new Image()
      img.src = loadUrl
      img.onload = () => {
        setResolved({ d: adjustedImageSrc, m: mobileCand })
        handleImageLoaded()
      }
      img.onerror = handleImageError
      return
    }

    if (!window.IntersectionObserver) {
      const loadUrl = pickLoadUrl(adjustedImageSrc, mobileCand)
      const img = new Image()
      img.src = loadUrl
      img.onload = () => {
        setResolved({ d: adjustedImageSrc, m: mobileCand })
        handleImageLoaded()
      }
      img.onerror = handleImageError
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const loadUrl = pickLoadUrl(adjustedImageSrc, mobileCand)
            const img = new Image()
            if ('decoding' in img) {
              img.decoding = 'async'
            }
            img.src = loadUrl
            img.onload = () => {
              setResolved({ d: adjustedImageSrc, m: mobileCand })
              handleImageLoaded()
            }
            img.onerror = handleImageError
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: siteConfig('LAZY_LOAD_THRESHOLD', '200px'),
        threshold: 0.1
      }
    )

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current)
    }

    return () => {
      const t = observerTargetRef.current
      if (t) {
        observer.unobserve(t)
      }
    }
  }, [
    src,
    maxWidth,
    priority,
    compressMaxWidth,
    compressMobileProxyQuality,
    defaultPlaceholderSrc
  ])

  const imgProps = {
    ref: imageRef,
    src: chosenSrc,
    'data-src': src,
    alt: alt || 'Lazy loaded image',
    onLoad: handleThumbnailLoaded,
    onError: handleImageError,
    className: `${className || ''} lazy-image-placeholder`,
    style,
    width: width || 'auto',
    height: height || 'auto',
    onClick,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    ...(siteConfig('WEBP_SUPPORT') && { 'data-webp': true }),
    ...(siteConfig('AVIF_SUPPORT') && { 'data-avif': true })
  }

  if (id) imgProps.id = id
  if (title) imgProps.title = title

  if (!src) {
    return null
  }

  const deskPreload =
    (compressMaxWidth != null && compressMaxWidth > 0
      ? applyWidthCapToImageSrc(src, compressMaxWidth)
      : adjustImgSize(src, maxWidth)) || defaultPlaceholderSrc
  const preloadMq = Number(compressMobileProxyQuality)
  const mobPreload =
    compressMaxWidth != null &&
    compressMaxWidth > 0 &&
    Number.isFinite(preloadMq) &&
    preloadMq > 0 &&
    deskPreload.includes('/api/proxy-image')
      ? appendProxyImageQuality(deskPreload, preloadMq)
      : null

  return (
    <>
      <div ref={observerTargetRef} className='w-full h-full min-h-0'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...imgProps} />
      </div>
      {priority && (
        <Head>
          {mobPreload ? (
            <>
              <link
                rel='preload'
                as='image'
                href={deskPreload}
                media='(min-width: 768px)'
              />
              <link
                rel='preload'
                as='image'
                href={mobPreload}
                media='(max-width: 767px)'
              />
            </>
          ) : (
            <link rel='preload' as='image' href={deskPreload} />
          )}
        </Head>
      )}
    </>
  )
}

const adjustImgSize = (src, maxWidth) => {
  if (!src) {
    return null
  }
  const screenWidth =
    (typeof window !== 'undefined' && window?.screen?.width) || maxWidth

  if (screenWidth > maxWidth) {
    return src
  }

  const widthRegex = /width=\d+/
  const wRegex = /w=\d+/

  return src
    .replace(widthRegex, `width=${screenWidth}`)
    .replace(wRegex, `w=${screenWidth}`)
}
