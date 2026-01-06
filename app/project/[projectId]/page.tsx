"use client"
import axios from "axios"
import ProjectHeader from "./_shared/ProjectHeader"
import SettingSection from "./_shared/SettingSection"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ProjectType, ScreenConfig } from "@/type/types"
import { Loader2Icon } from "lucide-react"

const page = () => {

  const {projectId} = useParams();
  const [projectDetail,setProjectDetail] = useState<ProjectType>()
  const [screenConfig,setScreenConfig] =useState<ScreenConfig[]>([]);
  const [loading,setLoading] = useState(true);
  const [loadingMessage,setLoadingMessage] = useState("Loading...")

  useEffect(()=>{
    projectId && GetProjectDetail();
  },[projectId]);

  const GetProjectDetail = async () =>{
    setLoadingMessage("Loading...")
    setLoading(true)
    const result = await axios.get("/api/project?projectId="+projectId)
    console.log(result.data)
    setProjectDetail(result.data.projectDetail);
    setScreenConfig(result.data.screenConfig);

    if(result?.data?.screenConfig?.length == 0){
      console.log("hello")
    }

    setLoading(false)
  }

  useEffect(()=>{
    if(projectDetail && screenConfig && screenConfig.length == 0){
      // generateScreenConfig();
      console.log("Generating Screen Config...")
    }
  },[projectDetail&&screenConfig])

  const generateScreenConfig= async ()=>{
    setLoading(true);
    setLoadingMessage("Generating Screen Config...");
    const result = await axios.post("/api/generateConfig",{
      projectId:projectId,
      deviceType:projectDetail?.device,
      userInput:projectDetail?.userInput
    })

    console.log(result.data);
    GetProjectDetail();
    setLoading(false)
  }

  return (
    <div>
        <ProjectHeader/>
        <div>
            {loading && <div className="p-3 absolute
            left-1/2 top-20  bg-blue-300/20 border-blue-400 border rounded-xl">
              <h2 className="flex gap-2 items-center"> <Loader2Icon className="animate-spin"/>{loadingMessage}</h2>
            </div>}
            {/* setting */}
            <SettingSection projectDetail={projectDetail}/>

            {/* canvas */}
        </div>
    </div>
  )
}

export default page

