import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { decryptEmail } from '@/lib/plugins/mailEncrypt'

/**
 * 紧贴「电报+微信」下方的其他联系方式按钮
 * 微信已在侧栏与电报并排显示，此处不重复
 */
export default function ContactButtons() {
  const whatsapp = siteConfig('CONTACT_WHATSAPP')
  const qq = siteConfig('CONTACT_QQ')
  const emailEnc = siteConfig('CONTACT_EMAIL')
  const email = emailEnc ? decryptEmail(emailEnc) : ''

  const hasOthers = whatsapp || qq || email
  if (!hasOthers) return null

  const buttons = []
  if (whatsapp) {
    buttons.push({ href: whatsapp, icon: 'fab fa-whatsapp', label: 'WhatsApp', color: 'bg-green-600 hover:bg-green-700' })
  }
  if (qq) {
    buttons.push({ href: qq, icon: 'fab fa-qq', label: '加QQ', color: 'bg-blue-600 hover:bg-blue-700' })
  }
  if (email) {
    buttons.push({ href: `mailto:${email}`, icon: 'fas fa-envelope', label: '邮件联系', color: 'bg-red-600 hover:bg-red-700' })
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
