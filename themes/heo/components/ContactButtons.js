import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'

/**
 * 紧贴「加我电报」下方的其他联系方式按钮
 * 仅显示已配置的，不显示在页脚
 */
export default function ContactButtons() {
  const whatsapp = siteConfig('CONTACT_WHATSAPP')
  const wechat = siteConfig('CONTACT_WECHAT')
  const qq = siteConfig('CONTACT_QQ')

  // 排除电报（已有 TouchMeCard），只显示其他
  const hasOthers = whatsapp || wechat || qq
  if (!hasOthers) return null

  const buttons = []
  if (whatsapp) {
    buttons.push({ href: whatsapp, icon: 'fab fa-whatsapp', label: 'WhatsApp', color: 'bg-green-600 hover:bg-green-700' })
  }
  if (wechat) {
    buttons.push({ href: wechat, icon: 'fab fa-weixin', label: '微信联系', color: 'bg-green-700 hover:bg-green-800' })
  }
  if (qq) {
    buttons.push({ href: qq, icon: 'fab fa-qq', label: '加QQ', color: 'bg-blue-600 hover:bg-blue-700' })
  }

  return (
    <div className='mt-2 flex flex-col gap-2'>
      {buttons.map((b, i) => (
        <SmartLink key={i} href={b.href}>
          <div
            className={`w-full flex items-center justify-center gap-3 lg:p-6 p-4 rounded-xl text-white font-bold text-2xl transition-colors border dark:border-gray-600 ${b.color}`}>
            <i className={`${b.icon} text-3xl`} />
            {b.label}
          </div>
        </SmartLink>
      ))}
    </div>
  )
}
