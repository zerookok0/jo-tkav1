import { useEffect, useState } from 'react'
import { ArrowUpRight, Download, Moon, MapPin, ShieldCheck } from 'lucide-react'
import { PhoneMockup } from './PhoneMockup'
import { HERO_SLIDES, type GateAction } from '../data/site'

type Props = {
  onDownload: () => void
  onGate: (a: GateAction) => void
}

const ROTATE_MS = 8000

export function Hero({ onDownload, onGate }: Props) {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const t = window.setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length)
    }, ROTATE_MS)
    return () => window.clearInterval(t)
  }, [paused])

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-28 lg:pt-32">
      {/* 顶部暖光 */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 opacity-70 blur-[100px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(150,40,52,0.42) 0%, rgba(124,27,44,0.14) 42%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          {/* ─────────── 左：文案 ─────────── */}
          <div className="relative z-10 mx-auto max-w-[560px] text-center lg:mx-0 lg:text-left">
            {/* 深夜状态条 */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-cream/[0.09] bg-cream/[0.035] px-3.5 py-2 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-blush" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blush" />
              </span>
              <span className="text-[12px] font-medium tracking-wide text-cream/60">
                现在 <span className="font-semibold text-cream">01:24</span> · 你附近还有{' '}
                <span className="font-semibold text-cream">1,284</span> 个人没睡
              </span>
            </div>

            {/* 轮播文案 */}
            <div
              className="mt-7 min-h-[236px] sm:min-h-[254px]"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-live="polite"
            >
              {HERO_SLIDES.map((s, i) => {
                const isActive = i === slide
                return (
                  <div
                    key={s.title}
                    aria-hidden={!isActive}
                    className={`transition-all duration-700 ${
                      isActive
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none absolute translate-y-2 opacity-0'
                    }`}
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-copper/75">
                      {s.kicker}
                    </p>

                    <h1 className="mt-4 text-balance text-[clamp(1.95rem,5.6vw,3.05rem)] font-semibold leading-[1.28] tracking-[-0.01em] text-cream">
                      {s.title}
                    </h1>

                    <p className="mx-auto mt-4 max-w-[470px] text-[15px] leading-[1.9] text-cream/55 sm:text-[16px] lg:mx-0">
                      {s.sub}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* 轮播点 */}
            <div className="mt-2 flex items-center justify-center gap-2 lg:justify-start">
              {HERO_SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setSlide(i)}
                  aria-label={`切换到第 ${i + 1} 条文案`}
                  aria-current={i === slide}
                  className="relative h-[3px] overflow-hidden rounded-full bg-cream/12 transition-all duration-300"
                  style={{ width: i === slide ? 40 : 18 }}
                >
                  {i === slide && (
                    <span
                      key={`${slide}-${paused}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-wine via-blush to-copper"
                      style={{
                        animation: paused ? 'none' : `hero-bar ${ROTATE_MS}ms linear forwards`,
                        width: paused ? '100%' : undefined,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <button type="button" onClick={onDownload} className="btn-primary group">
                <Download className="h-4 w-4" />
                进来看一眼
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
              <a href="#nearby" className="btn-ghost">
                <Moon className="h-4 w-4" />
                先看看有谁
              </a>
            </div>

            {/* 信任行 */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[11.5px] text-cream/32 lg:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-copper/60" />
                三公里内 · 不跨城
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-copper/60" />
                可匿名出镜 · 声音可变
              </span>
              <span className="rounded-full border border-cream/15 px-2 py-[1px] text-[10px] font-bold tracking-wide">
                18+
              </span>
            </div>
          </div>

          {/* ─────────── 右：手机 ─────────── */}
          <div className="relative z-0">
            <div className="animate-fade-up">
              <PhoneMockup onGate={onGate} />
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[12.5px] leading-relaxed text-cream/28">
          上面是真的界面 —— 直接上下滑。看到第几条会忍不住，我们也不知道
        </p>
      </div>
    </section>
  )
}
