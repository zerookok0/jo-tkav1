import type {
  ChatStory,
  HeroSlide,
  HighlightItem,
  IconName,
  NavItem,
  PersonCard,
  WithId,
} from './types'

/* ══════════════════════════ 品牌 ══════════════════════════ */

export type BrandConfig = {
  /** 应用名称（站内所有出现名字的地方都读这里） */
  name: string
  /** 副标题，横排在名字下面 */
  tagline: string
  /** 应用图标 URL，留空显示占位方块 */
  iconUrl: string
  /** 页签标题 */
  docTitle: string
  /** SEO 描述 */
  docDescription: string
  /** 联系邮箱 */
  email: string
  /** 版权行左侧文案 */
  copyright: string
}

export const DEFAULT_BRAND: BrandConfig = {
  name: '夜里',
  tagline: '附近短视频',
  iconUrl: '',
  docTitle: '夜里 · 三公里内，此刻还没睡的人',
  docDescription:
    '深夜才上线的同城私域。三公里内的真实画面，不用加好友，划到就看得到。支持匿名出镜、AI 变声、看完即焚。仅限 18 岁以上。',
  email: 'hello@example.com',
  copyright: '保留所有权利',
}

/* ══════════════════════════ 下载与埋点 ══════════════════════════ */

export type DownloadConfig = {
  apkUrl: string
  version: string
  size: string
  minAndroid: string
  /** Facebook Pixel ID，留空则不加载 */
  pixelId: string
}

export const DEFAULT_DOWNLOAD: DownloadConfig = {
  apkUrl: 'https://example.com/app.apk',
  version: 'v2.4.1',
  size: '45 MB',
  minAndroid: 'Android 8.0+',
  pixelId: '',
}

/* ══════════════════════════ 色彩 ══════════════════════════ */

export type ThemeConfig = {
  bg: string
  surface: string
  text: string
  muted: string
  wine: string
  copper: string
  blush: string
}

export const DEFAULT_THEME: ThemeConfig = {
  bg: '#0A0607',
  surface: '#120D0F',
  text: '#F6EBE0',
  muted: '#A08F91',
  wine: '#7C1B2C',
  copper: '#C08A5C',
  blush: '#E9A9A1',
}

/* ══════════════════════════ 导航 ══════════════════════════ */

export const DEFAULT_NAV: NavItem[] = [
  { id: 'n1', label: '看视频', href: '#top' },
  { id: 'n2', label: '附近的人', href: '#nearby' },
  { id: 'n3', label: '开始聊天', href: '#chat' },
  { id: 'n4', label: '下载', href: '#install' },
]

/** 顶部与各处的按钮文字 */
export type ButtonCopy = {
  headerCta: string
  heroCta: string
  heroSecondary: string
  phoneEndTitle: string
  phoneEndBody: string
  phoneEndCta: string
  dockCta: string
  installCta: string
  modalCancel: string
  modalConfirm: string
}

export const DEFAULT_BUTTONS: ButtonCopy = {
  headerCta: '免费下载',
  heroCta: '进来看一眼',
  heroSecondary: '先看看有谁',
  phoneEndTitle: '预览到这里就结束啦',
  phoneEndBody: '下载 App 解锁完整推荐流，还有你附近 3km 的实时更新。',
  phoneEndCta: '免费下载',
  dockCta: '下载',
  installCta: '免费下载 App',
  modalCancel: '取消',
  modalConfirm: '我已了解，开始下载',
}

/* ══════════════════════════ 界面文字 ══════════════════════════ */

/**
 * 零散文案：按钮以外的短句、无障碍朗读标签、空状态提示。
 *
 * 这些东西以前零散写在组件里，翻译时最容易漏 —— 所以统一收到这里。
 * 带 `{xxx}` 的是模板，渲染时用 fill() 填值：
 * 英文、阿语的词序和中文不同，不能靠字符串拼接。
 */
