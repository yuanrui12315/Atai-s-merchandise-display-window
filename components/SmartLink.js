import Link from 'next/link'
import { siteConfig } from '@/lib/config'

// 过滤 <a> 标签不能识别的 props
const filterDOMProps = props => {
  const { passHref, legacyBehavior, ...rest } = props
  return rest
}

const SmartLink = ({ href, children, ...rest }) => {
  const LINK = siteConfig('LINK')

  // 防止 undefined/null href 导致 Next.js Link 报错（formatUrl 无法解析）
  const safeHref = href ?? '/'

  // 获取 URL 字符串用于判断是否是外链
  let urlString = ''

  if (typeof safeHref === 'string') {
    urlString = safeHref
  } else if (
    typeof safeHref === 'object' &&
    safeHref !== null &&
    typeof safeHref.pathname === 'string'
  ) {
    urlString = safeHref.pathname
  }

  /**
   * 必须用原生 <a>，不能用 Next Link：
   * - weixin:// / tencent:// 等 App 协议（Link 会当站内路由 → 404）
   * - mailto: / tel: / sms:
   * - /xxx.png 等 public 静态资源（Link 客户端跳转会当成页面 → 404）
   * - 外链 http(s)
   */
  const lower = urlString.toLowerCase()
  const isStaticAssetPath =
    typeof urlString === 'string' &&
    /\.(png|jpe?g|webp|gif|svg|ico|pdf|bmp|woff2?)(\?|#|$)/i.test(urlString)
  const isAppOrSpecialScheme =
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('sms:') ||
    lower.startsWith('weixin://') ||
    lower.startsWith('tencent://')
  const isExternalHttp =
    urlString.startsWith('http') && !urlString.startsWith(LINK)

  const useNativeAnchor =
    isExternalHttp || isAppOrSpecialScheme || isStaticAssetPath

  if (useNativeAnchor) {
    const externalUrl =
      typeof safeHref === 'string' ? safeHref : new URL(safeHref.pathname, LINK).toString()

    const openInNewTab = isExternalHttp && !isAppOrSpecialScheme && !isStaticAssetPath
    // 外链新开标签；App 协议、邮件、静态资源用当前窗口，避免异常空白页
    return (
      <a
        href={externalUrl}
        {...(openInNewTab
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...filterDOMProps(rest)}>
        {children}
      </a>
    )
  }

  // 内部链接（可为对象形式）
  return (
    <Link href={safeHref} {...rest}>
      {children}
    </Link>
  )
}

export default SmartLink
