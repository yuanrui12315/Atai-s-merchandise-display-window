const BLOG = {
  POSTS_PER_PAGE: 18, 
  POST_LIST_STYLE: 'page',
  POSTS_SORT_BY: 'date', // 按发布时间排序，新商品在前 
  API_BASE_URL: process.env.API_BASE_URL || 'https://www.notion.so/api/v3',

  // 这里的变量名必须与你在 Vercel 设置的一致
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

  AUTHOR: '阿泰
    对人以诚信，人不欺我；对事以诚信，事无不成👍🏻不辜负客户的信赖是立身之本！！！我负责的是稳定和品质，你上来就单纯的比价格，那我不是你的选择。这个行业永远都有更低的价格！！有问题不怕，怕的是出了事，有没有给你解决问题的人.感谢一直以来的信任与支持！🍂 愿所有朋友们合合美美，万事顺遂✨',
  BIO: '阿泰小店，全天候在线，欢迎咨询',
  LINK: 'https://ataiwu888.com',
  ROBOTS_ALLOW: false, // 设为 false 可禁止搜索引擎收录（私人网站用）
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
  CARD_URL: 'https://t.me/@wy6691888',

  ...require('./conf/post.config.js'),
  ...require('./conf/analytics.config.js'),
  ...require('./conf/image.config.js'),
  ...require('./conf/font.config.js'),
  ...require('./conf/right-click-menu.js'),
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
  CAN_COPY: true,
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