export type UiCopy = {
  /* 全局 */
  skipToContent: string
  close: string
  closeDialog: string

  /* 品牌与语言 */
  appIconAlt: string
  appIconPlaceholder: string
  appNamePlaceholder: string
  appNamePlaceholderHint: string
  localeSwitchAria: string
  localeMenuAria: string

  /* 顶栏与菜单 */
  backToTop: string
  openMenu: string
  closeMenu: string
  mainNav: string
  mobileNav: string

  /* 首屏 */
  slideDot: string

  /* 手机预览 */
  feedRegionAria: string
  previewLabel: string
  previewDistance: string
  emptyFeedTitle: string
  emptyFeedBody: string
  videoMissingSrc: string
  unmute: string
  mute: string
  likeAria: string
  commentAria: string
  saveAria: string
  shareAria: string
  ageOnly: string
  officialBadge: string
  appSummary: string
  moreComments: string
  gateLegal: string
  commentSamples: { name: string; text: string }[]

  /* 附近的人 */
  cardAria: string
  avatarAlt: string
  sayHi: string
  noAvatar: string
  bridgeTitle: string
  bridgeBody: string
  bridgeCta: string

  /* 私聊 */
  chatInputAria: string
  chatContinueCta: string

  /* 安装与下载 */
  metaVersion: string
  metaSize: string
  metaSystem: string
}

export const DEFAULT_UI: UiCopy = {
  skipToContent: '跳到主要内容',
  close: '关闭',
  closeDialog: '关闭弹窗',

  appIconAlt: '{name} 图标',
  appIconPlaceholder: '应用图标占位',
  appNamePlaceholder: '应用名称',
  appNamePlaceholderHint: '在控制台的「品牌」里填入应用名称',
  localeSwitchAria: '语言：{label}',
  localeMenuAria: '选择语言',

  backToTop: '回到顶部',
  openMenu: '打开菜单',
  closeMenu: '关闭菜单',
  mainNav: '主导航',
  mobileNav: '移动端导航',

  slideDot: '切换到第 {n} 条文案',

  feedRegionAria: '短视频预览，可上下滑动切换',
  previewLabel: '真实界面预览',
  previewDistance: '距你 {distance}',
  emptyFeedTitle: '还没有视频',
  emptyFeedBody: '打开控制台的「视频」标签，添加第一条视频链接',
  videoMissingSrc: '未填写视频链接',
  unmute: '开启声音',
  mute: '静音',
  likeAria: '点赞，需下载 App',
  commentAria: '评论，需下载 App',
  saveAria: '收藏，需下载 App',
  shareAria: '分享，需下载 App',
  ageOnly: '{age} · 仅限成年用户',
  officialBadge: '官方版',
  appSummary: '附近视频 · 一键上传 · 实时互动',
  moreComments: '更多评论需下载 App',
  gateLegal: '继续即表示同意用户协议 · 本应用仅限 18 岁以上',
  commentSamples: [
    { name: '小满', text: '这个角度也太好看了吧' },
    { name: 'Nova', text: '求定位！想去同款地方' },
  ],

  cardAria: '和 {name} 打个招呼，需下载 App',
  avatarAlt: '{name}，{age} 岁',
  sayHi: '打个招呼',
  noAvatar: '未设置头像',
  bridgeTitle: '看中了哪一位？直接开口就行。',
  bridgeBody: '文字、语音、照片都能发。她看完即焚，聊不下去随时关掉。',
  bridgeCta: '进去聊两句',

  chatInputAria: '继续聊天需要下载 App',
  chatContinueCta: '继续聊下去 · 免费下载',

  metaVersion: '版本',
  metaSize: '大小',
  metaSystem: '系统',
}

/* ══════════════════════════ 首屏 ══════════════════════════ */

export type HeroConfig = {
  /** 状态条文案（三段，中间加粗） */
  statusPre: string
  statusTime: string
  statusMid: string
  statusCount: string
  statusPost: string
  trusted: string[]
  /** 手机下方那行小字 */
  note: string
  /** 手机里的顶部标签页 */
  tabs: string[]
  /** 滑动提示 */
  swipeHint: string
  badge18: string
}

