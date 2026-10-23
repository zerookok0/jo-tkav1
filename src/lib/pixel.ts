import { FB_ENABLED, FB_PIXEL_ID, APK_URL } from '../data/site'

/**
 * ────────────────────────────────────────────────────────────────
 *  Facebook Pixel  ·  只有两个按钮会触发
 * ────────────────────────────────────────────────────────────────
 *  外层「下载」按钮 → InitiateCheckout
 *  弹窗内「开始下载」 → Purchase
 *  其余按钮（点赞/评论/收藏/分享/FAQ/取消/关闭）一律不触发。
 * ────────────────────────────────────────────────────────────────
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

type Fbq = (...args: unknown[]) => void

/** Pixel 是否真的可用（ID 为空则不加载、不发送） */
const active = (): boolean => Boolean(FB_ENABLED && FB_PIXEL_ID)

let injected = false

/** 动态注入 Pixel 脚本。重复调用安全。 */
export function initPixel() {
  if (typeof window === 'undefined') return
  if (!active() || injected) return
  injected = true

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

  window.fbq('init', FB_PIXEL_ID)
  window.fbq('track', 'PageView')
}

/** 埋点：只允许从下面两个白名单入口调用 */
export function trackLead(event: 'InitiateCheckout' | 'Purchase', source: string) {
  if (typeof window === 'undefined') return
  if (!active() || typeof window.fbq !== 'function') return
  window.fbq('track', event, {
    content_name: source,
    content_category: 'app_download',
    currency: 'USD',
    value: 0,
  })
}

/**
 * 外层按钮：所有「下载」入口统一走这里 → InitiateCheckout
 * source 只是用来在后台区分点的是哪个位置的按钮。
 */
export function trackOuter(source: string) {
  trackLead('InitiateCheckout', source)
}

/**
 * 弹窗内按钮：先上报，再跳转。
 * 加一点延迟，避免页面跳走导致请求被打断、事件丢失。
 */
export function trackInnerAndGo(source = 'dl_inner_modal') {
  if (!active()) {
    window.location.href = APK_URL
    return
  }
  trackLead('Purchase', source)
  window.setTimeout(() => {
    window.location.href = APK_URL
  }, 320)
}
