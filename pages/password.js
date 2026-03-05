/**
 * 网站访问密码页
 * 输入正确密码后可访问全站
 */
import { useRouter } from 'next/router'
import BLOG from '@/blog.config'

export default function PasswordPage() {
  const router = useRouter()
  const hasError = router.query.error === '1'
  const from = router.query.from || ''

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
      <div className='w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
        <h1 className='text-2xl font-bold text-center mb-2 dark:text-white'>
          {BLOG.SITE_TITLE || '访问验证'}
        </h1>
        <p className='text-sm text-gray-500 text-center mb-6 dark:text-gray-400'>
          请输入访问密码
        </p>
        <form action='/api/verify-password' method='POST'>
          {from && <input type='hidden' name='from' value={from} />}
          <input
            type='password'
            name='password'
            placeholder='请输入密码'
            className='w-full px-4 py-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500'
            autoFocus
            required
          />
          {hasError && (
            <p className='text-red-500 text-sm mb-4'>密码错误，请重试</p>
          )}
          <button
            type='submit'
            className='w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg'
          >
            进入网站
          </button>
        </form>
      </div>
    </div>
  )
}
