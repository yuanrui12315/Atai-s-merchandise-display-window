import { siteConfig } from '@/lib/config'
import {
  applyWidthCapToImageSrc,
  appendProxyImageQuality
} from '@/lib/utils/homeImageUrl'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

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
  /** 与 compressMaxWidth 同用：手机端 <picture> 请求带 q= 的代理 WebP（略糊、更小） */
  compressMobileProxyQuality
}) {
  const maxWidth = siteConfig('IMAGE_COMPRESS_WIDTH')
  const defaultPlaceholderSrc = siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
  const imageRef = useRef(null)
  const observerTargetRef = useRef(null)
  /** null = 未解析，占位图；{ d, m? } = 桌面用 d，若 m 存在则手机走 <picture> */
  const [resolved, setResolved] = useState(null)

  const placeholder = placeholderSrc || defaultPlaceholderSrc
  const desktopSrc = resolved?.d ?? placeholder
  const mobileSrc = resolved?.m
  const wrapPicture = Boolean(mobileSrc)

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

  /**
   * 占位图加载成功
   */
  const handleThumbnailLoaded = () => {
    if (typeof onLoad === 'function') {
      // onLoad() // 触发传递的onLoad回调函数
    }
  }
  // 原图加载完成
  const handleImageLoaded = () => {
    if (typeof onLoad === 'function') {
      onLoad() // 触发传递的onLoad回调函数
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

  useEffect(() => {
    setResolved(null)

    const { d: adjustedImageSrc, m: mobileCand } = resolveDeskAndMob()

    if (priority) {
      const img = new Image()
      img.src = adjustedImageSrc
      img.onload = () => {
        setResolved({ d: adjustedImageSrc, m: mobileCand })
        handleImageLoaded()
      }
      img.onerror = handleImageError
      return
    }

    if (!window.IntersectionObserver) {
      const img = new Image()
      img.src = adjustedImageSrc
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
            const img = new Image()
            if ('decoding' in img) {
              img.decoding = 'async'
            }
            img.src = adjustedImageSrc
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
    src: desktopSrc,
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

  const preloadHref = (() => {
    const desk =
      (compressMaxWidth != null && compressMaxWidth > 0
        ? applyWidthCapToImageSrc(src, compressMaxWidth)
        : adjustImgSize(src, maxWidth)) || defaultPlaceholderSrc
    return desk
  })()

  return (
    <>
      <div ref={observerTargetRef} className='w-full h-full min-h-0'>
        {wrapPicture ? (
          <picture className='block h-full w-full'>
            <source media='(max-width: 767px)' srcSet={mobileSrc} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img {...imgProps} />
          </picture>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img {...imgProps} />
        )}
      </div>
      {priority && (
        <Head>
          <link rel='preload' as='image' href={preloadHref} />
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
