import { useId } from 'react'
import { useConfig } from '../config/store'
import { fill, safeImageUrl } from '../lib/format'

type IconProps = {
  className?: string
}

/** 应用图标：控制台填了链接就显示图片，否则显示占位 */
export function AppIcon({ className = 'h-14 w-14' }: IconProps) {
  const { config } = useConfig()
  const id = useId()
  const src = safeImageUrl(config.brand.iconUrl)
  const name = config.brand.name.trim()
  const ui = config.ui

  if (src) {
    return (
      <img
        src={src}
        alt={name ? fill(ui.appIconAlt, { name }) : ui.appIconPlaceholder}
        loading="lazy"
        decoding="async"
        className={`${className} rounded-2xl object-cover ring-1 ring-white/15`}
      />
    )
  }

  return (
    <div
      className={`${className} relative grid place-items-center overflow-hidden rounded-2xl border border-dashed border-white/25 bg-white/[0.04]`}
      role="img"
      aria-label={name ? fill(ui.appIconAlt, { name }) : ui.appIconPlaceholder}
    >
      <svg viewBox="0 0 48 48" className="h-1/2 w-1/2 text-white/35" aria-hidden="true">
        <defs>
          <linearGradient id={`ic-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--c-wine)" />
            <stop offset="100%" stopColor="var(--c-blush)" />
          </linearGradient>
        </defs>
        <rect
          x="9"
          y="9"
          width="30"
          height="30"
          rx="8"
          fill="none"
          stroke={`url(#ic-${id})`}
          strokeWidth="2"
          strokeDasharray="5 4"
        />
        <path d="M20 18.5 31 24l-11 5.5v-11Z" fill={`url(#ic-${id})`} opacity="0.8" />
      </svg>
    </div>
  )
}

/** 应用名称 */
export function AppName({ className = '' }: IconProps) {
  const { config } = useConfig()
  const name = config.brand.name.trim()
  const ui = config.ui

  if (name) {
    return <span className={`font-semibold tracking-tight ${className}`}>{name}</span>
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border border-dashed border-white/25 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45 ${className}`}
      title={ui.appNamePlaceholderHint}
    >
      {ui.appNamePlaceholder}
    </span>
  )
}

/** 名字 + 副标题的组合 */
export function BrandText({ nameClass = 'text-[13px]' }: { nameClass?: string }) {
  const { config } = useConfig()
  return (
    <div className="leading-none">
      <AppName className={nameClass} />
      {config.brand.tagline && (
        <p className="mt-1 text-[9.5px] font-medium uppercase tracking-[0.24em] text-white/30">
          {config.brand.tagline}
        </p>
      )}
    </div>
  )
}

/** 顶部横向品牌组合 */
export function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <AppIcon className="h-9 w-9" />
      <BrandText nameClass="text-[13px]" />
    </div>
  )
}
