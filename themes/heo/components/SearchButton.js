import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useRef } from 'react'

const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })

/**
 * 搜索按钮
 * @returns
 */
export default function SearchButton(props) {
  const { locale } = useGlobal()
  const router = useRouter()
  const searchModal = useRef(null)

  function handleSearch() {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      router.push('/search')
    }
  }

  return <>
        <div onClick={handleSearch} title={locale.NAV.SEARCH} alt={locale.NAV.SEARCH} className='cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-12 h-12 lg:w-10 lg:h-10 flex justify-center items-center duration-200 transition-all'>
            <i title={locale.NAV.SEARCH} className="fa-solid fa-magnifying-glass text-xl lg:text-base" />
        </div>
        <AlgoliaSearchModal cRef={searchModal} {...props}/>
    </>
}
