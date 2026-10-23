import { useState } from 'react'
import { AlertTriangle, ArrowUpRight, Check, Download, ShieldCheck, Smartphone } from 'lucide-react'
import { APK_META, APK_URL } from '../data/site'
import { FAQS, INSTALL_STEPS, SAFETY_POINTS } from '../data/install'

type Props = {
  onDownload: () => void
}

/**
 * 第 3 屏：完整安装说明 + 安全 + FAQ。
 *
 * 与弹窗的分工：
 *   · 这里讲「完整」「权威」—— 权限明细、全部 FAQ、系统要求
 *   · 弹窗讲「30 秒内」—— 未知来源解释、三条快速排错
 * 内容不重复，但立场一致：让用户在点按钮前就不怕。
 */
export function InstallSection({ onDownload }: Props) {
  return (
    <section id="install" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="reveal mx-auto max-w-[640px] text-center">
          <p className="eyebrow">下载与安装</p>
          <h2 className="mt-4 text-balance text-[clamp(1.65rem,4.6vw,2.5rem)] font-bold leading-[1.22] tracking-[-0.02em]">
            三步装好，
            <span className="text-gradient">不到一分钟。</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[500px] text-[15px] leading-[1.85] text-white/50">
            应用没有上架应用商店，所以手机会提示「未知来源」。
            这是安卓对所有侧载安装的正常拦截，不是文件有问题。
          </p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ── 左：三步 + 权限 ── */}
          <div className="grid gap-3">
            {INSTALL_STEPS.map((step, i) => (
              <div
                key={step.no}
                className="reveal group relative flex gap-4 rounded-3xl border border-white/[0.07] bg-surface/60 p-5 transition duration-500 hover:border-white/[0.15] hover:bg-surface sm:p-6"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand2 text-[12px] font-bold text-white shadow-glow">
                  {step.no}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.8] text-white/50">{step.body}</p>
                </div>
              </div>
            ))}

            {/* 权限明细 —— 只在页面上出现，弹窗里没有 */}
            <div className="reveal rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-mint" />
                <p className="text-[13px] font-semibold text-white">只申请这三项权限</p>
              </div>
              <div className="mt-4 grid gap-2.5">
                {[
                  ['相机', '拍摄与上传视频'],
                  ['麦克风', '录音、语音私聊、AI 变声'],
                  ['位置', '计算距离，推荐附近内容'],
                ].map(([name, why]) => (
                  <div key={name} className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-[12.5px] font-medium text-white/80">
                      <Check className="h-3 w-3 text-emerald-400" />
                      {name}
                    </span>
                    <span className="text-right text-[11.5px] text-white/35">{why}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-t border-white/[0.07] pt-3 text-[11.5px] leading-relaxed text-white/35">
                通讯录、短信、通话记录 —— 一律不申请。位置可以随时在设置里关掉。
              </p>
            </div>
          </div>

          {/* ── 右：安全 + 系统要求 + 提醒 ── */}
          <div className="grid gap-3">
            <div className="reveal rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <p className="eyebrow">安全说明</p>
              <ul className="mt-3.5 grid gap-3">
                {SAFETY_POINTS.map((p) => (
                  <li key={p.title} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-400/15">
                      <Check className="h-2.5 w-2.5 text-emerald-300" />
                    </span>
                    <div>
                      <p className="text-[12.5px] font-semibold text-white/85">{p.title}</p>
                      <p className="mt-0.5 text-[11.5px] leading-[1.7] text-white/40">{p.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-brand2" />
                <p className="text-[13px] font-semibold text-white">安装包信息</p>
              </div>
              <div className="mt-3.5 grid grid-cols-3 gap-2">
                {[
                  ['版本', APK_META.version],
                  ['大小', APK_META.size],
                  ['系统', APK_META.minAndroid],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-2.5 text-center"
                  >
                    <p className="text-[9.5px] uppercase tracking-[0.14em] text-white/30">{k}</p>
                    <p className="mt-1 text-[12px] font-semibold text-white/85">{v}</p>
                  </div>
                ))}
              </div>
              <a
                href={APK_URL}
                className="mt-3.5 inline-flex items-center gap-1.5 text-[11.5px] text-white/35 transition hover:text-white/70"
              >
                直链地址（备用）
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <div className="reveal flex items-start gap-2.5 rounded-3xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <p className="text-[12px] leading-[1.75] text-amber-100/65">
                如果手机提示「禁止安装未知应用」，进入
                <b className="mx-1 font-semibold text-amber-200">设置 → 安全 → 安装未知应用</b>
                ，为你正在用的浏览器打开权限，再回来点一次下载即可。
              </p>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="reveal mt-14">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <h3 className="text-[clamp(1.3rem,3.4vw,1.75rem)] font-bold tracking-tight text-white">
              还有这几个问题
            </h3>
            <p className="text-[12.5px] text-white/35">点开就能看到答案</p>
          </div>

          <div className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {FAQS.map((item, i) => (
              <FaqRow key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>

        {/* ── 底部 CTA ── */}
        <div className="reveal mt-12 flex flex-col items-center gap-4 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#221a34] via-[#17171a] to-[#1c1522] px-6 py-9 text-center">
          <p className="text-[clamp(1.2rem,3.4vw,1.6rem)] font-bold leading-snug text-white">
            都看明白了？那就装上试试
          </p>
          <p className="max-w-[420px] text-[13.5px] leading-relaxed text-white/45">
            装好之后打开，你会看到此刻离你最近的那条视频。
          </p>
          <button type="button" onClick={onDownload} className="btn-primary group mt-1">
            <Download className="h-4 w-4" />
            免费下载 App
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  )
}

function FaqRow({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[14.5px] font-medium text-white/85">{q}</span>
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
            open
              ? 'rotate-45 border-brand/50 bg-brand/15 text-brand2'
              : 'border-white/15 text-white/40'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0">
          <p className="max-w-[600px] pb-5 pr-8 text-[13.5px] leading-[1.85] text-white/50">{a}</p>
        </div>
      </div>
    </div>
  )
}
