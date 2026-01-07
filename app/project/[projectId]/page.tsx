"use client"
import axios from "axios"
import ProjectHeader from "./_shared/ProjectHeader"
import SettingSection from "./_shared/SettingSection"
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { ProjectType, ScreenConfig } from "@/type/types"
import { Loader2Icon } from "lucide-react"
import Canvas from "./_shared/Canvas"
import { SettingContext } from "@/context/SettingContext"

const page = () => {

  const {projectId} = useParams();
  const [projectDetail,setProjectDetail] = useState<ProjectType>()
  const [screenConfigOriginal,setScreenConfigOriginal] =useState<ScreenConfig[]>([]);
  const [screenConfig,setScreenConfig] =useState<ScreenConfig[]>([]);
  const [loading,setLoading] = useState(true);
  const [loadingMessage,setLoadingMessage] = useState("Loading...")
  const {settingDetail,setSettingDetail} = useContext(SettingContext)

  useEffect(()=>{
    projectId && GetProjectDetail();
  },[projectId]);

  const GetProjectDetail = async () =>{
    setLoadingMessage("Loading...")
    setLoading(true)
    const result = await axios.get("/api/project?projectId="+projectId)
    console.log(result.data)
    setProjectDetail(result.data.projectDetail);
    setScreenConfigOriginal(result.data.screenConfig);
    setScreenConfig(result.data.screenConfig);
    setSettingDetail(result.data.projectDetail);
    if(result?.data?.screenConfig?.length == 0){
      console.log("hello")
    }

    setLoading(false)
  }

  useEffect(()=>{
    if (!projectDetail) return;

  if (screenConfigOriginal.length === 0 && screenConfigOriginal && projectDetail) {
    console.log("Generating Screen Config...");
    generateScreenConfig();
  } else {
    GenerateScreenUIUX();
  }
  },[screenConfigOriginal])

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

  const GenerateScreenUIUX = async () =>{
    setLoading(true)

    for(let index=0;index<screenConfig?.length;index++){
      const screen=screenConfig[index];
      if(screen.code) continue;

      setLoadingMessage("Generating Screen"+index+1);
      const result = await axios.post("/api/generate-screen-ui",{
        projectId,
        screenId : screen.screenId,
        screenName:screen.screenName,
        purpose:screen.purpose,
        screenDescription:screen.screenDescription
      })

      console.log("console.log"+result.data)
      setScreenConfig(prev=>prev.map((item,i)=>(
        i === index ? result.data : item
      )))
    }
    // console.log("hello")
    setLoading(false)
  }

  return (
    <div>
        <ProjectHeader/>
        <div className="flex">
            {loading && <div className="p-3 absolute
            left-1/2 top-20  bg-blue-300/20 border-blue-400 border rounded-xl">
              <h2 className="flex gap-2 items-center"> <Loader2Icon className="animate-spin"/>{loadingMessage}</h2>
            </div>}
            {/* setting */}
            <SettingSection projectDetail={projectDetail}/>

            {/* canvas */}
            <Canvas projectDetail={projectDetail}  screenConfig={screenConfig}/>
        </div>
    </div>
  )
}

export default page

