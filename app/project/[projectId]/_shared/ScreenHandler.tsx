"use client"

import { Button } from "@/components/ui/button"
import { ScreenConfig } from "@/type/types"
import {
  Code2Icon,
  CopyCheckIcon,
  Download,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  SparkleIcon,
  Trash2Icon
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import SyntaxHighlighter from "react-syntax-highlighter"
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { toast } from "sonner"
import { HTMLWrapper } from "@/data/constant"
import html2canvas from "html2canvas"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import axios from "axios"
import { useContext, useState } from "react"
import { RefreshDataContext } from "@/context/RefreshDataContext"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  screen?: ScreenConfig
  theme: any
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  projectId?: string
}

const Screenhandler = ({ screen, theme, iframeRef, projectId }: Props) => {
  const html = HTMLWrapper(theme, screen?.code)
  const { setRefreshData } = useContext(RefreshDataContext)
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)

  /* -------- Screenshot single screen -------- */

  const takeIframeScreenshot = async () => {
    const iframe = iframeRef.current
    if (!iframe) return

    try {
      const doc = iframe.contentDocument
      if (!doc) return

      await new Promise((r) => requestAnimationFrame(r))

      const canvas = await html2canvas(doc.documentElement, {
        useCORS: true,
        scale: window.devicePixelRatio || 1
      })

      const image = canvas.toDataURL("image/png")

      const link = document.createElement("a")
      link.href = image
      link.download = `${screen?.screenName || "screen"}.png`
      link.click()
    } catch (err) {
      console.error(err)
      toast.error("Screenshot failed")
    }
  }

  /* -------- Delete screen -------- */

  const onDelete = async () => {
    if (!projectId || !screen?.screenId) return

    await axios.delete(
      `/api/generateConfig?projectId=${projectId}&screenId=${screen.screenId}`
    )

    toast.success("Screen deleted")
    setRefreshData({ method: "screenConfig", data: Date.now() })
  }

  /* -------- Regenerate screen -------- */

  const editScreen = async () => {
    if (!projectId || !screen?.screenId) return

    try {
      setLoading(true)
      toast.success("Regenerating screen…")

      await axios.post(`/api/edit-screen`, {
        projectId,
        screenId: screen.screenId,
        userInput,
        oldCode: screen.code,
        theme
      })

      setRefreshData({ method: "screenConfig", data: Date.now() })
      toast.success("Screen updated")
    } catch (e) {
      toast.error("Failed to regenerate")
    } finally {
      setLoading(false)
    }
  }

  /* -------- UI -------- */

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-2 text-white">
        <GripVerticalIcon className="h-4 w-4" />
        <span>{screen?.screenName}</span>
      </div>

      <div className="flex gap-1">
        {/* View Code */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost"><Code2Icon /></Button>
          </DialogTrigger>

          <DialogContent className="max-w-5xl w-full h-[70vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>HTML + TailwindCSS</DialogTitle>
              <DialogDescription>
                <div className="overflow-y-auto border rounded-md p-4">
                  <SyntaxHighlighter
                    language="html"
                    style={docco}
                    customStyle={{ whiteSpace: "pre-wrap" }}
                  >
                    {html}
                  </SyntaxHighlighter>

                  <Button
                    className="mt-3"
                    onClick={() => {
                      navigator.clipboard.writeText(html || "")
                      toast.success("Copied")
                    }}
                  >
                    <CopyCheckIcon /> Copy
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Screenshot */}
        <Button variant="ghost" onClick={takeIframeScreenshot}>
          <Download />
        </Button>

        {/* AI Regenerate */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost"><SparkleIcon /></Button>
          </PopoverTrigger>

          <PopoverContent>
            <Textarea
              placeholder="What should change?"
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button
              size="sm"
              className="mt-2"
              onClick={editScreen}
              disabled={loading}
            >
              {loading ? <LoaderIcon className="animate-spin" /> : <SparkleIcon />}
              Regenerate
            </Button>
          </PopoverContent>
        </Popover>

        {/* Delete */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost"><MoreVerticalIcon /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="text-red-500"
              onClick={onDelete}
            >
              <Trash2Icon /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Screenhandler
