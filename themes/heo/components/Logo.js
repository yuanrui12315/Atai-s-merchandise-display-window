import { Home } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'

const Logo = props => {
  const { siteInfo } = props
  const { locale } = useGlobal()
  const backHomeTitle = locale.NAV.BACK_HOME || '回到首页'
  return (
    <a href='/' title={backHomeTitle} className='flex flex-nowrap items-center cursor-pointer font-extrabold no-underline text-inherit'>
        <LazyImage
          src={siteInfo?.icon}
          width={24}
          height={24}
          alt={siteConfig('AUTHOR')}
          className='mr-4 hidden md:block'
        />
        <div id='logo-text' className='group rounded-2xl flex-none relative'>
          <div className='logo group-hover:opacity-0 opacity-100 visible group-hover:invisible text-lg my-auto rounded dark:border-white duration-200'>
            {siteConfig('TITLE')}
          </div>
          <div className='flex justify-center rounded-2xl group-hover:bg-indigo-600 w-full group-hover:opacity-100 opacity-0 invisible group-hover:visible absolute top-0 py-1 duration-200'>
            <Home className={'w-6 h-6 stroke-white stroke-2 '} />
          </div>
        </div>
        <span className='ml-3 px-3 py-1 text-sm font-medium rounded-lg border border-current border-opacity-40 hover:border-opacity-80 hover:bg-indigo-500 hover:bg-opacity-10 dark:hover:bg-yellow-500 dark:hover:bg-opacity-10 transition-all duration-200'>
          首页
        </span>
    </a>
  )
}
export default Logo
