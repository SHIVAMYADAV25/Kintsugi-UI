"use client"

import { Button } from "@/components/ui/button"
import { SettingContext } from "@/context/SettingContext"
import axios from "axios"
import { Loader2Icon, SaveIcon } from "lucide-react"
import Image from "next/image"
import { useContext, useState } from "react"
import { toast } from "sonner"

const ProjectHeader = () => {
  const { settingDetail } = useContext(SettingContext)
  const [loading, setLoading] = useState(false)

  const onSave = async () => {
    if (!settingDetail?.projectId) {
      toast.error("Project not loaded")
      return
    }

    try {
      setLoading(true)

      await axios.put("/api/project", {
        theme: settingDetail.theme,
        projectId: settingDetail.projectId,
        projectName: settingDetail.projectName
      })

      toast.success("Settings saved")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-between items-center p-3 shadow">
      <div className="flex gap-2 items-center">
        <Image src="/ux_logo.webp" alt="logo" width={40} height={40} />
        <h2 className="text-xl font-semibold">
          Kintsugi <span className="text-primary">UI</span>
        </h2>
      </div>

      <Button onClick={onSave} disabled={loading || !settingDetail}>
        {loading ? <Loader2Icon className="animate-spin" /> : <><SaveIcon /> Save</>}
      </Button>
    </div>
  )
}

export default ProjectHeader
