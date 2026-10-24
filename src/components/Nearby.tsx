import { ArrowUpRight, MapPin, MessageCircle } from 'lucide-react'
import { useConfig } from '../config/store'
import { fill, formatMeters, safeImageUrl } from '../lib/format'

type Props = {
  /** 点卡片 / 点「打个招呼」→ 打开下载弹窗 */
  onChat: () => void
}

export function Nearby({ onChat }: Props) {
  const { config } = useConfig()
  const { nearbyCopy, people, ui } = config

  return (
    <section id="nearby" className="relative py-16 sm:py-24">
      <div className="container-page">
        {/* 标题 */}
        <div className="reveal flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">{nearbyCopy.eyebrow}</p>
            <h2 className="mt-3.5 text-balance text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold leading-[1.3] tracking-[-0.01em] text-cream">
              {nearbyCopy.title}
            </h2>
            <p className="mt-3 max-w-[420px] text-[14px] leading-[1.85] text-cream/45">
              {nearbyCopy.sub}
            </p>
          </div>

          {nearbyCopy.liveNote && (
            <div className="flex items-center gap-2 rounded-full border border-cream/[0.09] bg-cream/[0.03] px-3.5 py-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-blush" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blush" />
              </span>
              <span className="text-[11.5px] tracking-wide text-cream/50">
                {nearbyCopy.liveNote}
              </span>
            </div>
          )}
        </div>

        {/* 卡片 */}
        <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((p, i) => {
            const avatar = safeImageUrl(p.avatar)
            return (
              <article
                key={p.id}
                role="button"
                tabIndex={0}
                aria-label={fill(ui.cardAria, { name: p.name })}
                onClick={onChat}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChat()
                  }
                }}
                className="reveal group relative cursor-pointer overflow-hidden rounded-[26px] border border-cream/[0.08] bg-surface transition duration-500 hover:-translate-y-1 hover:border-copper/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/60"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* 图 */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={fill(ui.avatarAlt, { name: p.name, age: p.age })}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full scale-[1.02] object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.09]"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-wine/40 via-surface to-ink text-[13px] text-cream/25">
                      {ui.noAvatar}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-wine/20 via-transparent to-transparent mix-blend-soft-light" />

                  {/* 距离 */}
                  <div className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-full border border-cream/15 bg-black/40 px-2.5 py-1 backdrop-blur">
                    <MapPin className="h-3 w-3 text-copper" />
                    <span className="text-[10.5px] font-medium tracking-wide text-cream/85">
                      {formatMeters(p.meters)}
                    </span>
                  </div>

                  {/* 在线 */}
                  <div className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-cream/12 bg-black/40 px-2 py-1 backdrop-blur">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        p.live
                          ? 'bg-blush shadow-[0_0_8px_2px_rgba(233,169,161,0.55)]'
                          : 'bg-cream/30'
                      }`}
                    />
                    <span className="text-[10px] tracking-wide text-cream/70">
                      {p.live ? nearbyCopy.onlineLabel : nearbyCopy.recentLabel}
                    </span>
                  </div>

                  {/* 名字 */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-baseline gap-1.5">
                      <h3 className="text-[17px] font-semibold tracking-wide text-cream">
                        {p.name}
                      </h3>
                      <span className="text-[11.5px] text-cream/45">{p.age}</span>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-snug text-cream/60">{p.now}</p>
                  </div>
                </div>

                {/* 她说的话 */}
                <div className="relative border-t border-cream/[0.06] px-4 pb-4 pt-3.5">
                  <p className="text-[13px] leading-[1.75] text-cream/70">
                    <span className="me-1 font-display text-[15px] text-copper/80">“</span>
                    {p.quote}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.filter(Boolean).map((t, ti) => (
                        <span
                          key={`${t}-${ti}`}
                          className="rounded-full border border-cream/[0.08] px-2 py-[2px] text-[10px] text-cream/38"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-cream/10 bg-cream/[0.04] px-2.5 py-1 text-[10.5px] font-medium text-cream/50 transition group-hover:border-copper/40 group-hover:bg-copper/10 group-hover:text-copper">
                      <MessageCircle className="h-3 w-3" />
                      {ui.sayHi}
                      <ArrowUpRight className="h-2.5 w-2.5 opacity-0 transition group-hover:opacity-100" />
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {nearbyCopy.footnote && (
          <p className="mt-8 text-center text-[12px] leading-relaxed text-cream/25">
            {nearbyCopy.footnote}
          </p>
        )}

        {/* 第二屏底部引导 → 第三屏聊天 */}
        <div className="reveal mt-10 flex flex-col items-center gap-4 rounded-3xl border border-cream/[0.08] bg-gradient-to-br from-wine/[0.14] via-surface/60 to-ink px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-[15px] font-semibold text-cream">{ui.bridgeTitle}</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-cream/45">
              {ui.bridgeBody}
            </p>
          </div>
          <a
            href="#chat"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-wine via-copper to-blush px-5 py-3 text-[13px] font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98]"
          >
            {ui.bridgeCta}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
