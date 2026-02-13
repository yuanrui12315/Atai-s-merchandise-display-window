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

  const isExternal = urlString.startsWith('http') && !urlString.startsWith(LINK)

  if (isExternal) {
    // 对于外部链接，必须是 string 类型
    const externalUrl =
      typeof safeHref === 'string' ? safeHref : new URL(safeHref.pathname, LINK).toString()

    return (
      <a
        href={externalUrl}
        target='_blank'
        rel='noopener noreferrer'
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
