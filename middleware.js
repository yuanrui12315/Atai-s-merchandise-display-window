/**
 * 网站访问密码保护
 * 在 Vercel 环境变量中设置 SITE_PASSWORD 后生效
 * 未设置则不启用密码保护
 */
import { NextResponse } from 'next/server'

async function getAccessToken(password) {
  if (!password) return ''
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'site_access_salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // 未设置密码则不启用保护
  const sitePassword = process.env.SITE_PASSWORD
  if (!sitePassword) {
    return NextResponse.next()
  }

  // 放行：密码页、验证 API、Next 静态资源、favicon
  if (
    pathname === '/password' ||
    pathname === '/api/verify-password' ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    (pathname.startsWith('/api/') && pathname !== '/api/verify-password')
  ) {
    return NextResponse.next()
  }

  // 静态资源放行（图片、字体等）
  if (
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2)$/i.test(pathname)
  ) {
    return NextResponse.next()
  }

  const cookieToken = request.cookies.get('site_access')?.value
  const correctToken = await getAccessToken(sitePassword)

  if (cookieToken && cookieToken === correctToken) {
    return NextResponse.next()
  }

  // 未验证，重定向到密码页
  const url = request.nextUrl.clone()
  url.pathname = '/password'
  if (pathname !== '/') {
    url.searchParams.set('from', pathname)
  }
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，排除：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
