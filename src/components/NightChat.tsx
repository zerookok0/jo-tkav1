import { useEffect, useRef, useState } from 'react'
import { Flame, Lock } from 'lucide-react'
import { CHAT_STORIES, COPY } from '../data/site'

export function NightChat() {
  const story = CHAT_STORIES[0]
  const [shown, setShown] = useState(0)
  const [started, setStarted] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  /** 滚到视野内才开始逐条浮现 —— 制造「正在聊」的错觉 */
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      setShown(story.lines.length)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [story.lines.length])

  useEffect(() => {
    if (!started || shown >= story.lines.length) return
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 320 : 720)
    return () => window.clearTimeout(t)
  }, [started, shown, story.lines.length])

  return (
    <section id="chat" className="relative overflow-hidden py-16 sm:py-24">
      {/* 背景暖光 */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[860px] -translate-x-1/2 -translate-y-1/2 opacity-60 blur-[110px]"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(124,27,44,0.3) 0%, rgba(192,138,92,0.1) 45%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          {/* 左：说明 */}
          <div className="reveal order-2 lg:order-1">
            <p className="eyebrow">01:24 的私聊</p>
            <h2 className="mt-3.5 text-balance text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold leading-[1.3] tracking-[-0.01em] text-cream">
              有些话，<br className="hidden sm:block" />
              只在她困之前说得出口。
            </h2>
            <p className="mt-4 max-w-[420px] text-[14px] leading-[1.9] text-cream/45">
              {COPY.chatSub}
            </p>

            <ul className="mt-7 grid gap-3">
              {[
                {
                  icon: Flame,
                  title: '看完即焚',
                  body: '照片和语音点开就开始倒计时，5 秒后从对面手机里消失。',
                },
                {
                  icon: Lock,
                  title: '截图会有提示',
                  body: '她那边会立刻知道你截了屏 —— 所以，要快，也得认。',
                },
              ].map((f) => {
                const Icon = f.icon
                return (
                  <li
                    key={f.title}
                    className="flex items-start gap-3 rounded-2xl border border-cream/[0.07] bg-cream/[0.025] p-4 transition duration-500 hover:border-copper/25 hover:bg-cream/[0.05]"
                  >
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-wine/20 text-blush ring-1 ring-wine/30">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold text-cream/90">{f.title}</p>
                      <p className="mt-1 text-[12px] leading-[1.75] text-cream/40">{f.body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* 右：聊天窗 */}
          <div className="reveal order-1 lg:order-2">
            <div
              ref={wrapRef}
              className="relative mx-auto w-full max-w-[430px] overflow-hidden rounded-[30px] border border-cream/[0.09] bg-[#100B0C]/90 shadow-ember backdrop-blur-xl"
            >
              {/* 顶栏 */}
              <div className="flex items-center gap-3 border-b border-cream/[0.07] px-4 py-3.5">
                <div className="relative">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-cream/15"
                    loading="lazy"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#100B0C] bg-blush" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-cream">{story.name}</p>
                  <p className="mt-0.5 text-[10.5px] tracking-wide text-cream/35">{story.meta}</p>
                </div>
                <span className="rounded-full border border-copper/25 bg-copper/10 px-2 py-[3px] text-[9.5px] font-medium tracking-wide text-copper">
                  阅后即焚
                </span>
              </div>

              {/* 消息区 */}
              <div className="hide-scrollbar flex max-h-[420px] min-h-[330px] flex-col gap-2 overflow-y-auto px-4 py-5">
                {story.lines.slice(0, shown).map((line, i) => {
                  if (line.system) {
                    return (
                      <div
                        key={i}
                        className="msg-in mx-auto my-1 flex items-center gap-1.5 rounded-full border border-cream/[0.08] bg-cream/[0.03] px-3 py-1.5"
                      >
                        <Flame className="h-3 w-3 text-blush/80" />
                        <span className="text-[10.5px] tracking-wide text-cream/35">
                          {line.text}
                        </span>
                      </div>
                    )
                  }

                  const mine = line.from === 'you'
                  return (
                    <div
                      key={i}
                      className={`msg-in flex ${mine ? 'justify-end' : 'justify-start'}`}
                    >
                      <p
                        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.65] ${
                          mine
                            ? 'rounded-br-md bg-gradient-to-br from-wine to-wineDeep text-cream'
                            : 'rounded-bl-md border border-cream/[0.07] bg-cream/[0.055] text-cream/85'
                        }`}
                      >
                        {line.text}
                      </p>
                    </div>
                  )
                })}

                {/* 正在输入 */}
                {shown < story.lines.length && shown > 0 && (
                  <div className="mt-1 flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-cream/[0.07] bg-cream/[0.055] px-3.5 py-3">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-cream/40"
                          style={{
                            animation: `pulse-bar 1s ease-in-out ${d * 0.18}s infinite alternate`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 结尾留白 */}
                {shown >= story.lines.length && (
                  <p className="mt-3 text-center text-[11px] tracking-[0.16em] text-cream/20">
                    后面的，不在网页上
                  </p>
                )}
              </div>

              {/* 输入框（点击进入下载） */}
              <div className="border-t border-cream/[0.07] px-4 py-3">
                <div className="flex items-center gap-2 rounded-full border border-cream/[0.08] bg-cream/[0.03] px-3.5 py-2.5">
                  <span className="flex-1 text-[12px] text-cream/25">说点什么…</span>
                  <span className="rounded-full bg-cream/90 px-3 py-1 text-[10.5px] font-semibold text-[#17090c]">
                    发送
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