export const DEFAULT_HERO: HeroConfig = {
  statusPre: '现在',
  statusTime: '01:24',
  statusMid: '你附近还有',
  statusCount: '1,284',
  statusPost: '个人没睡',
  trusted: ['三公里内 · 不跨城', '可匿名出镜 · 声音可变'],
  note: '上面是真的界面 —— 直接上下滑。看到第几条会忍不住，我们也不知道',
  tabs: ['附近', '关注', '推荐'],
  swipeHint: '上下滑动切换',
  badge18: '18+',
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'h1',
    kicker: '18+ · 此刻 · 三公里内',
    title: '离你 480 米的地方，她的灯还亮着。',
    sub: '不用加好友，也不用打招呼。划过去，就看见她今晚穿的是什么。',
  },
  {
    id: 'h2',
    kicker: '18+ · 深夜才上线',
    title: '凌晨一点，有人比你更不想睡。',
    sub: '这些人不会出现在白天的推荐里。她们只在夜里出现，也只在夜里消失。',
  },
]

/* ══════════════════════════ 亮点 ══════════════════════════ */

export type HighlightsConfig = {
  eyebrow: string
  title: string
  titleHighlight: string
  titleTail: string
  sub: string
  featured: {
    badge: string
    points: string[]
    meterTitle: string
    meterStatus: string
    meterOptions: string[]
  }
}

/** 标题被拆成三段：前缀 + 渐变高亮 + 后缀，方便单独改色块 */
export const DEFAULT_HIGHLIGHTS_COPY: HighlightsConfig = {
  eyebrow: '为什么值得装',
  title: '你可能就是为了',
  titleHighlight: '其中一条',
  titleTail: '才点进来的。',
  sub: '下面这五条，是用户真正在用的功能 —— 不是宣传语。',
  featured: {
    badge: '隐私优先',
    points: [
      '声音可换成男/女/童声或完全自定义',
      '录视频与语音连麦时实时生效',
      '不露脸也能出镜，画面只保留动作',
    ],
    meterTitle: '变声器',
    meterStatus: '使用中',
    meterOptions: ['偏低', '中性', '偏高'],
  },
}

export const DEFAULT_HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'hl1',
    icon: 'sparkles',
    title: '完全免费',
    body: '下载安装不要钱，看视频、私聊、发作品，核心功能没有任何会员墙。',
  },
  {
    id: 'hl2',
    icon: 'wifi',
    title: '不烧流量',
    body: '连着 Wi-Fi 自动缓存附近内容，出门用流量也能顺畅刷十几条。',
  },
  {
    id: 'hl3',
    icon: 'mapPin',
    title: '看到附近的异性',
    body: '按真实距离排序，最近的一位可能就在三百米外，滑到就能打个招呼。',
  },
  {
    id: 'hl4',
    icon: 'flame',
    title: '阅后即焚',
    body: '私聊里的照片和语音，对方看完即销毁，不会留在对面手机里。',
  },
  {
    id: 'hl5',
    icon: 'mic',
    title: '内置 AI 变声器',
    body: '一键把声音换成别人认不出的样子，录视频、连麦都能用。想露脸就露脸，想藏住就藏住。',
    featured: true,
  },
]

/* ══════════════════════════ 附近的人 ══════════════════════════ */

export const DEFAULT_NEARBY_COPY = {
  eyebrow: '按距离排出，不按热度',
  title: '此刻，三公里内。',
  sub: '不是推荐算法给你的。是按距离，从近到远，一个接一个。',
  liveNote: '4 个人在线 · 持续更新',
  footnote: '名字与距离已经过模糊处理。真实位置只有 App 里才看得到',
  onlineLabel: '在线',
  recentLabel: '刚刚',
}

