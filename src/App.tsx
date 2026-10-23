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

  return (
    <div ref={ref} className="relative min-h-screen overflow-x-hidden bg-ink">
      <Ambient progress={progress} active={0} />
      <ScrollRail progress={progress} />

      <a
        href="#highlights"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        跳到主要内容
      </a>

      <Header onDownload={() => openSheet('dl_outer_header')} />

      <main>
        <Hero onDownload={() => openSheet('dl_outer_hero')} onGate={handleGate} />
        <Nearby />
        <Highlights />
        <HowItWorks />
        <NightChat />
        <InstallSection onDownload={() => openSheet('dl_outer_install')} />
      </main>

      <Footer />
      <MobileDock onDownload={() => openSheet('dl_outer_dock')} />

      <InstallModal open={sheetOpen} onClose={closeSheet} onConfirm={confirmDownload} />
      <Console />
    </div>
  )
}

export default function App() {
  return (
    <ConfigProvider>
      <Site />
    </ConfigProvider>
  )
}
