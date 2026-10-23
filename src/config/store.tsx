import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_BRAND,
  DEFAULT_BUTTONS,
  DEFAULT_CHAT,
  DEFAULT_CHAT_COPY,
  DEFAULT_DOWNLOAD,
  DEFAULT_FAQS,
  DEFAULT_FOOTER,
  DEFAULT_GATES,
  DEFAULT_HERO,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_HIGHLIGHTS_COPY,
  DEFAULT_HOW_COPY,
  DEFAULT_INSTALL_COPY,
  DEFAULT_INSTALL_STEPS,
  DEFAULT_MODAL_COPY,
  DEFAULT_NAV,
  DEFAULT_NEARBY_COPY,
  DEFAULT_PEOPLE,
  DEFAULT_SAFETY,
  DEFAULT_STEPS,
  DEFAULT_THEME,
  type BrandConfig,
  type ButtonCopy,
  type DownloadConfig,
  type FaqItem,
  type FooterGroup,
  type GateEntry,
  type HighlightsConfig,
  type InstallStep,
  type SafetyPoint,
  type StepItem,
  type ThemeConfig,
} from './defaults'
import { DEFAULT_VIDEOS, type VideoItem } from './videos'
import { hexToRgbChannels } from '../lib/format'
import type {
  ChatStory,
  HeroSlide,
  HighlightItem,
  NavItem,
  PersonCard,
} from './types'

export type SiteConfig = {
  brand: BrandConfig
  download: DownloadConfig
  theme: ThemeConfig
  nav: NavItem[]
  buttons: ButtonCopy
  hero: typeof DEFAULT_HERO
  heroSlides: HeroSlide[]
  highlightsCopy: HighlightsConfig
  highlights: HighlightItem[]
  nearbyCopy: typeof DEFAULT_NEARBY_COPY
  people: PersonCard[]
  howCopy: typeof DEFAULT_HOW_COPY
  steps: StepItem[]
  chatCopy: typeof DEFAULT_CHAT_COPY
  chat: ChatStory[]
  installCopy: typeof DEFAULT_INSTALL_COPY
  installSteps: InstallStep[]
  safety: SafetyPoint[]
  faqs: FaqItem[]
  modalCopy: typeof DEFAULT_MODAL_COPY
  gates: Record<string, GateEntry>
  footer: { about: string; groups: FooterGroup[]; dockNote: string }
  videos: VideoItem[]
}

export const DEFAULT_CONFIG: SiteConfig = {
  brand: DEFAULT_BRAND,
  download: DEFAULT_DOWNLOAD,
  theme: DEFAULT_THEME,
  nav: DEFAULT_NAV,
  buttons: DEFAULT_BUTTONS,
  hero: DEFAULT_HERO,
  heroSlides: DEFAULT_HERO_SLIDES,
  highlightsCopy: DEFAULT_HIGHLIGHTS_COPY,
  highlights: DEFAULT_HIGHLIGHTS,
  nearbyCopy: DEFAULT_NEARBY_COPY,
  people: DEFAULT_PEOPLE,
  howCopy: DEFAULT_HOW_COPY,
  steps: DEFAULT_STEPS,
  chatCopy: DEFAULT_CHAT_COPY,
  chat: DEFAULT_CHAT,
  installCopy: DEFAULT_INSTALL_COPY,
  installSteps: DEFAULT_INSTALL_STEPS,
  safety: DEFAULT_SAFETY,
  faqs: DEFAULT_FAQS,
  modalCopy: DEFAULT_MODAL_COPY,
  gates: DEFAULT_GATES,
  footer: DEFAULT_FOOTER,
  videos: DEFAULT_VIDEOS,
}

const STORAGE_KEY = 'nightyle.config.v1'

/**
 * 深合并：保证新增字段能从默认值补上，
 * 用户存过的旧数据结构不会因为升级而缺键。
 */
function merge<T>(base: T, patch: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(patch) ? patch : base) as T
  }
  if (base && typeof base === 'object') {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return base
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const key of Object.keys(base as Record<string, unknown>)) {
      const b = (base as Record<string, unknown>)[key]
      const p = (patch as Record<string, unknown>)[key]
      out[key] = p === undefined ? b : merge(b, p)
    }
    return out as T
  }
  if (patch === undefined || patch === null) return base
  if (typeof patch !== typeof base) return base
  return patch as T
}

