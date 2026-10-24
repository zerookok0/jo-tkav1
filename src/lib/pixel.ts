/**
 * ────────────────────────────────────────────────────────────────
 *  Facebook Pixel  ·  事件口径
 * ────────────────────────────────────────────────────────────────
 *  不是「只有两个按钮」触发，而是「两个事件」：
 *
 *  1) 任何入口弹出下载框  → InitiateCheckout（openSheet 统一触发）
 *     包括：顶部导航 / 首屏按钮 / 手机内点赞评论收藏分享 /
 *           附近的人卡片 / 聊天输入框 / 安装区 CTA / 底部 dock / 备用直链
 *  2) 弹窗内「开始下载」  → Purchase（并发起跳转）
 *
 *  其余按钮（FAQ / 取消 / 关闭 / 菜单）不触发，这是故意的。
 *  每个入口都会带一个 source，方便在事件管理器里看哪个入口转化最好。
 * ────────────────────────────────────────────────────────────────
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

type Fbq = (...args: unknown[]) => void

let injected = false
let currentId = ''

const active = (pixelId: string): boolean => Boolean(pixelId && pixelId.trim())

/** 控制台自检：在浏览器 Console 里看事件是否真的发出去了 */
const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV

/** 动态注入 Pixel 脚本。ID 变化时会重新 init。 */
export function initPixel(pixelId: string) {
  if (typeof window === 'undefined') return
  const id = pixelId.trim()
  if (!active(id)) return

  if (!injected) {
    const fbq: Fbq = function (...args: unknown[]) {
      const q = (fbq as unknown as { queue?: unknown[] }).queue
      if (q) q.push(args)
    }
    ;(fbq as unknown as { queue: unknown[] }).queue = []
    ;(fbq as unknown as { loaded: boolean }).loaded = true

    window.fbq = fbq
    window._fbq = fbq

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
    injected = true
  }

  if (currentId === id) return
  currentId = id
  window.fbq?.('init', id)
  window.fbq?.('track', 'PageView')

  if (isDev) console.info('[pixel] init', id)
}

/** 埋点：只从下面两个白名单入口调用 */
export function trackLead(
  pixelId: string,
  event: 'InitiateCheckout' | 'Purchase',
  source: string,
) {
  if (typeof window === 'undefined') return

  if (!active(pixelId)) {
    if (isDev) console.warn('[pixel] 未配置 Pixel ID，事件被跳过：', event, source)
    return
  }
  if (typeof window.fbq !== 'function') {
    if (isDev) console.warn('[pixel] fbq 尚未就绪，事件被跳过：', event, source)
    return
  }

  window.fbq('track', event, {
    content_name: source,
    content_category: 'app_download',
    currency: 'USD',
    value: 0,
  })

  if (isDev) console.info('[pixel] 已上报', event, '←', source)
}

/** 外层按钮：所有「下载」入口统一走这里 → InitiateCheckout */
export function trackOuter(pixelId: string, source: string) {
  trackLead(pixelId, 'InitiateCheckout', source)
}

/**
 * 弹窗内按钮：先上报，再跳转。
 *
 * 跳转会打断尚未发出的请求，所以：
 *  - 先触发 Purchase
 *  - 再等一小段时间让 fbevents 把请求送出去
 *  - 然后用一个 a[download] 点击去下载（比 location.href 更不容易被拦截）
 */
export function trackInnerAndGo(pixelId: string, apkUrl: string, source = 'dl_inner_modal') {
  const go = () => {
    if (!apkUrl) return
    const a = document.createElement('a')
    a.href = apkUrl
    a.rel = 'noopener'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (!active(pixelId)) {
    go()
    return
  }

  trackLead(pixelId, 'Purchase', source)
  window.setTimeout(go, 400)
}
