/**
 * ────────────────────────────────────────────────────────────────
 *  Facebook Pixel  ·  只有两个按钮会触发
 * ────────────────────────────────────────────────────────────────
 *  外层「下载」按钮 → InitiateCheckout
 *  弹窗内「开始下载」 → Purchase
 *  其余按钮（点赞/评论/收藏/分享/FAQ/取消/关闭）一律不触发。
 *
 *  所有参数都从控制台配置里传入，不再依赖编译期常量，
 *  所以在控制台改了 Pixel ID 或下载链接，立即生效。
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
}

/** 埋点：只从下面两个白名单入口调用 */
export function trackLead(
  pixelId: string,
  event: 'InitiateCheckout' | 'Purchase',
  source: string,
) {
  if (typeof window === 'undefined') return
  if (!active(pixelId) || typeof window.fbq !== 'function') return
  window.fbq('track', event, {
    content_name: source,
    content_category: 'app_download',
    currency: 'USD',
    value: 0,
  })
}

/** 外层按钮：所有「下载」入口统一走这里 → InitiateCheckout */
export function trackOuter(pixelId: string, source: string) {
  trackLead(pixelId, 'InitiateCheckout', source)
}

/**
 * 弹窗内按钮：先上报，再跳转。
 * 加一点延迟，避免页面跳走导致请求被打断、事件丢失。
 * 没填 Pixel 时直接跳转，不做任何请求。
 */
export function trackInnerAndGo(pixelId: string, apkUrl: string, source = 'dl_inner_modal') {
  const go = () => {
    if (apkUrl) window.location.href = apkUrl
  }
  if (!active(pixelId)) {
    go()
    return
  }
  trackLead(pixelId, 'Purchase', source)
  window.setTimeout(go, 320)
}
