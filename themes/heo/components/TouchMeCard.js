import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 交流频道
 * @returns
 */
export default function TouchMeCard() {
  if (!JSON.parse(siteConfig('HEO_SOCIAL_CARD', null, CONFIG))) {
    return <></>
  }
  return (
    <div className='relative h-28 text-white flex flex-col overflow-hidden rounded-xl'>
      <FlipCard
        className='cursor-pointer lg:p-6 p-4 border rounded-xl bg-[#4f65f0] dark:bg-yellow-600 dark:border-gray-600'
        frontContent={
          <div className='h-full flex flex-col justify-center items-center overflow-hidden relative'>
            <i className='fab fa-telegram text-2xl mb-1 flex-shrink-0' />
            <span className='font-[1000] text-base whitespace-nowrap'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG)}
            </span>
            <div
              className='absolute left-0 top-0 w-full h-full pointer-events-none opacity-30'
              style={{
                background:
                  'url(https://bu.dusays.com/2023/05/16/64633c4cd36a9.png) center center no-repeat'
              }}></div>
          </div>
        }
        backContent={
          <SmartLink href={siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG)}>
            <div className='h-full flex flex-col justify-center items-center'>
              <i className='fab fa-telegram text-2xl mb-1 flex-shrink-0' />
              <span className='font-[1000] text-base whitespace-nowrap'>
                {siteConfig('HEO_SOCIAL_CARD_TITLE_3', null, CONFIG)}
              </span>
            </div>
          </SmartLink>
        }
      />
    </div>
  )
}
