"use client"

import { useEffect, useRef, useState } from "react"
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch"
import ScreenFrame from "./ScreenFrame"
import { ProjectType, ScreenConfig } from "@/type/types"
import { Skeleton } from "@/components/ui/skeleton"
import { MinusIcon, PlusIcon, RefreshCcwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import html2canvas from "html2canvas"
import axios from "axios"

type Props = {
  projectDetail?: ProjectType
  screenConfig: ScreenConfig[]
  takeScreenShot: number | null
}

const Canvas = ({ projectDetail, screenConfig, takeScreenShot }: Props) => {
  const [panningEnable, setPanningEnable] = useState(true)
  const isMobile = projectDetail?.device === "mobile"

  // map of screenId -> iframe
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({})

  const SCREEN_WIDTH = isMobile ? 400 : 1200
  const SCREEN_HEIGHT = 800
  const gap = isMobile ? 10 : 20

  /* ---------------- Controls ---------------- */

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls()
    return (
      <div className="absolute p-2 px-3 bg-white shadow flex gap-2 rounded-full bottom-5 left-1/2 -translate-x-1/2 z-30">
        <Button variant="ghost" onClick={() => zoomIn()}><PlusIcon /></Button>
        <Button variant="ghost" onClick={() => zoomOut()}><MinusIcon /></Button>
        <Button variant="ghost" onClick={() => resetTransform()}><RefreshCcwIcon /></Button>
      </div>
    )
  }

  /* ---------------- Screenshot logic ---------------- */

  const captureOneIframe = async (iframe: HTMLIFrameElement) => {
    const doc = iframe.contentDocument
    if (!doc) throw new Error("iframe not ready")

    if (doc.fonts?.ready) await doc.fonts.ready

    return html2canvas(doc.documentElement, {
      useCORS: true,
      allowTaint: true,
      scale: window.devicePixelRatio || 1
    })
  }

  const onTakeScreenshot = async () => {
    try {
      const iframes = Object.values(iframeRefs.current).filter(Boolean) as HTMLIFrameElement[]
      if (!iframes.length) {
        toast.error("No screens to capture")
        return
      }

      const canvases = []
      for (const iframe of iframes) {
        canvases.push(await captureOneIframe(iframe))
      }

      const scale = window.devicePixelRatio || 1
      const headerH = 40

      const outW = Math.max(iframes.length * (SCREEN_WIDTH + gap), SCREEN_WIDTH) * scale
      const outH = (SCREEN_HEIGHT + headerH) * scale

      const out = document.createElement("canvas")
      out.width = outW
      out.height = outH

      const ctx = out.getContext("2d")!
      ctx.clearRect(0, 0, outW, outH)

      canvases.forEach((c, i) => {
        ctx.drawImage(c, i * (SCREEN_WIDTH + gap) * scale, headerH * scale)
      })

      const url = out.toDataURL("image/png")

      await axios.put("/api/project", {
        screenShot: url,
        projectId: projectDetail?.projectId,
        projectName: projectDetail?.projectName,
        theme: projectDetail?.theme
      })

      const a = document.createElement("a")
      a.href = url
      a.download = "canvas.png"
      a.click()
    } catch (e) {
      console.error(e)
      toast.error("Screenshot failed")
    }
  }

  useEffect(() => {
    if (!takeScreenShot) return
    const t = setTimeout(onTakeScreenshot, 500)
    return () => clearTimeout(t)
  }, [takeScreenShot])

  /* ---------------- Render ---------------- */

  return (
    <div
      className="w-full h-screen"
      style={{
        backgroundImage: "radial-gradient(rgba(0,0,0,0.15) 1px , transparent 1px)",
        backgroundSize: "20px 20px"
      }}
    >
      <TransformWrapper
        initialScale={0.2}
        minScale={0.1}
        maxScale={2}
        limitToBounds={false}
        panning={{ disabled: !panningEnable }}
      >
        <Controls />

        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div>
            {screenConfig.map((screen, index) => (
              <div key={index}>
                {screen.code ? (
                  <ScreenFrame
                    x={index * (SCREEN_WIDTH + gap)}
                    y={0}
                    width={SCREEN_WIDTH}
                    height={SCREEN_HEIGHT}
                    setPanningEnable={setPanningEnable}
                    htmlCode={screen.code}
                    projectDetail={projectDetail}
                    screenConfig={screen}
                    iframeRef={(el) => {
                      iframeRefs.current[screen.screenId] = el
                    }}
                  />
                ) : (
                  <div
                    className="bg-white rounded-2xl p-4"
                    style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                  >
                    <Skeleton className="w-full h-10 mb-3" />
                    <Skeleton className="w-1/2 h-20 mb-3" />
                    <Skeleton className="w-3/4 h-20" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default Canvas
