const CONFIG = {
  HEO_HOME_POST_TWO_COLS: true, // 首页博客两列显示，若为false则只显示一列（已弃用，见 HEO_HOME_POST_COLS）
  HEO_HOME_POST_COLS: 5, // 每行显示商品数：桌面端5个，响应式 手机2/平板3/小屏4/大屏5
  HEO_LOADING_COVER: true, // 页面加载的遮罩动画
  HEO_HOME_BANNER_ENABLE: false,// 关闭首页大图，让商品列表更靠上
  HEO_SITE_CREATE_TIME: '2025-12-19', // 建站日期，用于计算网站运行的第几天
// 这里的配置会覆盖系统默认，让手机端和电脑端一次性展示更多商品
  POSTS_PER_PAGE: 80, // 每页80个，与同行一致，80÷5=16行无空位 
  POST_LIST_STYLE: 'scroll', // 开启丝滑滚动模式，滑到底部自动加载下一页
  // 首页顶部纯文字横幅（无链接），在通知条上方，留空则不显示
  HEO_TOP_BANNER_TEXT: '收到货记得录完整的开箱视频. 没有视频无任何售后.以免发错货.漏发货.证据说话.没有视频别找我',

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: '点击查看购买须知！很重要.必看', url:'/tag/必看'  },
  //  { title: '访问文档中心获取更多帮助', url: 'https://docs.tangly1024.com' }
  ],

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: '永不跑路',
  HEO_HERO_TITLE_2: '质量保证',
  HEO_HERO_TITLE_3: 'ATAIWU888.COM',
  HEO_HERO_TITLE_4: '分类浏览',
  HEO_HERO_TITLE_5: '阿泰小店商品目录',
  HEO_HERO_TITLE_LINK: 'https://ataiwu888.com/category',
  // 英雄区遮罩文字
  HEO_HERO_COVER_TITLE: '诚信第一',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '必看精选', url: '/tag/必看精选' },
  HEO_HERO_CATEGORY_2: { title: '热门文章', url: '/tag/热门文章' },
  HEO_HERO_CATEGORY_3: { title: '实用教程', url: '/tag/实用教程' },

  // 首页分类图片：分类名 -> 图片路径。将图片放 public/images/categories/ 后在此配置
  // 示例: { '万宝路系列': '/images/categories/marlboro.jpg', '七星系列': '/images/categories/sevenstar.jpg' }
  HEO_CATEGORY_IMAGES: {
    'ESSE爱喜系列': '/images/categories/1772792442402.jpg',
    '520系列': '/images/categories/520系列.jpg',
    '555系列': '/images/categories/555系列.jpg',
    'kent肯特系列': '/images/categories/kent肯特系列.jpg',
    'LUCKY STRIKE好彩系列': '/images/categories/LUCKY STRIKE好彩系列.jpg',
    'marlboro万宝路系列': '/images/categories/marlboro万宝路系列.jpg',
    'peel百乐系列': '/images/categories/peel百乐系列.jpg',
    'SevenStars七星系列': '/images/categories/SevenStars七星系列.jpg',
    '俄罗斯系列': '/images/categories/俄罗斯系列.jpg',
    '免税中免系列': '/images/categories/免税中免系列.jpg',
    '台湾系列': '/images/categories/台湾系列.png',
    '宝恒树叶系列': '/images/categories/宝恒树叶系列.jpg',
    '正品朝鲜系列': '/images/categories/正品朝鲜系列.jpg',
    '澳门系列': '/images/categories/澳门系列.jpg',
    '铁塔猫RAISON系列': '/images/categories/铁塔猫RAISON系列.jpg',
    '韩免韩税系列': '/images/categories/韩免韩税系列.jpg',
    '香港系列': '/images/categories/香港系列.jpg',
    '热销爆款': '/images/categories/热销爆款.jpg',
    '蒙古': '/images/categories/蒙古.jpg',
    '阿里山系列': '/images/categories/阿里山系列.jpg',
    '高端美免美税': '/images/categories/高端美免美税.jpg',
    '卡比龙系列': '/images/categories/卡比龙系列.jpg',
    '日免日税系列': '/images/categories/日免日税系列.jpg',
    '散拼系列': '/images/categories/散拼系列.jpg',
    '正品越南本土烟': '/images/categories/正品越南本土烟.jpg',
    '好利时系列': '/images/categories/好利时系列.png'
  },

  // 英雄区右侧是否显示大卡片（分类浏览+商品目录），false 则直接显示 3 个推荐文章
  HEO_HERO_TODAY_CARD_ENABLE: false,
  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  // 首页 Hero 横滑条最多展示条数（Notion「首页置顶」、环境变量 slug 列表）；1–80，默认 80
  HEO_HERO_TOP_MAX: Number(process.env.NEXT_PUBLIC_HEO_HERO_TOP_MAX) || 80,
  // 仅首页/主列表分页：限制封面请求宽度（快）；商品详情页正文与头图仍用全站 IMAGE_COMPRESS_WIDTH（默认 900）
  // 480：五列卡片约 200px 宽×2 倍屏足够；较原 680 单张体积明显更小，弱网/国产浏览器更易加载
  HOME_LIST_COVER_MAX_WIDTH: 480,
  HOME_HERO_THUMB_MAX_WIDTH: 560,
  HOME_HERO_ICON_MAX_WIDTH: 300,
  HOME_HERO_CARD_MAX_WIDTH: 780,
  // 备选：无 Notion「首页置顶」数字列时，可用环境变量 slug 列表（见 .env.example）
  HERO_PINNED_SLUGS: process.env.NEXT_PUBLIC_HERO_PINNED_SLUGS || '',
  //   HERO_RECOMMEND_COVER: 'https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712_1280.jpg', // 英雄区右侧图片

  // 右侧信息卡「阿泰」下方的补充说明，可写长文案（整段必须在同一行，不要换行）
  HEO_INFOCARD_AUTHOR_DESC: '对人以诚信，人不欺我；对事以诚信，事无不成👍🏻不辜负客户的信赖是立身之本！！！我负责的是稳定和品质，你上来就单纯的比价格，那我不是你的选择。这个行业永远都有更低的价格！！有问题不怕，怕的是出了事，有没有给你解决问题的人.感谢一直以来的信任与支持！🍂 愿所有朋友们合合美美，万事顺遂✨',

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '你好！我是',
    '🔍 分享与热心帮助',
    '🤝 专修交互与设计',
    '🏃 脚踏实地行动派',
    '🏠 智能家居小能手',
    '🤖️ 数码科技爱好者',
    '🧱 团队小组发动机'
  ],

  // 个人资料底部按钮（右侧栏头像下方，2个小图标 + 1个文字按钮）
  HEO_INFO_CARD_URL1: process.env.NEXT_PUBLIC_CONTACT_TELEGRAM || 'https://t.me/wy6691888',
  HEO_INFO_CARD_ICON1: 'fab fa-telegram',
  HEO_INFO_CARD_URL2: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '',
  HEO_INFO_CARD_ICON2: 'fab fa-whatsapp',
  HEO_INFO_CARD_URL3: process.env.NEXT_PUBLIC_CONTACT_WECHAT || process.env.NEXT_PUBLIC_CONTACT_QQ || '',
  HEO_INFO_CARD_TEXT3: '微信联系', // 若 URL3 是 QQ 链接，可改为 'QQ联系'

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'AfterEffect',
      img_1: '/images/1690369547620.jpg',
      color_1: '#989bf8',
      title_2: 'Sketch',
      img_2: '/images/1690369817996.jpg',
      color_2: '#ffffff'
    },
    {
      title_1: 'Docker',
      img_1: '/images/1690369911757.jpg',
      color_1: '#57b6e6',
      title_2: 'Photoshop',
      img_2: '/images/1690369996702.jpg',
      color_2: '#4082c3'
    },
    {
      title_1: 'FinalCutPro',
      img_1: '/images/1690370690760.jpg',
      color_1: '#ffffff',
      title_2: 'Python',
      img_2: '/images/1766335584925.jpg',
      color_2: '#ffffff'
    },
    {
      title_1: 'Swift',
      img_1: '/images/1766335584980.jpg',
      color_1: '#eb6840',
      title_2: 'Principle',
      img_2: '/images/1766335585026.jpg',
      color_2: '#8f55ba'
    },
    {
      title_1: 'illustrator',
      img_1: '/images/1766335585005.jpg',
      color_1: '#f29e39',
      title_2: 'CSS3',
      img_2: '/images/1766335585048.jpg',
      color_2: '#2c51db'
    },
    {
      title_1: 'JS',
      img_1: '/images/1766335585073.jpg',
      color_1: '#f7cb4f',
      title_2: 'HTML',
      img_2: '/images/1766335585094.jpg',
      color_2: '#e9572b'
    },
    {
      title_1: 'Git',
      img_1: '/images/1766335585122.jpg',
      color_1: '#df5b40',
      title_2: 'Rhino',
      img_2: '/images/1766335585145.jpg',
      color_2: '#1f1f1f'
    }
  ],

  HEO_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '电报联系',
 // HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击电报联系',
  HEO_SOCIAL_CARD_URL: 'https://t.me/wy6691888',

  // 底部统计面板文案
  HEO_POST_COUNT_TITLE: '商品数量:',
  HEO_SITE_TIME_TITLE: '建站天数:',
  HEO_SITE_VISIT_TITLE: '访问量:',
  HEO_SITE_VISITOR_TITLE: '访客数:',

  // *****  以下配置无效，只是预留开发 ****
  // 菜单配置
  HEO_MENU_INDEX: true, // 显示首页
  HEO_MENU_CATEGORY: true, // 显示分类
  HEO_MENU_TAG: true, // 显示标签
  HEO_MENU_ARCHIVE: true, // 显示归档
  HEO_MENU_SEARCH: true, // 显示搜索

  HEO_POST_LIST_COVER: true, // 列表显示文章封面
  HEO_POST_LIST_COVER_HOVER_ENLARGE: false, // 列表鼠标悬停放大

  HEO_POST_LIST_COVER_DEFAULT: true, // 封面为空时用站点背景做默认封面
  HEO_POST_LIST_SUMMARY: true, // 文章摘要
  HEO_POST_LIST_PREVIEW: false, // 读取文章预览
  HEO_POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  HEO_ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  HEO_ARTICLE_COPYRIGHT: false, // 显示文章版权声明
  HEO_ARTICLE_NOT_BY_AI: false, // 显示非AI写作
  HEO_ARTICLE_RECOMMEND: true, // 文章关联推荐

  HEO_WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  HEO_WIDGET_ANALYTICS: false, // 显示统计卡
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true, // 跳到评论区
  HEO_WIDGET_DARK_MODE: true, // 夜间模式
  HEO_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