export const DEFAULT_PEOPLE: PersonCard[] = [
  {
    id: 'p1',
    name: '小满',
    age: 24,
    meters: 320,
    now: '刚洗完澡，头发还没干',
    quote: '明天不用早起，所以现在还不困。',
    avatar:
      'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: true,
    tags: ['同小区', '在线'],
  },
  {
    id: 'p2',
    name: 'Nova',
    age: 27,
    meters: 680,
    now: '在阳台抽烟，没开灯',
    quote: '楼下的猫又在叫了，你要不要下来看看。',
    avatar:
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: true,
    tags: ['两站路', '刚上线'],
  },
  {
    id: 'p3',
    name: '阿棠',
    age: 22,
    meters: 1100,
    now: '躺着，只开了床头那盏',
    quote: '我声音比较低，你可能会认错人。',
    avatar:
      'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: false,
    tags: ['变声', '3 分钟前'],
  },
  {
    id: 'p4',
    name: '苏眠',
    age: 29,
    meters: 2400,
    now: '刚下班，妆还没卸',
    quote: '今天有点累，但不想睡。陪我坐一会儿。',
    avatar:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=520&fit=crop',
    live: true,
    tags: ['同城', '在线'],
  },
]

/* ══════════════════════════ 怎么用 ══════════════════════════ */

export type StepItem = WithId & {
  icon: IconName
  title: string
  body: string
}

export const DEFAULT_HOW_COPY = {
  eyebrow: '上手只要三分钟',
  title: '打开、滑一下、说句话。',
  sub: '没有复杂的注册流程，手机号验证完就能看。',
  uploadTitle: '你自己也能发',
  uploadBody: '拍完直接发，可选「仅附近可见」。30 秒出片，不用会剪辑。',
  uploadLink: '看看怎么发',
}

export const DEFAULT_STEPS: StepItem[] = [
  {
    id: 's1',
    icon: 'mapPin',
    title: '看到附近',
    body: '打开就是 3km 内的实时视频，越近越靠前。不用关注、不用加好友。',
  },
  {
    id: 's2',
    icon: 'messageOff',
    title: '私聊打个招呼',
    body: '点开头像就能发消息，文字、语音、照片都行。不想聊了随时关掉。',
  },
  {
    id: 's3',
    icon: 'flame',
    title: '看完就没了',
    body: '照片和语音对方看完即销毁，不留在对面手机里。想留就自己截图——要快。',
  },
]

/* ══════════════════════════ 深夜对话 ══════════════════════════ */

export type ChatFeature = { icon: IconName; title: string; body: string }

export const DEFAULT_CHAT_COPY = {
  eyebrow: '01:24 的私聊',
  title: '有些话，只在她困之前说得出口。',
  sub: '真实的私聊长这样。看完即焚，截图要快。',
  features: [
    {
      icon: 'flame',
      title: '看完即焚',
      body: '照片和语音点开就开始倒计时，5 秒后从对面手机里消失。',
    },
    {
      icon: 'lock',
      title: '截图会有提示',
      body: '她那边会立刻知道你截了屏 —— 所以，要快，也得认。',
    },
  ] as ChatFeature[],
  burnBadge: '阅后即焚',
  inputPlaceholder: '说点什么…',
  sendLabel: '发送',
  endNote: '后面的，不在网页上',
}

export const DEFAULT_CHAT: ChatStory[] = [
  {
    id: 'c1',
    name: '小满',
    meta: '320m · 昨天 01:24',
    avatar:
      'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop',
    lines: [
      { id: 'l1', from: 'her', text: '你也没睡啊' },
      { id: 'l2', from: 'you', text: '看到你还在线' },
      { id: 'l3', from: 'her', text: '我刚洗完澡，头发还是湿的' },
      { id: 'l4', from: 'her', text: '发你一张？' },
      { id: 'l5', from: 'you', text: '发吧' },
      { id: 'l6', from: 'her', text: '图片已查看 · 5 秒后销毁', system: true },
      { id: 'l7', from: 'her', text: '看到了吗' },
      { id: 'l8', from: 'her', text: '……说话呀' },
    ],
  },
]

