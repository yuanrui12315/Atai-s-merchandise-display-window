const BLOG = {
  POST_LIST_STYLE: 'page',
  POSTS_SORT_BY: 'date', // 按发布时间排序，新商品在前 
  API_BASE_URL: process.env.API_BASE_URL || 'https://www.notion.so/api/v3',

  // 从 Vercel 环境变量读取，不要在此处写密钥
  NOTION_PAGE_ID: process.env.NOTION_PAGE_ID,
  NOTION_ACCESS_TOKEN: process.env.NOTION_ACCESS_TOKEN,

  THEME: 'heo', 
  SEARCH: true,  
  MENU_SEARCH: true,
  SHOW_POST_TITLE_IN_CARD: true,
  POST_TITLE_FONT_SIZE: '18px',
  POST_TITLE_COLOR: '#000000',
  POST_CARD_PRICE: true,
  MENU_CATEGORY: true,
  MENU_TAG: true,
  
  LANG: process.env.NEXT_PUBLIC_LANG || 'zh-CN',
  SINCE: 2021,
  PSEUDO_STATIC: false,
  NEXT_REVALIDATE_SECOND: 2592000, // 30天缓存，大幅减少 Notion 请求，国内访问更快
  APPEARANCE: 'light',
  APPEARANCE_DARK_TIME: [18, 6],

  AUTHOR: '阿泰',
  BIO: '阿泰小店，全天候在线，欢迎咨询',
  LINK: 'https://ataiwu888.com',
  ROBOTS_ALLOW: false, // 私人商品展示站，禁止搜索引擎收录
  KEYWORDS: 'Notion, 博客, 爆珠',
  BLOG_FAVICON: '/favicon.ico',

  SITE_TITLE: '阿泰小店 - 烟草专卖',
  SEARCH_PLACEHOLDER: '搜索商品名称或标签...',
  SITE_DESCRIPTION: '正品爆珠商品展示',
  SITE_URL: 'https://ataiwu888.com',

  ENABLE_RSS: false,

  // 插件加载
  ...require('./conf/comment.config.js'), 
  ...require('./conf/contact.config.js'),
  CARD_URL: 'https://t.me/wy6691888',

  ...require('./conf/post.config.js'),
  POSTS_PER_PAGE: 80, // 覆盖 post.config 默认12，每页80个商品
  ...require('./conf/analytics.config.js'),
  ...require('./conf/image.config.js'),
  ...require('./conf/font.config.js'),
  ...require('./conf/right-click-menu.js'),
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_SWITCH: false, // 右键菜单不显示主题切换
  ...require('./conf/code.config.js'),
  ...require('./conf/animation.config.js'),
  ...require('./conf/widget.config.js'),
  ...require('./conf/ad.config.js'),
  ...require('./conf/plugin.config.js'),
  ...require('./conf/performance.config.js'),
  ...require('./conf/layout-map.config.js'),
  ...require('./conf/notion.config.js'),
  ...require('./conf/dev.config.js'),

  CUSTOM_EXTERNAL_JS: [''],
  CUSTOM_EXTERNAL_CSS: [''],
  CUSTOM_MENU: true,
  CAN_COPY: false, // 禁止复制网站文字，保护内容
  LAYOUT_SIDEBAR_REVERSE: false,
  GREETING_WORDS: 'Hi，欢迎光临阿泰小店, 最新货源实时更新🎉',
  UUID_REDIRECT: false,
  CATEGORY_PROPERTY_NAME: '分类',
  TAG_PROPERTY_NAME: '标签',
  FEATURED_PROPERTY_NAME: 'featured',

  // 强制禁用 Clerk 登录防止报错
  COMMENT_CLERK_APP_ID: '',
  COMMENT_CLERK_SECRET: ''
}

module.exports = BLOG
