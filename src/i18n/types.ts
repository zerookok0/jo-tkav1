/**
 * 语言定义。
 *
 * 中文是主库（控制台里改的那份），英/阿只是「覆盖层」——
 * 它们不需要完整，缺什么就自动回落到中文。
 */

export const LOCALES = ['zh', 'en', 'ar'] as const

export type Locale = (typeof LOCALES)[number]

export type LocaleMeta = {
  code: Locale
  /** 该语言的自称，切换菜单里显示 */
  label: string
  /** 切换按钮上的短码 */
  short: string
  /** <html lang="…"> */
  htmlLang: string
  dir: 'ltr' | 'rtl'
  /** og:locale */
  ogLocale: string
  /** Intl 用的 BCP 47。阿语强制拉丁数字，避免与西文数字混排时忽大忽小 */
  intl: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  zh: {
    code: 'zh',
    label: '简体中文',
    short: '中',
    htmlLang: 'zh-CN',
    dir: 'ltr',
    ogLocale: 'zh_CN',
    intl: 'zh-CN',
  },
  en: {
    code: 'en',
    label: 'English',
    short: 'EN',
    htmlLang: 'en',
    dir: 'ltr',
    ogLocale: 'en_US',
    intl: 'en-US',
  },
  ar: {
    code: 'ar',
    label: 'العربية',
    short: 'ع',
    htmlLang: 'ar',
    dir: 'rtl',
    ogLocale: 'ar_AR',
    intl: 'ar-u-nu-latn',
  },
}

/** 认不出用户语言时用哪个 */
export const FALLBACK_LOCALE: Locale = 'zh'

export const isLocale = (v: unknown): v is Locale =>
  typeof v === 'string' && (LOCALES as readonly string[]).includes(v)

/**
 * 浏览器语言 → 站点语言。
 *
 * 只看主语言标签（zh-CN、ar-EG、en-GB 都能认），
 * 用户手动切过之后就以手动为准（存在 localStorage）。
 */
export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return FALLBACK_LOCALE

  const list =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language]

  for (const raw of list) {
    const tag = String(raw || '').toLowerCase().trim()
    if (!tag) continue
    const base = tag.split('-')[0]
    if (isLocale(base)) return base
  }

  return FALLBACK_LOCALE
}
