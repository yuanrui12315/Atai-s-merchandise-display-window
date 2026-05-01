import { Home } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

const Logo = props => {
  const { siteInfo } = props
  const { locale } = useGlobal()
  const backHomeTitle = locale.NAV.BACK_HOME || '回到首页'
  return (
    <SmartLink
      href='/'
      title={backHomeTitle}
      className='flex min-w-0 max-w-full flex-nowrap items-center cursor-pointer font-extrabold no-underline text-inherit relative'>
        <LazyImage
          src={siteInfo?.icon}
          width={24}
          height={24}
          alt={siteConfig('AUTHOR')}
          className='mr-1.5 h-6 w-6 shrink-0 rounded object-cover lg:mr-4'
        />
        <div id='logo-text' className='group relative z-10 min-w-0 max-w-[9rem] flex-none rounded-2xl lg:max-w-none'>
          <div className='logo group-hover:opacity-0 opacity-100 visible group-hover:invisible text-base lg:text-lg my-auto truncate rounded dark:border-white duration-200'>
            {siteConfig('TITLE')}
          </div>
          <div className='flex justify-center rounded-2xl group-hover:bg-indigo-600 w-full group-hover:opacity-100 opacity-0 invisible group-hover:visible absolute top-0 py-1 duration-200'>
            <Home className={'w-6 h-6 stroke-white stroke-2 '} />
          </div>
        </div>
        <span className='ml-2 lg:ml-3 px-2 lg:px-3 py-1 text-xs lg:text-sm font-medium rounded-lg border border-current border-opacity-40 hover:border-opacity-80 hover:bg-indigo-500 hover:bg-opacity-10 dark:hover:bg-yellow-500 dark:hover:bg-opacity-10 transition-all duration-200 flex-shrink-0'>
          首页
        </span>
    </SmartLink>
  )
}
export default Logo
