export const formatCount = (n: number): string => {
  if (!Number.isFinite(n)) return '0'
  if (n >= 10000) {
    const v = n / 10000
    return `${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')}w`
  }
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export const formatDistance = (km: number): string => {
  if (!Number.isFinite(km) || km <= 0) return '0m'
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

export const formatMeters = (m: number): string => {
  if (!Number.isFinite(m) || m <= 0) return '0m'
  return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`
}

/**
 * 模板填充：fill('距你 {distance}', { distance: '320m' })
 *
 * 为什么不直接字符串拼接：英文、阿拉伯语的词序和中文不同，
 * 把变量位置写死在模板里，翻译时才不用改代码。
 * 找不到的占位符原样保留，方便发现漏翻的键。
 */
export const fill = (tpl: string, vars: Record<string, string | number>): string =>
  tpl.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in vars ? String(vars[key]) : whole,
  )

/** 新增列表项时用的短 id */
export const uid = (prefix = 'id'): string =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** #RRGGBB → "r g b"，给 CSS 变量用 */
export const hexToRgbChannels = (hex: string): string => {
  const clean = hex.replace('#', '').trim()
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0').slice(0, 6)
  const int = parseInt(full, 16)
  if (Number.isNaN(int)) return '124 27 44'
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`
}

/** 相对亮度，用于自动选择文字颜色 */
export const luminance = (hex: string): number => {
  const [r, g, b] = hexToRgbChannels(hex)
    .split(' ')
    .map((v) => Number(v) / 255)
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return clamp(0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b), 0, 1)
}

/** 十六进制合法校验 */
export const isHex = (v: string): boolean => /^#?[0-9a-fA-F]{6}$/.test(v.trim())

export const normalizeHex = (v: string): string => {
  const t = v.trim()
  if (!t.startsWith('#')) return `#${t.toUpperCase()}`
  return t.toUpperCase()
}

/** 只保留 http(s) 或 data:image，避免控制台里粘错协议把页面搞崩 */
export const safeImageUrl = (v: string): string => {
  const t = v.trim()
  if (!t) return ''
  if (/^(https?:\/\/|data:image\/)/i.test(t)) return t
  return ''
}
