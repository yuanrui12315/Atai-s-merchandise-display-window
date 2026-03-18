import { siteConfig } from '@/lib/config'
import { useRef, useState } from 'react'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  const [wechatModalOpen, setWechatModalOpen] = useState(false)
  const CONTACT_GITHUB = siteConfig('CONTACT_GITHUB')
  const CONTACT_TWITTER = siteConfig('CONTACT_TWITTER')
  const CONTACT_TELEGRAM = siteConfig('CONTACT_TELEGRAM')
  const CONTACT_WHATSAPP = siteConfig('CONTACT_WHATSAPP')
  const CONTACT_WECHAT = siteConfig('CONTACT_WECHAT')
  const CONTACT_WECHAT_QR = siteConfig('CONTACT_WECHAT_QR')

  // 判断是否为跳转链接（手机端点击直接打开微信）而非图片
  const isWechatLink = url =>
    url.startsWith('weixin://') ||
    (url.startsWith('http') && !/\.(png|jpg|jpeg|webp|gif)(\?|$)/i.test(url))
  const wechatIsLink = CONTACT_WECHAT && isWechatLink(CONTACT_WECHAT)
  const wechatQrImage = CONTACT_WECHAT_QR || (CONTACT_WECHAT && !wechatIsLink ? CONTACT_WECHAT : null)
  const CONTACT_QQ = siteConfig('CONTACT_QQ')
  const CONTACT_LINKEDIN = siteConfig('CONTACT_LINKEDIN')
  const CONTACT_WEIBO = siteConfig('CONTACT_WEIBO')
  const CONTACT_INSTAGRAM = siteConfig('CONTACT_INSTAGRAM')
  const CONTACT_EMAIL = siteConfig('CONTACT_EMAIL')
  const ENABLE_RSS = siteConfig('ENABLE_RSS')
  const CONTACT_BILIBILI = siteConfig('CONTACT_BILIBILI')
  const CONTACT_YOUTUBE = siteConfig('CONTACT_YOUTUBE')

  const emailIcon = useRef(null)

  return (
    <div className='w-full justify-center flex-wrap flex'>
      <div className='space-x-12 text-3xl text-gray-600 dark:text-gray-300 '>
        {CONTACT_GITHUB && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'github'}
            href={CONTACT_GITHUB}>
            <i className='transform hover:scale-125 duration-150 fab fa-github dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_TWITTER && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'X'}
            href={CONTACT_TWITTER}>
            <i className='transform hover:scale-125 duration-150 fa-brands fa-x-twitter dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_TELEGRAM && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_TELEGRAM}
            title={'telegram'}>
            <i className='transform hover:scale-125 duration-150 fab fa-telegram text-[#0088cc] hover:text-[#006699] dark:text-[#0088cc] dark:hover:text-[#33aadd]' />
          </a>
        )}
        {CONTACT_WHATSAPP && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_WHATSAPP}
            title={'WhatsApp'}>
            <i className='transform hover:scale-125 duration-150 fab fa-whatsapp dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_WECHAT && (
          wechatIsLink && !wechatQrImage ? (
            <a
              target='_blank'
              rel='noreferrer'
              href={CONTACT_WECHAT}
              title={'微信'}>
              <i className='transform hover:scale-125 duration-150 fab fa-weixin text-[#07C160] hover:text-[#06AD56] dark:text-[#07C160] dark:hover:text-[#2CD96A]' />
            </a>
          ) : (
            <>
              <button
                type='button'
                onClick={() => setWechatModalOpen(true)}
                title={'微信'}
                className='bg-transparent border-none cursor-pointer p-0'>
                <i className='transform hover:scale-125 duration-150 fab fa-weixin text-[#07C160] hover:text-[#06AD56] dark:text-[#07C160] dark:hover:text-[#2CD96A]' />
              </button>
              {wechatModalOpen && (
                <div
                  className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50'
                  onClick={() => setWechatModalOpen(false)}
                  role='presentation'>
                  <div
                    className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-[90vw]'
                    onClick={e => e.stopPropagation()}>
                    <div className='flex justify-between items-center mb-4'>
                      <span className='text-lg font-semibold dark:text-gray-100'>微信联系</span>
                      <button
                        type='button'
                        onClick={() => setWechatModalOpen(false)}
                        className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none'>
                        ×
                      </button>
                    </div>
                    {wechatIsLink && (
                      <a
                        href={CONTACT_WECHAT}
                        target='_blank'
                        rel='noreferrer'
                        className='mb-4 block w-full py-3 px-4 rounded-lg bg-[#07C160] hover:bg-[#06AD56] text-white text-center font-medium'>
                        点击打开微信（手机端直接跳转）
                      </a>
                    )}
                    {wechatQrImage && (
                      <>
                        <div className='w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg'>
                          <img
                            src={wechatQrImage}
                            alt='微信二维码'
                            className='w-full h-full object-contain'
                            onError={e => {
                              e.target.style.display = 'none'
                              const parent = e.target.parentElement
                              if (parent && !parent.querySelector('.wechat-error-msg')) {
                                const msg = document.createElement('p')
                                msg.className = 'wechat-error-msg text-sm text-red-500 p-4 text-center'
                                msg.textContent = '图片加载失败，请检查链接是否有效'
                                parent.appendChild(msg)
                              }
                            }}
                          />
                        </div>
                        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>或扫码添加好友</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )
        )}
        {CONTACT_QQ && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_QQ}
            title={'QQ'}>
            <i className='transform hover:scale-125 duration-150 fab fa-qq dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
        {CONTACT_EMAIL && (
          <a
            onClick={e => handleEmailClick(e, emailIcon, CONTACT_EMAIL)}
            title='邮件'
            className='cursor-pointer'
            ref={emailIcon}>
            <i className='transform hover:scale-125 duration-150 fas fa-envelope text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400' />
          </a>
        )}
        {CONTACT_LINKEDIN && (
          <a
            target='_blank'
            rel='noreferrer'
            href={CONTACT_LINKEDIN}
            title={'linkIn'}>
            <i className='transform hover:scale-125 duration-150 fab fa-linkedin dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
       
        {CONTACT_INSTAGRAM && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'instagram'}
            href={CONTACT_INSTAGRAM}>
            <i className='transform hover:scale-125 duration-150 fab fa-instagram dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
    
        {ENABLE_RSS && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'RSS'}
            href={'/rss/feed.xml'}>
            <i className='transform hover:scale-125 duration-150 fas fa-rss dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
   
        {CONTACT_YOUTUBE && (
          <a
            target='_blank'
            rel='noreferrer'
            title={'youtube'}
            href={CONTACT_YOUTUBE}>
            <i className='transform hover:scale-125 duration-150 fab fa-youtube dark:hover:text-indigo-400 hover:text-indigo-600' />
          </a>
        )}
      </div>
    </div>
  )
}
export default SocialButton
