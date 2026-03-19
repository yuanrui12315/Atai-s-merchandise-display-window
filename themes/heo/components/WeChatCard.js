import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useState } from 'react'

/**
 * 微信联系卡片 - 与电报联系紧贴并排
 * 支持：① 跳转链接 weixin:// ② 二维码图片 ③ 两者同时
 */
export default function WeChatCard() {
  const [modalOpen, setModalOpen] = useState(false)
  const CONTACT_WECHAT = siteConfig('CONTACT_WECHAT')
  const CONTACT_WECHAT_QR = siteConfig('CONTACT_WECHAT_QR')

  const isWechatLink = url =>
    url &&
    (url.startsWith('weixin://') ||
      (url.startsWith('http') && !/\.(png|jpg|jpeg|webp|gif)(\?|$)/i.test(url)))
  const wechatIsLink = CONTACT_WECHAT && isWechatLink(CONTACT_WECHAT)
  const wechatQrImage =
    CONTACT_WECHAT_QR || (CONTACT_WECHAT && !wechatIsLink ? CONTACT_WECHAT : null)

  const showWechat = CONTACT_WECHAT || CONTACT_WECHAT_QR
  if (!showWechat) return null

  // 仅链接且无二维码：直接跳转
  if (wechatIsLink && !wechatQrImage) {
    return (
      <SmartLink href={CONTACT_WECHAT}>
        <div
          className='h-28 flex flex-col justify-center items-center p-4 border rounded-xl bg-[#07C160] hover:bg-[#06AD56] dark:bg-[#07C160] dark:hover:bg-[#06AD56] dark:border-gray-600 text-white font-[1000] text-base transition-colors cursor-pointer overflow-hidden'>
          <i className='fab fa-weixin text-2xl mb-1 flex-shrink-0' />
          <span className='whitespace-nowrap truncate'>微信联系</span>
        </div>
      </SmartLink>
    )
  }

  // 有二维码：点击弹窗
  return (
    <>
      <button
        type='button'
        onClick={() => setModalOpen(true)}
        className='w-full h-28 flex flex-col justify-center items-center p-4 border rounded-xl bg-[#07C160] hover:bg-[#06AD56] dark:bg-[#07C160] dark:hover:bg-[#06AD56] dark:border-gray-600 text-white font-[1000] text-base transition-colors cursor-pointer overflow-hidden'>
        <i className='fab fa-weixin text-2xl mb-1 flex-shrink-0' />
        <span className='whitespace-nowrap truncate'>微信联系</span>
      </button>
      {modalOpen && (
        <div
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50'
          onClick={() => setModalOpen(false)}
          role='presentation'>
          <div
            className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-[90vw]'
            onClick={e => e.stopPropagation()}>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-lg font-semibold dark:text-gray-100'>微信联系</span>
              <button
                type='button'
                onClick={() => setModalOpen(false)}
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
}