function loadConfig(): SiteConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG
    return merge(DEFAULT_CONFIG, JSON.parse(raw))
  } catch {
    return DEFAULT_CONFIG
  }
}

type Store = {
  config: SiteConfig
  /** 深路径更新，例如 set('brand.name', 'xx') */
  set: (path: string, value: unknown) => void
  update: (patch: Partial<SiteConfig>) => void
  reset: () => void
  resetSection: (key: keyof SiteConfig) => void
  replaceAll: (next: SiteConfig) => void
  exportJson: () => string
  importJson: (raw: string) => { ok: boolean; error?: string }
  dirty: boolean
}

const ConfigContext = createContext<Store | null>(null)

function setPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.')
  const clone: any = Array.isArray(obj) ? [...(obj as any)] : { ...(obj as any) }
  let cursor = clone
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = keys[i]
    const nextSource = cursor[k]
    cursor[k] = Array.isArray(nextSource) ? [...nextSource] : { ...nextSource }
    cursor = cursor[k]
  }
  cursor[keys[keys.length - 1]] = value
  return clone as T
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(loadConfig)

  /** 持久化（失败不影响页面，只可能是隐私模式） */
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      /* ignore quota / private mode */
    }
  }, [config])

  /** 同步页签标题与描述 */
  useEffect(() => {
    if (config.brand.docTitle) document.title = config.brand.docTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta && config.brand.docDescription) {
      meta.setAttribute('content', config.brand.docDescription)
    }
  }, [config.brand.docTitle, config.brand.docDescription])

  const set = useCallback((path: string, value: unknown) => {
    setConfig((prev) => setPath(prev, path, value))
  }, [])

  const update = useCallback((patch: Partial<SiteConfig>) => {
    setConfig((prev) => merge(prev, patch))
  }, [])

  const reset = useCallback(() => {
    setConfig(DEFAULT_CONFIG)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const resetSection = useCallback((key: keyof SiteConfig) => {
    setConfig((prev) => ({ ...prev, [key]: DEFAULT_CONFIG[key] }))
  }, [])

  const replaceAll = useCallback((next: SiteConfig) => {
    setConfig(merge(DEFAULT_CONFIG, next))
  }, [])

  const exportJson = useCallback(() => JSON.stringify(config, null, 2), [config])

  const importJson = useCallback((raw: string) => {
    try {
      const parsed = JSON.parse(raw)
      if (!parsed || typeof parsed !== 'object') {
        return { ok: false, error: '内容不是一个对象' }
      }
      setConfig(merge(DEFAULT_CONFIG, parsed))
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'JSON 解析失败' }
    }
  }, [])

  const dirty = useMemo(
    () => JSON.stringify(config) !== JSON.stringify(DEFAULT_CONFIG),
    [config],
  )

  const value = useMemo<Store>(
    () => ({
      config,
      set,
      update,
      reset,
      resetSection,
      replaceAll,
      exportJson,
      importJson,
      dirty,
    }),
    [config, set, update, reset, resetSection, replaceAll, exportJson, importJson, dirty],
  )

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

export function useConfig(): Store {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig 必须在 ConfigProvider 内使用')
  return ctx
}

/**
 * 主题落地：把配置里的颜色写进 CSS 变量，
 * 页面所有组件读 var(--...) 就自动跟着变。
 *
 * 每个颜色写两份：
 *   --c-xxx      hex，用于渐变、SVG 等直接取值
 *   --c-xxx-rgb  通道，供 Tailwind 的 /60 透明度修饰使用
 */
export function themeVars(theme: ThemeConfig): Record<string, string> {
  const hex = {
    '--c-bg': theme.bg,
    '--c-surface': theme.surface,
    '--c-text': theme.text,
    '--c-muted': theme.muted,
    '--c-wine': theme.wine,
    '--c-copper': theme.copper,
    '--c-blush': theme.blush,
  }
  const vars: Record<string, string> = { ...hex }
  Object.entries(hex).forEach(([k, v]) => {
    vars[`${k}-rgb`] = hexToRgbChannels(v)
  })
  return vars
}
