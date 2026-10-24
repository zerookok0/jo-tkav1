import { useCallback, useEffect, useState } from 'react'
import { Ambient, ScrollRail, useElementProgress } from './components/Ambient'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Highlights, HowItWorks } from './components/Highlights'
import { InstallSection } from './components/InstallSection'
import { Footer, MobileDock } from './components/Footer'
import { InstallModal } from './components/InstallModal'
import { Nearby } from './components/Nearby'
import { NightChat } from './components/NightChat'
import { Console } from './components/console/Console'
import { useReveal } from './hooks/useReveal'
import { initPixel, trackInnerAndGo, trackOuter } from './lib/pixel'
import { ConfigProvider, themeVars, useConfig } from './config/store'
import { LocaleProvider } from './i18n/LocaleProvider'
import type { GateKey } from './config/defaults'

function Site() {
  useReveal()
  const { config } = useConfig()
  const [sheetOpen, setSheetOpen] = useState(false)
  const { ref, progress } = useElementProgress<HTMLDivElement>()

  /** Pixel 只在填了 ID 时才注入 */
  useEffect(() => {
    initPixel(config.download.pixelId)
  }, [config.download.pixelId])

  /** 主题色落到 CSS 变量 */
  useEffect(() => {
    const vars = themeVars(config.theme)
    const root = document.documentElement
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
  }, [config.theme])

  /** 外层下载按钮 → InitiateCheckout */
  const openSheet = useCallback(
    (source: string) => {
      trackOuter(config.download.pixelId, source)
      setSheetOpen(true)
    },
    [config.download.pixelId],
  )

  const closeSheet = useCallback(() => setSheetOpen(false), [])

  /** 弹窗内「开始下载」→ Purchase，然后跳转 */
  const confirmDownload = useCallback(() => {
    trackInnerAndGo(config.download.pixelId, config.download.apkUrl, 'dl_inner_modal')
  }, [config.download.pixelId, config.download.apkUrl])

  /** 手机内点赞/评论 → 打开同一个弹窗 */
  const handleGate = useCallback(
    (_action?: GateKey) => openSheet('dl_inner_phone'),
    [openSheet],
  )

  /**
   * 唯一的下载入口。所有会弹出下载框的地方都必须走这里 ——
   * 这样每个入口都会带回一条 InitiateCheckout，
   * 不会再出现「能弹框但不回传」的旁路。
   */
  const DOWNLOAD_SOURCES = {
    header: 'dl_outer_header',
    hero: 'dl_outer_hero',
    heroSecondary: 'dl_outer_hero_secondary',
    phone: 'dl_inner_phone',
    nearby: 'dl_nearby_card',
    chat: 'dl_chat_input',
    install: 'dl_outer_install',
    bypass: 'dl_outer_bypass',
    dock: 'dl_outer_dock',
  } as const

  return (
    <div ref={ref} className="relative min-h-screen overflow-x-hidden bg-ink">
      <Ambient progress={progress} active={0} />
      <ScrollRail progress={progress} />

      <a
        href="#nearby"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        {config.ui.skipToContent}
      </a>

      <Header onDownload={() => openSheet(DOWNLOAD_SOURCES.header)} />

      {/* 动线：看视频（第 1 屏）→ 看附近的人（第 2 屏）→ 开始聊天（第 3 屏） */}
      <main>
        <Hero
          onDownload={() => openSheet(DOWNLOAD_SOURCES.hero)}
          onGate={handleGate}
        />

        <Nearby onChat={() => openSheet(DOWNLOAD_SOURCES.nearby)} />

        <NightChat onStart={() => openSheet(DOWNLOAD_SOURCES.chat)} />

        <Highlights />
        <HowItWorks />
        <InstallSection
          onDownload={() => openSheet(DOWNLOAD_SOURCES.install)}
          onBypass={() => openSheet(DOWNLOAD_SOURCES.bypass)}
        />
      </main>

      <Footer />
      <MobileDock onDownload={() => openSheet(DOWNLOAD_SOURCES.dock)} />

      <InstallModal open={sheetOpen} onClose={closeSheet} onConfirm={confirmDownload} />
    </div>
  )
}

/**
 * 层级顺序是有讲究的：
 *
 *   ConfigProvider（中文主库）
 *     LocaleProvider（页面读「当前语言」）
 *       Site
 *     Console（编辑器读中文主库）
 *
 * 控制台故意留在语言层外面 —— 切到英文后进控制台，
 * 里面看到的、改的仍然是中文母版，不会把英文存成正式内容。
 */
export default function App() {
  return (
    <ConfigProvider>
      <LocaleProvider>
        <Site />
      </LocaleProvider>
      <Console />
    </ConfigProvider>
  )
}
