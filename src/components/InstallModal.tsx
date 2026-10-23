import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  ShieldCheck,
  Smartphone,
  ScanLine,
  X,
} from 'lucide-react'
import { APK_META, APK_URL } from '../data/site'
import { INSTALL_STEPS, SAFETY_POINTS } from '../data/install'

/**
 * 安装弹窗。
 *
 * 刻意与页面第 3 屏分开内容 —— 弹窗里只放「点下去之前的最后三个顾虑」：
 *   1. 为什么提示未知来源（这是侧载最大流失点）
 *   2. 病毒与签名（安全焦虑）
 *   3. 30 秒内必须知道的三个排错口径
 * 页面第 3 屏讲的是「完整步骤 + 权限明细 + 全部 FAQ」。
 */

/** 弹窗专属的 3 条快速排错，和页面 FAQ 不重复 */
const QUICK_FIXES = [
  {
    q: '点下载没反应？',
    a: '部分浏览器会拦截 APK。换用 Chrome 或系统自带浏览器重新打开本页再点一次。',
  },
  {
    q: '装完找不到图标？',
    a: '部分国产系统会把新应用放进「未分类」文件夹，或在桌面下拉搜索应用名称。',
  },
  {
    q: '提示「解析包错误」？',
    a: '通常是下载中断导致文件不完整。删除已下载的文件，重新点一次下载即可。',
  },
]

type Props = {
  open: boolean
  onClose: () => void
  /** 弹窗内「开始下载」→ 触发 Purchase 埋点并跳转 */
  onConfirm: () => void
}

export function InstallModal({ open, onClose, onConfirm }: Props) {
  const [mounted, setMounted] = useState(open)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  /** 进入/退出动画 */
  useEffect(() => {
    if (open) {
      setMounted(true)
      const t = window.setTimeout(() => closeRef.current?.focus(), 60)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setMounted(false), 220)
    return () => window.clearTimeout(t)
  }, [open])

  /** 锁定滚动 + Esc 关闭 */
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      {/* 遮罩 */}
      <button
        type="button"
        aria-label="关闭"
        onClick={onClose}
        className={`absolute inset-0 h-full w-full bg-black/70 backdrop-blur-[4px] transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 面板 */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-modal-title"
        className={`relative flex max-h-[92vh] w-full max-w-[540px] flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#17171A] shadow-panel transition-all duration-200 sm:rounded-[28px] ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* 顶部渐变条 */}
        <div className="h-[2px] w-full bg-gradient-to-r from-brand via-brand2 to-accent" />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="关闭弹窗"
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/[0.08] text-white/60 transition hover:bg-white/15 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="hide-scrollbar overflow-y-auto px-5 pb-5 pt-6 sm:px-7 sm:pb-7">
          {/* 标题 */}
          <div className="flex items-start gap-3 pr-10">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/15 ring-1 ring-brand/30">
              <Download className="h-4 w-4 text-brand2" />
            </span>
            <div>
              <h2 id="install-modal-title" className="text-[19px] font-bold leading-tight text-white">
                准备下载
              </h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/45">
                按这三步安全安装到你的安卓手机
              </p>
            </div>
          </div>

          {/* 元信息 */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ['版本', APK_META.version],
              ['大小', APK_META.size],
              ['系统', APK_META.minAndroid],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-2 text-center"
              >
                <p className="text-[9.5px] uppercase tracking-[0.14em] text-white/30">{k}</p>
                <p className="mt-1 text-[12px] font-semibold text-white/85">{v}</p>
              </div>
            ))}
          </div>

          {/* 三步 */}
          <ol className="mt-5 grid gap-2.5">
            {INSTALL_STEPS.map((step) => (
              <li
                key={step.no}
                className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand2 text-[10.5px] font-bold text-white">
                  {step.no}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold leading-snug text-white/92">{step.title}</p>
                  <p className="mt-1 text-[11.5px] leading-[1.7] text-white/45">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* 安全区：数字签名 + 病毒 */}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <p className="text-[12px] font-semibold text-emerald-200">签名已校验</p>
              </div>
              <p className="mt-1.5 text-[11px] leading-[1.7] text-emerald-100/60">
                安装包经过数字签名，安装时系统会自动校验。被篡改过的包装不上。
              </p>
            </div>
            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-3.5">
              <div className="flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-sky-300" />
                <p className="text-[12px] font-semibold text-sky-200">可自行复查</p>
              </div>
              <p className="mt-1.5 text-[11px] leading-[1.7] text-sky-100/60">
                下载后用任意手机杀毒 App 再扫一遍，结果随时可查。
              </p>
            </div>
          </div>

          {/* 未来源解释 —— 侧载最大流失点 */}
          <div className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-3.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-300" />
              <p className="text-[12px] font-semibold text-amber-200">为什么会提示「未知来源」？</p>
            </div>
            <p className="mt-1.5 text-[11px] leading-[1.75] text-amber-100/60">
              因为本应用没有上架应用商店。安卓对所有非商店渠道的安装包都会给这个提示，
              这是系统层面的标准行为，不代表文件有问题。点「允许」即可继续。
            </p>
          </div>

          {/* 快速排错（与页面 FAQ 不重复） */}
          <div className="mt-4">
            <p className="mb-2 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/35">
              <Smartphone className="h-3 w-3" />
              装的过程中卡住了？
            </p>
            <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.07]">
              {QUICK_FIXES.map((f) => (
                <QuickFix key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>

          {/* 信任点摘要 */}
          <ul className="mt-4 grid gap-1.5">
            {SAFETY_POINTS.map((p) => (
              <li key={p.title} className="flex items-start gap-2 text-[11px] text-white/45">
                <Check className="mt-[3px] h-3 w-3 shrink-0 text-mint" />
                <span>
                  <b className="font-semibold text-white/70">{p.title}</b>
                  <span className="mx-1.5 text-white/20">·</span>
                  {p.body}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 底部操作区 */}
        <div className="border-t border-white/[0.07] bg-[#17171A] px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3.5 sm:px-7 sm:pb-5">
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-[34%] shrink-0 rounded-2xl border border-white/12 bg-white/[0.04] py-3.5 text-[13.5px] font-semibold text-white/65 transition hover:bg-white/[0.09] hover:text-white"
            >
              取消
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand via-brand2 to-accent py-3.5 text-[14px] font-bold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              我已了解，开始下载
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </button>
          </div>
          <p className="mt-2.5 text-center text-[9.5px] leading-relaxed text-white/25">
            继续即表示同意用户协议与隐私政策 · 本应用仅限 18 岁以上
            <span className="sr-only">下载链接：{APK_URL}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function QuickFix({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white/[0.015]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left"
      >
        <span className="text-[11.5px] font-medium text-white/70">{q}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-white/30 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="min-h-0">
          <p className="px-3.5 pb-3 text-[11px] leading-[1.75] text-white/40">{a}</p>
        </div>
      </div>
    </div>
  )
}
