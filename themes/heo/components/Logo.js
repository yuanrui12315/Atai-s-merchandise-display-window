import { Home } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

/** 顶栏手机：标题最多 4 个字（去掉 &商品展示 等后缀占宽） */
function navBarTitleMobile(full) {
  if (full == null || full === '') return ''
  const s = String(full).trim()
  const g = Array.from(s)
  return g.length > 4 ? g.slice(0, 4).join('') : s
}

const Logo = props => {
  const { siteInfo } = props
  const { locale } = useGlobal()
  const backHomeTitle = locale.NAV.BACK_HOME || '回到首页'
  return (
    <SmartLink
      href='/'
      title={backHomeTitle}
      className='flex h-full w-full min-w-0 max-w-full cursor-pointer flex-nowrap items-center gap-1 font-extrabold no-underline text-inherit sm:gap-1.5 lg:w-auto lg:gap-2.5'>
        {/* 站点名固定在最左；勿用 flex-1+min-w-0 撑中间格，窄屏会被压成 0 宽整段消失 */}
        <div
          id='logo-text'
          className='group relative z-0 order-1 max-w-[7rem] shrink-0 overflow-hidden sm:max-w-[7.5rem] lg:order-2 lg:z-10 lg:max-w-none'>
          <div className='logo truncate text-base font-bold leading-tight tracking-tight opacity-100 duration-200 group-hover:invisible group-hover:opacity-0 dark:border-white lg:hidden sm:text-lg'>
            {navBarTitleMobile(siteConfig('TITLE'))}
          </div>
          <div className='logo hidden truncate text-lg font-bold leading-tight tracking-tight opacity-100 duration-200 group-hover:invisible group-hover:opacity-0 dark:border-white lg:block lg:text-xl'>
            {siteConfig('TITLE')}
          </div>
          <div className='invisible absolute top-0 left-0 right-0 flex justify-center rounded-2xl py-1 opacity-0 duration-200 group-hover:visible group-hover:bg-indigo-600 group-hover:opacity-100'>
            <Home className='h-6 w-6 stroke-2 stroke-white' />
          </div>
        </div>
        {/* LazyImage 根节点是 div，order 必须包在外层，否则会成 order:0 整段跑到标题前 */}
        <div className='order-2 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded lg:order-1 lg:mr-4 lg:h-8 lg:w-8'>
          <LazyImage
            src={siteInfo?.icon}
            width={24}
            height={24}
            alt={siteConfig('AUTHOR')}
            className='h-7 w-7 rounded object-cover lg:h-8 lg:w-8'
          />
        </div>
        <span className='order-3 inline-flex shrink-0 rounded-lg border-2 border-current border-opacity-45 px-2 py-1 text-xs font-semibold transition-all duration-200 hover:border-opacity-85 hover:bg-indigo-500 hover:bg-opacity-10 sm:text-sm lg:ml-1 lg:px-3.5 lg:py-1.5 lg:text-base dark:hover:bg-yellow-500 dark:hover:bg-opacity-10'>
          首页
        </span>
    </SmartLink>
  )
}
export default Logo
