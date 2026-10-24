import type { SiteConfig } from '../config/store'
import { applyLocale } from './merge'
import { zh } from './messages/zh'
import { en } from './messages/en'
import { ar } from './messages/ar'
import type { Locale } from './types'

/**
 * 语言包登记处。
 *
 * 加一种语言只要三步：
 *   1. 在 types.ts 的 LOCALES 里加代码；
 *   2. 新建 messages/xx.ts 写覆盖层；
 *   3. 在下面这张表里登记。
 *
 * 覆盖层是「稀疏」的：没写到的字段自动用中文。
 */
export const MESSAGES: Record<Locale, unknown> = {
  zh,
  en,
  ar,
}

/**
 * 主库（中文，含控制台本次编辑）→ 目标语言。
 *
 * 注意这里是纯函数，不读 localStorage、不读浏览器语言：
 * 谁调用、用哪种语言，都由上层决定。
 */
export function localize(config: SiteConfig, locale: Locale): SiteConfig {
  if (locale === 'zh') return config
  return applyLocale(config, MESSAGES[locale])
}

/** 某种语言大概翻译了百分之多少（用来提醒还缺哪些区块） */
export function coverage(config: SiteConfig, locale: Locale): number {
  if (locale === 'zh') return 1
  const patch = MESSAGES[locale]
  if (!patch || typeof patch !== 'object') return 0

  const keys = Object.keys(config) as (keyof SiteConfig)[]
  const hit = keys.filter((k) => {
    const v = (patch as Record<string, unknown>)[k as string]
    if (v === undefined) return false
    if (Array.isArray(v)) return v.length > 0
    if (v && typeof v === 'object') return Object.keys(v).length > 0
    return true
  }).length

  return keys.length ? hit / keys.length : 0
}
