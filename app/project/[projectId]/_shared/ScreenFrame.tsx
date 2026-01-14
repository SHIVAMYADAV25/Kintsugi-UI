"use client"

import { SettingContext } from "@/context/SettingContext"
import { THEMES } from "@/data/themes"
import { ProjectType, ScreenConfig } from "@/type/types"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Rnd } from "react-rnd"
import Screenhandler from "./ScreenHandler"
import { HTMLWrapper } from "@/data/constant"
import type { ThemeKey } from "@/data/themes"


type Props = {
  x: number
  y: number
  setPanningEnable: (enable: boolean) => void
  width: number
  height: number
  htmlCode?: string
  projectDetail?: ProjectType
  screenConfig?: ScreenConfig
  iframeRef: (el: HTMLIFrameElement | null) => void
}

const ScreenFrame = ({
  x,
  y,
  setPanningEnable,
  width,
  height,
  htmlCode,
  projectDetail,
  screenConfig,
  iframeRef
}: Props) => {
  const localIframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    iframeRef(localIframeRef.current)
  }, [iframeRef])

  const clean = (htmlCode ?? "")
    .replace(/```html|```/g, "")
    .replace(/<!doctype[^>]*>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<html[^>]*>/gi, "")
    .replace(/<\/html>/gi, "")
    .replace(/<body[^>]*>/gi, "")
    .replace(/<\/body>/gi, "")

  const { settingDetail } = useContext(SettingContext)

const rawTheme =
  settingDetail?.theme ||
  projectDetail?.theme ||
  "SOFT_MONO"

const themeKey: ThemeKey =
  rawTheme in THEMES ? (rawTheme as ThemeKey) : "SOFT_MONO"

  const theme = THEMES[themeKey] ?? THEMES.SOFT_MONO

  

  /* ------------------ BUILD HTML WITH INITIAL THEME ------------------ */

  const html = HTMLWrapper(theme, clean)

  /* ------------------ LIVE THEME UPDATE ------------------ */

  const camelToKebab = (s: string) =>
    s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())

  useEffect(() => {
    const iframe = localIframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return

    const root = doc.documentElement

    Object.entries(theme).forEach(([key, value]) => {
      if (key === "chart") return
      root.style.setProperty(`--${camelToKebab(key)}`, String(value))
    })

    theme.chart?.forEach((c, i) => {
      root.style.setProperty(`--chart-${i + 1}`, c)
    })
  }, [themeKey])

  /* ------------------ SIZE MANAGEMENT ------------------ */

  const [size, setSize] = useState({ width, height })

  useEffect(() => {
    setSize({ width, height })
  }, [width, height])

  const measureIframeHeight = useCallback(() => {
    const iframe = localIframeRef.current
    if (!iframe) return

    try {
      const doc = iframe.contentDocument
      if (!doc) return

      const htmlEl = doc.documentElement
      const body = doc.body

      const contentH = Math.max(
        htmlEl.scrollHeight,
        body.scrollHeight,
        htmlEl.offsetHeight,
        body.offsetHeight
      )

      const next = Math.min(Math.max(contentH + 48, 160), 2000)

      setSize((s) => (Math.abs(s.height - next) > 2 ? { ...s, height: next } : s))
    } catch {}
  }, [])

  useEffect(() => {
    const iframe = localIframeRef.current
    if (!iframe) return

    const onLoad = () => measureIframeHeight()
    iframe.addEventListener("load", onLoad)
    window.addEventListener("resize", measureIframeHeight)

    const doc = iframe.contentDocument
    const observer = doc
      ? new MutationObserver(() => measureIframeHeight())
      : null

    if (doc) {
      observer?.observe(doc.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      })
    }

    const t1 = setTimeout(measureIframeHeight, 50)
    const t2 = setTimeout(measureIframeHeight, 200)
    const t3 = setTimeout(measureIframeHeight, 600)

    return () => {
      iframe.removeEventListener("load", onLoad)
      window.removeEventListener("resize", measureIframeHeight)
      observer?.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [measureIframeHeight, html])

  /* ------------------ RENDER ------------------ */

  return (
    <Rnd
      default={{ x, y, width, height }}
      size={size}
      dragHandleClassName="drag-handle"
      enableResizing={{ bottomRight: true, bottomLeft: true }}
      onDragStart={() => {
        setPanningEnable(false)
        if (localIframeRef.current)
          localIframeRef.current.style.pointerEvents = "none"
      }}
      onDragStop={() => {
        setTimeout(() => setPanningEnable(true), 50)
        if (localIframeRef.current)
          localIframeRef.current.style.pointerEvents = "auto"
      }}
      onResizeStart={() => setPanningEnable(false)}
      onResizeStop={(_, __, ref) => {
        setPanningEnable(true)
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight
        })
      }}
      cancel=".no-drag"
    >
      <div className="drag-handle cursor-move bg-gray-800 text-white rounded-lg p-3 flex items-center justify-between">
        <Screenhandler
          screen={screenConfig}
          theme={theme}
          iframeRef={localIframeRef}
          projectId={projectDetail?.projectId}
        />
      </div>

      <iframe
        key={`theme-${themeKey}`}    // HARD reset when theme changes
        ref={localIframeRef}
        className="w-full h-[calc(100%-40px)] bg-white rounded-2xl mt-5"
        sandbox="allow-same-origin allow-scripts"
        srcDoc={html}
      />
    </Rnd>
  )
}

export default ScreenFrame