/* ══════════════════════════ 安装 ══════════════════════════ */

export type InstallStep = WithId & { no: string; title: string; body: string }
export type SafetyPoint = WithId & { title: string; body: string }
export type FaqItem = WithId & { q: string; a: string }
export type PermissionRow = { name: string; why: string }

export const DEFAULT_INSTALL_COPY = {
  eyebrow: '下载与安装',
  title: '三步装好，',
  titleHighlight: '不到一分钟。',
  sub: '应用没有上架应用商店，所以手机会提示「未知来源」。这是安卓对所有侧载安装的正常拦截，不是文件有问题。',
  permissionsTitle: '只申请这三项权限',
  permissions: [
    { name: '相机', why: '拍摄与上传视频' },
    { name: '麦克风', why: '录音、语音私聊、AI 变声' },
    { name: '位置', why: '计算距离，推荐附近内容' },
  ] as PermissionRow[],
  permissionsNote: '通讯录、短信、通话记录 —— 一律不申请。位置可以随时在设置里关掉。',
  safetyEyebrow: '安全说明',
  apkTitle: '安装包信息',
  apkLink: '直链地址（备用）',
  warningPrefix: '如果手机提示「禁止安装未知应用」，进入',
  warningStrong: '设置 → 安全 → 安装未知应用',
  warningSuffix: '，为你正在用的浏览器打开权限，再回来点一次下载即可。',
  faqTitle: '还有这几个问题',
  faqHint: '点开就能看到答案',
  ctaTitle: '都看明白了？那就装上试试',
  ctaSub: '装好之后打开，你会看到此刻离你最近的那条视频。',
  footLegal: '用户协议',
  footPrivacy: '隐私政策',
  footRules: '内容规范',
  footAge: '18+',
}

export const DEFAULT_INSTALL_STEPS: InstallStep[] = [
  {
    id: 'i1',
    no: '01',
    title: '点「下载」，等 APK 下完',
    body: '文件约 45 MB，用 Wi-Fi 大概十几秒。下载过程中不要切走页面。',
  },
  {
    id: 'i2',
    no: '02',
    title: '允许「未知来源」安装',
    body: '应用没有上架谷歌商店，手机会弹提示。这是正常现象，点「允许」继续。',
  },
  {
    id: 'i3',
    no: '03',
    title: '点开文件，安装完成',
    body: '装好后直接打开，允许相机与位置权限，附近的内容才会出现。',
  },
]

export const DEFAULT_SAFETY: SafetyPoint[] = [
  {
    id: 'sf1',
    title: '数字签名校验',
    body: '每个安装包都经过签名，安装时会自动校验，被改动过的包无法装上。',
  },
  {
    id: 'sf2',
    title: '无多余权限',
    body: '只申请相机、麦克风、定位三项。通讯录、短信、通话记录一律不碰。',
  },
  {
    id: 'sf3',
    title: '不扣费、无自动续订',
    body: '核心功能免费，没有隐藏订阅，也不会从你的账户里扣任何钱。',
  },
]

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'f1',
    q: '安装后打不开或闪退怎么办？',
    a: '先确认系统是 Android 8.0 以上。如果装过旧版本，请先卸载再重新安装；部分机型需要重启一次才会生效。',
  },
  {
    id: 'f2',
    q: '为什么提示「未知来源」，安全吗？',
    a: '因为没有上架应用商店，系统默认会拦截非商店来源的安装包。这是安卓对所有侧载应用的标准提示，不代表文件有问题。',
  },
  {
    id: 'f3',
    q: '会不会扣费或自动续费？',
    a: '不会。下载和核心功能都是免费的，页面里没有任何付费入口，也不会绑定支付方式。',
  },
  {
    id: 'f4',
    q: '苹果手机能用吗？',
    a: '目前只提供安卓安装包。iOS 版本还在审核流程里，可以先把页面收藏起来。',
  },
  {
    id: 'f5',
    q: '我的位置信息会被存下来吗？',
    a: '位置只用于计算距离和推荐附近内容，不会显示精确坐标给其他用户，也不会卖给第三方。',
  },
]

