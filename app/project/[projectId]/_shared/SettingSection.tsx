"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RefreshDataContext } from "@/context/RefreshDataContext"
import { SettingContext } from "@/context/SettingContext"
import { THEMES, THEME_NAME_LIST } from "@/data/themes"
import { ProjectType } from "@/type/types"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { CameraIcon, Loader2Icon, ShareIcon, SparkleIcon } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"

type Props = {
  projectDetail?: ProjectType
  screenDescription?: string[]
  takeScreenShot: () => void
}

const SettingSection = ({
  projectDetail,
  screenDescription,
  takeScreenShot
}: Props) => {
  const { settingDetail, setSettingDetail } = useContext(SettingContext)
  const { setRefreshData } = useContext(RefreshDataContext)

  const [selectedTheme, setSelectedTheme] = useState("PAPER_GRAY")
  const [projectName, setProjectName] = useState("")
  const [userNewScreenInput, setUserNewScreenInput] = useState("")
  const [loading, setLoading] = useState(false)

  const { has } = useAuth()
  const hasPremiumAccess = has?.({ plan: "unlimited" }) ?? false

  /* ---------- Sync project ---------- */

  useEffect(() => {
    if (!projectDetail) return

    //@ts-ignore
    setProjectName(projectDetail.projectName)
    //@ts-ignore
    setSelectedTheme(projectDetail.theme)

    setSettingDetail(projectDetail)
  }, [projectDetail])

  /* ---------- Theme ---------- */

  const onThemeSelect = (theme: string) => {
    setSelectedTheme(theme)
    setSettingDetail((prev: any) => ({ ...prev, theme }))
  }

  /* ---------- Generate new screen ---------- */

  const GenerateNewScreen = async () => {
    if (!hasPremiumAccess) {
      toast.error("Upgrade to generate new screens")
      return
    }

    if (!userNewScreenInput.trim()) {
      toast.error("Enter a prompt")
      return
    }

    try {
      setLoading(true)
      toast.success("Generating new screen...")

      await axios.post("/api/generateConfig", {
        projectId: projectDetail?.projectId,
        deviceType: projectDetail?.device,
        userInput: userNewScreenInput,
        theme: settingDetail?.theme,
        oldScreenDescription: screenDescription
      })

      setRefreshData({ method: "screenConfig", data: Date.now() })
      toast.success("New screen created")
      setUserNewScreenInput("")
    } catch {
      toast.error("Generation failed")
    } finally {
      setLoading(false)
    }
  }

  /* ---------- Project name ---------- */

  const onProjectNameChange = (val: string) => {
    setProjectName(val)
    setSettingDetail((prev: any) => ({ ...prev, projectName: val }))
  }

  /* ---------- UI ---------- */

  return (
    <div className="w-[300px] h-[90vh] p-5 border-r overflow-y-auto">
      <h2 className="font-medium text-lg">Settings</h2>

      {/* Project name */}
      <div className="mt-3">
        <h2 className="text-sm mb-1">Project Name</h2>
        <Input
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
        />
      </div>

      {/* Generate */}
      <div className="mt-3">
        <h2 className="text-sm mb-1">Generate New Screen</h2>
        <Textarea
          value={userNewScreenInput}
          onChange={(e) => setUserNewScreenInput(e.target.value)}
          placeholder="Describe the screen you want..."
        />
        <Button
          size="sm"
          className="mt-2 w-full"
          onClick={GenerateNewScreen}
          disabled={loading}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : <SparkleIcon />}
          Generate
        </Button>
      </div>

      {/* Themes */}
      <div className="mt-3">
        <h2 className="text-sm mb-1">Theme</h2>
        <div className="h-[200px] overflow-auto">
          {THEME_NAME_LIST.map((name) => {
            const theme = THEMES[name]
            return (
              <div
                key={name}
                className={`border rounded-xl p-2 mb-2 cursor-pointer ${
                  name === selectedTheme ? "border-primary bg-primary/20" : ""
                }`}
                onClick={() => onThemeSelect(name)}
              >
                <p className="text-xs font-medium">{name}</p>
                <div className="flex gap-1 mt-2">
                  <div className="w-6 h-6 rounded" style={{ background: theme.primary }} />
                  <div className="w-6 h-6 rounded" style={{ background: theme.secondary }} />
                  <div className="w-6 h-6 rounded" style={{ background: theme.accent }} />
                  <div className="w-6 h-6 rounded border" style={{ background: theme.background }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Extras */}
      <div className="mt-3">
        <h2 className="text-sm mb-1">Extras</h2>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" onClick={takeScreenShot}>
            <CameraIcon /> Screenshot
          </Button>
          <Button size="sm" variant="outline">
            <ShareIcon /> Share
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingSection
