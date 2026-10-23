import { useEffect, useRef, useState } from 'react'
import {
  Copy,
  DownloadCloud,
  RotateCcw,
  Search,
  Sliders,
  UploadCloud,
  X,
} from 'lucide-react'
import { useConfig } from '../../config/store'

export type TabKey =
  | 'brand'
  | 'theme'
  | 'hero'
  | 'highlights'
  | 'nearby'
  | 'how'
  | 'chat'
  | 'install'
  | 'videos'
  | 'data'

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'brand', label: '品牌' },
  { key: 'theme', label: '配色' },
  { key: 'hero', label: '首屏' },
  { key: 'highlights', label: '亮点' },
  { key: 'nearby', label: '附近' },
  { key: 'how', label: '流程' },
  { key: 'chat', label: '私聊' },
  { key: 'install', label: '安装' },
  { key: 'videos', label: '视频' },
  { key: 'data', label: '数据' },
]

type Props = {
  open: boolean
  onClose: () => void
  tab: TabKey
  onTab: (t: TabKey) => void
  children: React.ReactNode
}

export function ConsolePanel({ open, onClose, tab, onTab, children }: Props) {
  const bodyRef = useRef<HTMLDivElement | null>(null)

  /** 切标签回到顶部 */
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [tab])

  /** Esc 关闭 */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null
      const typing =
        el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
      if (e.key === 'Escape' && !typing) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <aside
      aria-label="内容控制台"
      aria-hidden={!open}
      className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-[430px] flex-col border-l border-cream/10 bg-[#0d0d0f]/97 shadow-[-30px_0_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-transform duration-300 sm:rounded-l-2xl ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* 头部 */}
      <header className="relative shrink-0 border-b border-cream/[0.08] px-4 pb-3 pt-4">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-wine via-copper to-blush" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-copper/70">
              Live Console
            </p>
            <h2 className="mt-1 text-[15px] font-bold text-cream">内容控制台</h2>
            <p className="mt-0.5 text-[10.5px] text-cream/35">
              改完即时生效 · 自动保存到本机
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭控制台"
            title="关闭并回到页面"
            className="grid h-8 w-8 place-items-center rounded-full bg-cream/[0.07] text-cream/50 transition hover:bg-cream/15 hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 标签 */}
        <div className="hide-scrollbar -mx-1 mt-3 flex gap-1 overflow-x-auto pb-0.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onTab(t.key)}
              aria-current={tab === t.key}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11.5px] font-medium transition ${
                tab === t.key
                  ? 'bg-cream text-[#17090c]'
                  : 'bg-cream/[0.05] text-cream/50 hover:bg-cream/10 hover:text-cream/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* 内容 */}
      <div ref={bodyRef} className="hide-scrollbar flex-1 overflow-y-auto px-4 pb-6 pt-1">
        {children}
      </div>
    </aside>
  )
}

/* ══════════════════════ 触发器 ══════════════════════ */

/**
 * 悬浮入口。
 * 手机上放在底部安全区之上（避开手机底栏），桌面端贴右下角。
 * 也可以按 Ctrl/⌘ + K 打开。
 */
export function ConsoleTrigger({ onOpen }: { onOpen: () => void }) {
  const { dirty } = useConfig()
  return (
    <button
      type="button"
      onClick={onOpen}
      title="打开内容控制台（Ctrl/⌘ + K）"
      aria-label="打开内容控制台"
      className="group fixed bottom-[84px] right-3 z-[60] flex items-center gap-2 rounded-full border border-cream/15 bg-[#141216]/95 px-3.5 py-2.5 text-[12px] font-semibold text-cream shadow-panel backdrop-blur-xl transition hover:border-copper/45 hover:bg-[#1a171b] active:scale-95 sm:bottom-4 sm:right-4 sm:px-4 sm:py-3"
    >
      <Sliders className="h-4 w-4 text-copper" />
      控制台
      {dirty && (
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-blush ring-2 ring-[#141216]" />
      )}
    </button>
  )
}

/* ══════════════════════ 数据面板 ══════════════════════ */

export function DataPanel() {
  const { config, exportJson, importJson, reset, replaceAll } = useConfig()
  const [text, setText] = useState('')
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const notify = (kind: 'ok' | 'err', t: string) => {
    setMsg({ kind, text: t })
    window.setTimeout(() => setMsg(null), 2600)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson())
      notify('ok', '已复制全部配置 JSON')
    } catch {
      setText(exportJson())
      notify('err', '浏览器拒绝了剪贴板，已填到下方输入框')
    }
  }

  const handleImport = () => {
    if (!text.trim()) {
      notify('err', '请先粘贴 JSON')
      return
    }
    const res = importJson(text)
    notify(res.ok ? 'ok' : 'err', res.ok ? '导入成功，页面已更新' : res.error ?? '导入失败')
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const res = importJson(String(reader.result ?? ''))
      notify(res.ok ? 'ok' : 'err', res.ok ? '文件导入成功' : res.error ?? '导入失败')
    }
    reader.readAsText(file)
  }

  const handleExportFile = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site-config.json'
    a.click()
    URL.revokeObjectURL(url)
    notify('ok', '已下载 site-config.json')
  }

  return (
    <div className="grid gap-3 pt-3">
      <div className="rounded-xl border border-cream/[0.08] bg-white/[0.02] p-3">
        <p className="text-[11.5px] font-semibold text-cream/75">备份与恢复</p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-cream/35">
          配置存在这台设备的浏览器里。换设备或清理缓存前，先导出备份。
        </p>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-cream/12 py-2 text-[11.5px] font-medium text-cream/70 transition hover:bg-cream/10 hover:text-cream"
          >
            <Copy className="h-3.5 w-3.5" />
            复制 JSON
          </button>
          <button
            type="button"
            onClick={handleExportFile}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-cream/[0.08] py-2 text-[11.5px] font-medium text-cream/80 transition hover:bg-cream/15"
          >
            <DownloadCloud className="h-3.5 w-3.5" />
            导出为文件
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-cream/[0.08] py-2 text-[11.5px] font-medium text-cream/80 transition hover:bg-cream/15"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            从文件导入
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-cream/[0.08] bg-white/[0.02] p-3">
        <p className="text-[11.5px] font-semibold text-cream/75">粘贴 JSON 导入</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder='把导出的 JSON 粘在这里…'
          className="mt-2 w-full resize-y rounded-lg border border-cream/10 bg-black/35 px-2.5 py-2 font-mono text-[10.5px] leading-relaxed text-cream outline-none placeholder:text-cream/20 focus:border-copper/50"
        />
        <button
          type="button"
          onClick={handleImport}
          className="mt-2 w-full rounded-lg bg-gradient-to-r from-wine via-copper to-blush py-2 text-[11.5px] font-bold text-white transition hover:brightness-110"
        >
          应用这份配置
        </button>
      </div>

      <div className="rounded-xl border border-red-400/20 bg-red-500/[0.06] p-3">
        <p className="text-[11.5px] font-semibold text-red-200/90">危险操作</p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-red-100/45">
          会把所有内容恢复成初始默认值，且无法撤销。
        </p>
        <div className="mt-2.5 grid gap-2">
          <button
            type="button"
            onClick={() => {
              reset()
              notify('ok', '已恢复出厂设置')
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-red-400/25 py-2 text-[11.5px] font-medium text-red-300 transition hover:bg-red-500/15"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            全部重置
          </button>
          <button
            type="button"
            onClick={() => {
              replaceAll(config)
              notify('ok', '已补齐缺失字段')
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-cream/10 py-2 text-[11.5px] text-cream/45 transition hover:text-cream/80"
          >
            <Search className="h-3.5 w-3.5" />
            校验并补齐结构
          </button>
        </div>
      </div>

      {msg && (
        <p
          role="status"
          className={`rounded-lg px-3 py-2 text-[10.5px] ${
            msg.kind === 'ok'
              ? 'bg-emerald-500/12 text-emerald-300'
              : 'bg-red-500/12 text-red-300'
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  )
}