/* ══════════════════════════ 弹窗 ══════════════════════════ */

export type QuickFix = { q: string; a: string }

export const DEFAULT_MODAL_COPY = {
  title: '准备下载',
  sub: '按这三步安全安装到你的安卓手机',
  signTitle: '签名已校验',
  signBody: '安装包经过数字签名，安装时系统会自动校验。被篡改过的包装不上。',
  scanTitle: '可自行复查',
  scanBody: '下载后用任意手机杀毒 App 再扫一遍，结果随时可查。',
  unknownTitle: '为什么会提示「未知来源」？',
  unknownBody:
    '因为本应用没有上架应用商店。安卓对所有非商店渠道的安装包都会给这个提示，这是系统层面的标准行为，不代表文件有问题。点「允许」即可继续。',
  fixesTitle: '装的过程中卡住了？',
  fixes: [
    {
      q: '点下载没反应？',
      a: '部分浏览器会拦截 APK。换用 Chrome 或系统自带浏览器重新打开本页再点一次。',
    },
    {
      q: '装完找不到图标？',
      a: '部分国产系统会把新应用放进「未分类」文件夹，或在桌面下拉搜索应用名称。',
    },
    {
      q: '提示「解析包错误」？',
      a: '通常是下载中断导致文件不完整。删除已下载的文件，重新点一次下载即可。',
    },
  ] as QuickFix[],
  legal: '继续即表示同意用户协议与隐私政策 · 本应用仅限 18 岁以上',
}

/* ══════════════════════════ 拦截弹窗 ══════════════════════════ */

export type GateKey = 'default' | 'like' | 'comment' | 'save' | 'share'
export type GateEntry = { title: string; sub: string; cta: string }

export const DEFAULT_GATES: Record<GateKey, GateEntry> = {
  default: {
    title: '后面的，得进 App 才看得到',
    sub: '有些画面不适合放在网页上。装好之后，从这里接着往下划。',
    cta: '装好接着看',
  },
  like: {
    title: '想让她知道你点了',
    sub: '她会看到是谁。但只在她也装了 App 之后。',
    cta: '下载去点这个赞',
  },
  comment: {
    title: '评论区得进 App 才能进',
    sub: '这一条下面有 2,800 多句没说完的话。',
    cta: '下载去看评论',
  },
  save: {
    title: '先存起来，回头再看',
    sub: '她删掉之前，你还有时间。收藏只在 App 里生效。',
    cta: '下载去收藏',
  },
  share: {
    title: '转给那个也没睡的人',
    sub: '别一个人看。这类的链接，我们只让它活两小时。',
    cta: '下载去分享',
  },
}

/* ══════════════════════════ 页脚 ══════════════════════════ */

export type FooterGroup = WithId & {
  title: string
  items: { id: string; label: string; href: string }[]
}

export const DEFAULT_FOOTER = {
  about:
    '一个把「附近」放在第一位的短视频社区。看身边正在发生的事，也让身边看见你。',
  groups: [
    {
      id: 'g1',
      title: '了解',
      items: [
        { id: 'g1a', label: '产品亮点', href: '#highlights' },
        { id: 'g1b', label: '使用方式', href: '#how' },
        { id: 'g1c', label: '下载安装', href: '#install' },
      ],
    },
    {
      id: 'g2',
      title: '支持',
      items: [
        { id: 'g2a', label: '常见问题', href: '#install' },
        { id: 'g2b', label: '反馈建议', href: 'mailto:hello@example.com' },
        { id: 'g2c', label: '内容举报', href: 'mailto:hello@example.com' },
      ],
    },
  ] as FooterGroup[],
  dockNote: '附近视频 · 完全免费',
}
