import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

/**
 * 随机跳转到一个文章
 * 优先使用 allNavPages（全部已发布商品）扩大随机池，减少重复；无则回退到 latestPosts
 */
export default function RandomPostButton(props) {
  const { allNavPages, latestPosts } = props
  const pool = (allNavPages && allNavPages.length > 0) ? allNavPages : latestPosts
  const router = useRouter()
  const { locale } = useGlobal()
  /**
   * 随机跳转文章 - 使用 href 确保路径正确，空列表时回首页
   */
  function handleClick() {
    if (!pool || pool.length === 0) {
      window.location.href = '/'
      return
    }
    const randomIndex = Math.floor(Math.random() * pool.length)
    const randomPost = pool[randomIndex]
    const targetHref = randomPost?.href || (randomPost?.slug ? `/${randomPost.slug}` : null)
    if (targetHref && targetHref !== '#' && targetHref !== '/undefined') {
      window.location.href = targetHref.startsWith('/') ? targetHref : `/${targetHref}`
    } else {
      window.location.href = '/'
    }
  }

  return (
        <div title={locale.MENU.WALK_AROUND} className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full duration-200 hover:bg-black hover:bg-opacity-10 lg:h-10 lg:w-10' onClick={handleClick}>
            <i className="fa-solid fa-podcast text-base lg:text-lg"></i>
        </div>
  )
}
