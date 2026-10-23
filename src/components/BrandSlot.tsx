import { useId } from 'react'
import { APP_ICON_URL, APP_NAME } from '../data/site'

type IconProps = {
  className?: string
}

/**
 * 应用图标占位。把真实图标链接填到 src/data/site.ts 里的
 * APP_ICON_URL，这里会自动换成图片。
 */
export function AppIcon({ className = 'h-14 w-14' }: IconProps) {
  const id = useId()

  if (APP_ICON_URL) {
    return (
      <img
        src={APP_ICON_URL}
        alt={APP_NAME || '应用图标'}
        className={`${className} rounded-2xl object-cover ring-1 ring-white/15`}
      />
    )
  }

  return (
    <div
      className={`${className} relative grid place-items-center overflow-hidden rounded-2xl border border-dashed border-white/25 bg-white/[0.04]`}
      role="img"
      aria-label="应用图标占位"
    >
      <svg viewBox="0 0 48 48" className="h-1/2 w-1/2 text-white/35" aria-hidden="true">
        <defs>
          <linearGradient id={`ic-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#F472B6" />
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

/**
 * 应用名称。把名字填到 src/data/site.ts 里的 APP_NAME。
 */
export function AppName({ className = '' }: IconProps) {
  if (APP_NAME) {
    return <span className={`font-semibold tracking-tight ${className}`}>{APP_NAME}</span>
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border border-dashed border-white/25 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/45 ${className}`}
      title="在 src/data/site.ts 里填入 APP_NAME"
    >
      应用名称
    </span>
  )
}

/** 顶部横向品牌组合 */
export function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <AppIcon className="h-9 w-9" />
      <div className="leading-none">
        <AppName className="text-[13px]" />
        <p className="mt-1 text-[9.5px] font-medium uppercase tracking-[0.24em] text-white/30">
          附近短视频
        </p>
      </div>
    </div>
  )
}
