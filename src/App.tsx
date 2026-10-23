import { useCallback, useEffect, useState } from 'react'
import { Ambient, ScrollRail, useElementProgress } from './components/Ambient'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Highlights, HowItWorks } from './components/Highlights'
import { InstallSection } from './components/InstallSection'
import { Footer, MobileDock } from './components/Footer'
import { InstallModal } from './components/InstallModal'
import { useReveal } from './hooks/useReveal'
import { initPixel, trackOuter, trackInnerAndGo } from './lib/pixel'
import type { GateAction } from './data/site'

export default function App() {
  useReveal()
  const [sheetOpen, setSheetOpen] = useState(false)
  const { ref, progress } = useElementProgress<HTMLDivElement>()

  /** Pixel 只在有 ID 时才注入 */
  useEffect(() => {
    initPixel()
  }, [])

  /**
   * 外层下载按钮 → InitiateCheckout
   * 所有页面上的「下载」入口都从这里进来，source 用来区分位置。
   */
  const openSheet = useCallback((source: string) => {
    trackOuter(source)
    setSheetOpen(true)
  }, [])

  const closeSheet = useCallback(() => setSheetOpen(false), [])

  /** 弹窗内「开始下载」 → Purchase，然后跳转 */
  const confirmDownload = useCallback(() => {
    trackInnerAndGo('dl_inner_modal')
  }, [])

  /** 手机内点赞/评论等 → 打开同一个弹窗（埋点走外层规则） */
  const handleGate = useCallback(
    (_action?: GateAction) => openSheet('dl_inner_phone'),
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
        {/* 区块 1：手机 + 视频流 */}
        <Hero onDownload={() => openSheet('dl_outer_hero')} onGate={handleGate} />

        {/* 区块 2：五个亮点 */}
        <Highlights />

        {/* 区块 3：怎么用 */}
        <HowItWorks />

        {/* 区块 4：安装步骤 + 安全 + FAQ */}
        <InstallSection onDownload={() => openSheet('dl_outer_install')} />
      </main>

      <Footer />
      <MobileDock onDownload={() => openSheet('dl_outer_dock')} />

      <InstallModal open={sheetOpen} onClose={closeSheet} onConfirm={confirmDownload} />
    </div>
  )
}
