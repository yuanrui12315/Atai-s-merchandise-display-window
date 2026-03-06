export default function ErrorPage({ statusCode }) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900'>
      <h1 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
        发生错误，状态码：{statusCode || 404}
      </h1>
      <a
        href='/'
        className='inline-block bg-blue-500 py-2 px-4 text-white rounded-lg hover:bg-blue-600 no-underline'>
        返回首页
      </a>
    </div>
  )
}
ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}