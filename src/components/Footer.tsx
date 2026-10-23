import { Download, Mail, ShieldCheck } from 'lucide-react'
import { AppIcon, AppName } from './BrandSlot'
import { CONTACT_EMAIL } from '../data/site'

type Props = {
  onDownload: () => void
}

const LINKS = [
  {
    title: '了解',
    items: [
      { label: '产品亮点', href: '#highlights' },
      { label: '使用方式', href: '#how' },
      { label: '下载安装', href: '#install' },
    ],
  },
  {
    title: '支持',
    items: [
      { label: '常见问题', href: '#install' },
      { label: '反馈建议', href: `mailto:${CONTACT_EMAIL}` },
      { label: '内容举报', href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] pb-28 pt-14 sm:pb-14">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <AppIcon className="h-11 w-11" />
              <div>
                <AppName className="text-[14px]" />
                <p className="mt-1 text-[9.5px] font-medium uppercase tracking-[0.24em] text-white/30">
                  附近短视频
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-[320px] text-[13px] leading-[1.85] text-white/40">
              一个把「附近」放在第一位的短视频社区。看身边正在发生的事，也让身边看见你。
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[11.5px] text-white/50 transition hover:border-white/25 hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              {CONTACT_EMAIL}
            </a>
          </div>

          {LINKS.map((group) => (
            <div key={group.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                {group.title}
              </p>
              <ul className="mt-4 grid gap-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-[12.5px] text-white/50 transition hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 h-px hairline" />

        <div className="mt-6 flex flex-col gap-3 text-[10.5px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" />© {new Date().getFullYear()} 保留所有权利
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a href="#install" className="transition hover:text-white/60">
              用户协议
            </a>
            <a href="#install" className="transition hover:text-white/60">
              隐私政策
            </a>
            <a href="#install" className="transition hover:text-white/60">
              内容规范
            </a>
            <span className="rounded-full border border-white/15 px-2 py-[1px] font-bold tracking-wide">
              18+
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/** 移动端常驻底栏，让下载按钮始终一手可及 */
export function MobileDock({ onDownload }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 sm:hidden">
      <div className="glass flex items-center gap-3 rounded-2xl px-3 py-2.5 shadow-panel">
        <AppIcon className="h-9 w-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-white">
            <AppName className="!border-0 !bg-transparent !p-0 !text-[12px] !tracking-normal" />
          </p>
          <p className="truncate text-[10px] text-white/45">附近视频 · 完全免费</p>
        </div>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand via-brand2 to-accent px-4 py-2.5 text-[12.5px] font-bold text-white active:scale-95"
        >
          <Download className="h-3.5 w-3.5" />
          下载
        </button>
      </div>
    </div>
  )
}
