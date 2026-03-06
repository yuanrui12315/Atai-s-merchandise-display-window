import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

/**
 * 随机跳转到一个文章
 */
export default function RandomPostButton(props) {
  const { latestPosts } = props
  const router = useRouter()
  const { locale } = useGlobal()
  /**
   * 随机跳转文章 - 使用 href 确保路径正确，空列表时回首页
   */
  function handleClick() {
    if (!latestPosts || latestPosts.length === 0) {
      window.location.href = '/'
      return
    }
    const randomIndex = Math.floor(Math.random() * latestPosts.length)
    const randomPost = latestPosts[randomIndex]
    const targetHref = randomPost?.href || (randomPost?.slug ? `/${randomPost.slug}` : null)
    if (targetHref && targetHref !== '#' && targetHref !== '/undefined') {
      window.location.href = targetHref.startsWith('/') ? targetHref : `/${targetHref}`
    } else {
      window.location.href = '/'
    }
  }

  return (
        <div title={locale.MENU.WALK_AROUND} className='cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200 transition-all' onClick={handleClick}>
            <i className="fa-solid fa-podcast"></i>
        </div>
  )
}
