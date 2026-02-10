// 注: process.env.XX是Vercel的环境变量
const BLOG = {
  POSTS_PER_PAGE: 18, 
  POST_LIST_STYLE: 'page', 
  API_BASE_URL: process.env.API_BASE_URL || 'https://www.notion.so/api/v3',

  // 1. 核心修正：对齐你在 Vercel 中设置的新变量名
  NOTION_PAGE_ID: process.env.NOTION_PAGE_ID || '2bc9b11274688061873fe4804d9aa93e',
  NOTION_ACCESS_TOKEN: process.env.NOTION_ACCESS_TOKEN || 'ntn_41625482344bc9p6cEHGha5GxV6b2YTmTJpYnE1itG38E',

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
  NEXT_REVALIDATE_SECOND: 60,
  APPEARANCE: 'light',
  APPEARANCE_DARK_TIME: [18, 6],

  AUTHOR: '阿泰',
  BIO: '阿泰小店，全天候在线，欢迎咨询',
  LINK: 'https://ataiwu888.com',
  KEYWORDS: 'Notion, 博客, 爆珠',
  BLOG_FAVICON: '/favicon.ico',

  SITE_TITLE: '阿泰小店 - 爆珠专卖',
  SEARCH_PLACEHOLDER: '搜索商品名称或标签...',
  SITE_DESCRIPTION: '正品爆珠商品展示',
  SITE_URL: 'https://ataiwu888.com',
  ENABLE_RSS: false,

  // --- 插件配置加载 ---
  ...require('./conf/comment.config'), 
  ...require('./conf/contact.config'),
  CARD_URL: 'https://t.me/@wy6691888', // 你的联系方式

  ...require('./conf/post.config'),
  ...require('./conf/analytics.config'),
  ...require('./conf/image.config'),
  ...require('./conf/font.config'),
  ...require('./conf/right-click-menu'),
  ...require('./conf/code.config'),
  ...require('./conf/animation.config'),
  ...require('./conf/widget.config'),
  ...require('./conf/ad.config'),
  ...require('./conf/plugin.config'),
  ...require('./conf/performance.config'),
  ...require('./conf/layout-map.config'),
  ...require('./conf/notion.config'),
  ...require('./conf/dev.config'),

  // --- 剩余补全代码 ---
  CUSTOM_EXTERNAL_JS: [''],
  CUSTOM_EXTERNAL_CSS: [''],
  CUSTOM_MENU: process.env.NEXT_PUBLIC_CUSTOM_MENU || true,
  CAN_COPY: process.env.NEXT_PUBLIC_CAN_COPY || true,
  LAYOUT_SIDEBAR_REVERSE: process.env.NEXT_PUBLIC_LAYOUT_SIDEBAR_REVERSE || false,
  GREETING_WORDS: process.env.NEXT_PUBLIC_GREETING_WORDS || 'Hi，欢迎光临阿泰小店, 最新货源实时更新🎉',
  UUID_REDIRECT: process.env.UUID_REDIRECT || false,
  CATEGORY_PROPERTY_NAME: '分类',
  TAG_PROPERTY_NAME: '标签',
  FEATURED_PROPERTY_NAME: 'featured',

  // 2. 补丁：强制静默 Clerk，防止剩下那 4 个报错
  COMMENT_CLERK_APP_ID: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  COMMENT_CLERK_SECRET: process.env.CLERK_SECRET_KEY || ''
}

module.exports = BLOG
