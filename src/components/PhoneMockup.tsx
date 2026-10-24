import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Bookmark,
  ChevronUp,
  Download,
  Heart,
  MapPin,
  MessageCircle,
  Music2,
  Play,
  Share2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { AppIcon, AppName } from './BrandSlot'
import { useConfig } from '../config/store'
import type { GateKey } from '../config/defaults'
import { fill, formatCount, formatDistance, safeImageUrl } from '../lib/format'
import { useClock } from '../lib/clock'
import type { VideoItem } from '../config/videos'

type Props = {
  /** 点手机里的点赞/评论等 → 打开拦截弹窗 */
  onGate: (a: GateKey) => void
}

export function PhoneMockup({ onGate }: Props) {
  const { config } = useConfig()
  const videos = config.videos
  const ui = config.ui
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const [gate, setGate] = useState<GateKey | null>(null)
  const [burst, setBurst] = useState(false)
  const lastTap = useRef(0)
  /** 与首屏状态条共用同一份时钟快照 —— 两处永远显示同一分钟 */
  const now = useClock()

  /** 滚动 → 计算当前是第几条 */
  const handleScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const next = Math.round(el.scrollTop / el.clientHeight)
    setIndex((prev) => (prev === next ? prev : next))
  }, [])

  /** 双击爱心 */
  const handleDoubleClick = useCallback(() => {
    const now = Date.now()
    if (now - lastTap.current < 320) {
      setBurst(true)
      window.setTimeout(() => setBurst(false), 900)
      window.setTimeout(() => setGate('like'), 380)
    }
    lastTap.current = now
  }, [])

  const current = videos[Math.min(index, Math.max(videos.length - 1, 0))]

  /** 手机下方小字：预览说明 + 可选的距离 */
  const previewNote = current
    ? `${ui.previewLabel} · ${fill(ui.previewDistance, {
        distance: formatDistance(current.distanceKm),
      })}`
    : ui.previewLabel

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      {/* 手机背后的光晕 */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-brand/20 blur-[80px]" />
      <div className="pointer-events-none absolute inset-x-8 bottom-10 -z-10 h-40 rounded-full bg-accent/10 blur-[70px]" />

      {/* 机身 */}
      <div className="relative rounded-[54px] bg-gradient-to-b from-[#4a4a52] via-[#1e1e22] to-[#3a3a42] p-[2px] shadow-device ring-1 ring-white/10">
        <div className="rounded-[52px] bg-gradient-to-b from-[#2c2c32] to-[#141416] p-[9px]">
          {/* 侧键 */}
          <span className="absolute -left-[3px] top-[132px] h-9 w-[3px] rounded-l bg-white/15" />
          <span className="absolute -left-[3px] top-[186px] h-14 w-[3px] rounded-l bg-white/15" />
          <span className="absolute -left-[3px] top-[252px] h-14 w-[3px] rounded-l bg-white/15" />
          <span className="absolute -right-[3px] top-[200px] h-20 w-[3px] rounded-r bg-white/15" />

          <div className="relative overflow-hidden rounded-[44px] bg-black">
            {/* 灵动岛 */}
            <div className="pointer-events-none absolute left-1/2 top-2 z-40 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black">
              <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#1b2a3a] ring-1 ring-[#2b3f56]" />
            </div>

            {/* 状态栏 */}
            <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pb-2 pt-[13px] text-[11px] font-semibold text-white">
              <span className="tracking-tight">{now}</span>
              <div className="flex items-center gap-1.5">
                <span className="flex items-end gap-[2px]">
                  <i className="block h-[4px] w-[2px] rounded-sm bg-white/90" />
                  <i className="block h-[6px] w-[2px] rounded-sm bg-white/90" />
                  <i className="block h-[8px] w-[2px] rounded-sm bg-white/90" />
                  <i className="block h-[10px] w-[2px] rounded-sm bg-white/40" />
                </span>
                <svg viewBox="0 0 16 12" className="h-[10px] w-[13px]" aria-hidden="true">
                  <path
                    d="M8 10.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm0-4.4c1.2 0 2.3.45 3.1 1.2M8 1.6c2.4 0 4.5.9 6.1 2.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="relative ml-0.5 flex h-[11px] w-[22px] items-center rounded-[3px] border border-white/60 p-[1.5px]">
                  <span className="h-full w-[70%] rounded-[1px] bg-white" />
                  <span className="absolute -right-[3px] top-1/2 h-[4px] w-[2px] -translate-y-1/2 rounded-r bg-white/60" />
                </span>
              </div>
            </div>

            {/* 屏幕 */}
            <div className="relative aspect-[9/19.1] w-full">
              <div
                ref={scrollerRef}
                onScroll={handleScroll}
                onDoubleClick={handleDoubleClick}
                tabIndex={0}
                role="region"
                aria-label={ui.feedRegionAria}
                className="hide-scrollbar snap-y-mandatory absolute inset-0 overflow-y-auto overscroll-contain"
              >
                {videos.length === 0 ? (
                  <EmptyFeed />
                ) : (
                  videos.map((item, i) => (
                    <FeedCard
                      key={item.id}
                      item={item}
                      index={i}
                      active={i === index}
                      muted={muted}
                      badge18={config.hero.badge18}
                      onToggleMute={() => setMuted((m) => !m)}
                      onGate={setGate}
                    />
                  ))
                )}

                {/* 结尾卡 */}
                <EndCard onDownload={() => onGate('default')} />
              </div>

              {/* 顶部标签栏 */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-center gap-5 pt-9">
                {config.hero.tabs.map((tab, i) => (
                  <span
                    key={`${tab}-${i}`}
                    className={`relative text-[13px] transition ${
                      i === 0 ? 'font-semibold text-white' : 'font-medium text-white/55'
                    }`}
                  >
                    {tab}
                    {i === 0 && (
                      <span className="absolute -bottom-1.5 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-white" />
                    )}
                  </span>
                ))}
              </div>

              {/* 滑动提示 */}
              <div
                className={`pointer-events-none absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-500 ${
                  index === 0 && !gate ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <ChevronUp className="h-4 w-4 animate-float text-white/80" />
                <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] tracking-wide text-white/80 backdrop-blur">
                  {config.hero.swipeHint}
                </span>
              </div>

              {/* 序号 */}
              <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 text-[10px] font-medium tracking-[0.2em] text-white/45">
                {String(index + 1).padStart(2, '0')} /{' '}
                {String(Math.max(videos.length, 1)).padStart(2, '0')}
              </div>

              {/* 双击爱心 */}
              {burst && (
                <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center">
                  <Heart className="h-24 w-24 animate-heart-pop fill-accent text-accent drop-shadow-[0_0_30px_rgba(244,114,182,0.7)]" />
                </div>
              )}

              {/* 拦截弹窗 */}
              <GateSheet action={gate} onClose={() => setGate(null)} onDownload={onGate} />

              {/* home 指示条 */}
              <div className="pointer-events-none absolute bottom-1 left-1/2 z-30 h-[3px] w-24 -translate-x-1/2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* 手机下方的小字 */}
      <p className="mt-5 flex items-center justify-center gap-2 text-[11.5px] text-white/40">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-mint" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
        </span>
        {previewNote}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function EmptyFeed() {
  const { config } = useConfig()
  return (
    <div className="snap-start-always flex h-full w-full flex-col items-center justify-center gap-3 bg-[#0c0c0e] px-8 text-center">
      <Music2 className="h-6 w-6 text-white/25" />
      <p className="text-[13px] text-white/45">{config.ui.emptyFeedTitle}</p>
      <p className="text-[11px] leading-relaxed text-white/25">{config.ui.emptyFeedBody}</p>
    </div>
  )
}

function FeedCard({
  item,
  index,
  active,
  muted,
  badge18,
  onToggleMute,
  onGate,
}: {
  item: VideoItem
  index: number
  active: boolean
  muted: boolean
  badge18: string
  onToggleMute: () => void
  onGate: (a: GateKey) => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const ui = useConfig().config.ui
  const poster = safeImageUrl(item.poster)
  const avatar = safeImageUrl(item.avatar)

  /** 只让当前这条播放 */
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (active) {
      const p = el.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } else {
      el.pause()
      el.currentTime = 0
    }
  }, [active])

  return (
    <article className="snap-start-always relative h-full w-full overflow-hidden bg-[#0c0c0e]">
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
      )}

      {item.src ? (
        <video
          ref={videoRef}
          src={item.src}
          poster={poster || undefined}
          muted={muted}
          loop
          playsInline
          preload={index < 2 ? 'metadata' : 'none'}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink to-ink/60">
          <span className="text-[11px] text-white/25">{ui.videoMissingSrc}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/85" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent" />

      {item.badge && (
        <div className="absolute start-4 top-[76px] z-20 inline-flex items-center gap-1 rounded-full bg-wine/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-glow">
          <MapPin className="h-3 w-3" />
          {item.badge}
        </div>
      )}

      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? ui.unmute : ui.mute}
        className="absolute end-3 top-[74px] z-20 grid h-8 w-8 place-items-center rounded-full bg-black/35 text-white/85 backdrop-blur transition hover:bg-black/55"
      >
        {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      </button>

      {/* 操作栏 */}
      <div className="absolute bottom-16 end-2.5 z-20 flex flex-col items-center gap-5">
        <ActionButton
          icon={<Heart className="h-7 w-7 fill-white text-white" />}
          label={formatCount(item.likes)}
          onClick={() => onGate('like')}
          ariaLabel={ui.likeAria}
        />
        <ActionButton
          icon={<MessageCircle className="h-7 w-7 fill-white text-white" />}
          label={formatCount(item.comments)}
          onClick={() => onGate('comment')}
          ariaLabel={ui.commentAria}
        />
        <ActionButton
          icon={<Bookmark className="h-6 w-6 fill-white text-white" />}
          label={formatCount(item.saves)}
          onClick={() => onGate('save')}
          ariaLabel={ui.saveAria}
        />
        <ActionButton
          icon={<Share2 className="h-6 w-6 fill-white text-white" />}
          label={formatCount(item.shares)}
          onClick={() => onGate('share')}
          ariaLabel={ui.shareAria}
        />
        <div className="relative mt-1 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#3a3a42] to-[#111] ring-1 ring-white/25">
          <div className="animate-spin-slow absolute inset-0 rounded-full bg-gradient-to-tr from-brand/60 via-transparent to-accent/60" />
          <div className="relative grid h-8 w-8 place-items-center rounded-full bg-[#1b1b1f]">
            <Music2 className="h-3.5 w-3.5 text-white/90" />
          </div>
          <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-white">
            +
          </span>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="absolute inset-x-0 bottom-8 z-20 pe-16 ps-3.5">
        <div className="flex items-center gap-2">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              aria-hidden="true"
              className="h-7 w-7 rounded-full object-cover ring-2 ring-white/70"
              loading="lazy"
            />
          ) : (
            <span className="h-7 w-7 rounded-full bg-white/20 ring-2 ring-white/40" />
          )}
          <span className="text-[13px] font-semibold text-white">{item.name}</span>
          {badge18 && (
            <span className="rounded-full border border-white/25 px-1.5 py-[1px] text-[9px] font-medium text-white/75">
              {badge18}
            </span>
          )}
          <span className="ms-auto rounded-full bg-black/40 px-2 py-[2px] text-[10px] text-white/80 backdrop-blur">
            {formatDistance(item.distanceKm)}
          </span>
        </div>

        {item.caption && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-white/95">
            {item.caption}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          {item.tags.filter(Boolean).map((tag, ti) => (
            <span key={`${tag}-${ti}`} className="text-[12px] font-medium text-white/85">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/60">
          <Music2 className="h-3 w-3" />
          <span className="truncate">{item.music}</span>
          {item.postedAt && <span className="text-white/25">·</span>}
          <span className="shrink-0">{item.postedAt}</span>
        </div>
      </div>
    </article>
  )
}

function ActionButton({
  icon,
  label,
  onClick,
  ariaLabel,
}: {
  icon: JSX.Element
  label: string
  onClick: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="group flex flex-col items-center gap-1 transition active:scale-90"
    >
      <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:text-accent group-hover:[&>svg]:fill-accent">
        {icon}
      </span>
      <span className="text-[11px] font-semibold text-white/90">{label}</span>
    </button>
  )
}

/* ------------------------------------------------------------------ */

function EndCard({ onDownload }: { onDownload: () => void }) {
  const { config } = useConfig()
  const b = config.buttons
  const ui = config.ui

  return (
    <div className="snap-start-always relative flex h-full w-full flex-col items-center justify-center gap-5 overflow-hidden bg-[#0c0c0e] px-7 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(139,92,246,0.3),transparent_62%)]" />

      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05]">
        <Play className="h-6 w-6 fill-white text-white" />
      </div>

      <div className="relative">
        <p className="text-[21px] font-semibold leading-snug text-white">{b.phoneEndTitle}</p>
        <p className="mt-2.5 whitespace-pre-line text-[14px] leading-relaxed text-white/60">
          {b.phoneEndBody}
        </p>
      </div>

      <button
        type="button"
        onClick={onDownload}
        className="relative inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14.5px] font-bold text-black transition hover:scale-[1.03] active:scale-95"
      >
        <Download className="h-4 w-4" />
        {b.phoneEndCta}
      </button>

      {config.hero.badge18 && (
        <p className="relative text-[10px] uppercase tracking-[0.24em] text-white/30">
          {fill(ui.ageOnly, { age: config.hero.badge18 })}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function GateSheet({
  action,
  onClose,
  onDownload,
}: {
  action: GateKey | null
  onClose: () => void
  onDownload: (a: GateKey) => void
}) {
  const { config } = useConfig()
  const ui = config.ui
  if (!action) return null
  const copy = config.gates[action] ?? config.gates.default

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label={ui.close}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-[3px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        className="relative animate-sheet-up rounded-t-[26px] border-t border-white/12 bg-[#171719]/96 px-5 pb-5 pt-3 backdrop-blur-xl"
      >
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-white/25" />
        <button
          type="button"
          onClick={onClose}
          aria-label={ui.closeDialog}
          className="absolute end-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {action === 'comment' ? (
          <div className="mb-4 space-y-2">
            {ui.commentSamples.map((sample, si) => (
              <div key={`${sample.name}-${si}`} className="flex items-start gap-2">
                <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-white/15" />
                <p className="text-[12px] leading-relaxed text-white/55">
                  <span className="font-semibold text-white/70">{sample.name}</span>{' '}
                  {sample.text}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-center gap-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/30">
              <span className="h-px w-8 bg-white/15" />
              {ui.moreComments}
              <span className="h-px w-8 bg-white/15" />
            </div>
          </div>
        ) : (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <AppIcon className="h-11 w-11" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <AppName className="!border-0 !bg-transparent !p-0 !text-[13px] !tracking-normal normal-case" />
                <span className="rounded-full bg-white/10 px-1.5 py-[1px] text-[9px] text-white/60">
                  {ui.officialBadge}
                </span>
              </div>
              <p className="mt-1 truncate text-[10.5px] text-white/45">{ui.appSummary}</p>
            </div>
          </div>
        )}

        <h3 className="text-[19px] font-semibold leading-snug text-white">{copy.title}</h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">{copy.sub}</p>

        <button
          type="button"
          onClick={() => onDownload(action)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-wine via-copper to-blush py-3.5 text-[14px] font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          {copy.cta}
        </button>

        <p className="mt-3 text-center text-[9.5px] leading-relaxed text-white/30">
          {ui.gateLegal}
        </p>
      </div>
    </div>
  )
}
