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
      className='flex h-full w-full min-w-0 max-w-full cursor-pointer flex-nowrap items-center font-extrabold no-underline text-inherit lg:w-auto'>
        <LazyImage
          src={siteInfo?.icon}
          width={24}
          height={24}
          alt={siteConfig('AUTHOR')}
          className='mr-1.5 h-6 w-6 shrink-0 rounded object-cover lg:mr-4'
        />
        <div
          id='logo-text'
          className='group relative z-0 min-w-0 flex-1 lg:z-10 lg:flex-none lg:max-w-none'>
          <div className='logo visible opacity-100 duration-200 group-hover:invisible group-hover:opacity-0 my-auto truncate rounded text-sm sm:text-base lg:text-lg dark:border-white'>
            {siteConfig('TITLE')}
          </div>
          <div className='invisible absolute top-0 flex w-full justify-center rounded-2xl py-1 opacity-0 duration-200 group-hover:visible group-hover:bg-indigo-600 group-hover:opacity-100'>
            <Home className={'h-6 w-6 stroke-2 stroke-white'} />
          </div>
        </div>
        <span className='ml-1 inline-flex shrink-0 rounded-lg border border-current border-opacity-40 px-1.5 py-0.5 text-[10px] font-medium transition-all duration-200 hover:border-opacity-80 hover:bg-indigo-500 hover:bg-opacity-10 sm:ml-2 sm:px-2 sm:text-xs lg:ml-3 lg:px-3 lg:text-sm dark:hover:bg-yellow-500 dark:hover:bg-opacity-10'>
          首页
        </span>
    </SmartLink>
  )
}
export default Logo
