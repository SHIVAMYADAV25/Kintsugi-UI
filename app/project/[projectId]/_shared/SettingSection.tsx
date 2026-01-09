"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RefreshDataContext } from '@/context/RefreshDataContext';
import { SettingContext } from '@/context/SettingContext';
import { THEMES, THEME_NAME_LIST } from "@/data/themes";
import { ProjectType } from '@/type/types';
import axios from 'axios';
import { CameraIcon, Loader2Icon, ShareIcon, SparkleIcon } from 'lucide-react'
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

type props={
    projectDetail:ProjectType | undefined,
    screenDescription ?: string[] | undefined,
    takeScreenShot: () => void
}

const SettingSection = ({projectDetail,screenDescription,takeScreenShot}:props) => {
    const [selectedTheme,setSelectedTheme] = useState("PAPER_GRAY");
    const [projectName,setProjectName] = useState(projectDetail?.projectName);
    const [userNewScreenInput,setUserNewScreenInput] = useState("");
    const {settingDetail,setSettingDetail} = useContext(SettingContext)
    const [loading,setLoading] = useState(false)
    const [loadingMessage,setLoadingMessage] = useState("Loading...");
    const {refresData,setRefreshData} = useContext(RefreshDataContext)

    useEffect(()=>{
        projectDetail&&setProjectName(projectDetail.projectName)
        setSelectedTheme(projectDetail?.theme as string)
    },[projectDetail])

    const onThemeSelect = (theme:string) => {
        setSelectedTheme(theme)
        setSettingDetail((prev : any) => ({
            ...prev,
            theme
        }))
        // console.log(settingDetail)
    }

    const GenerateNewScreen = async () =>{
        setLoading(true);
        // setLoadingMessage("Screen is getting Load")
        toast.success("Screen is Getting Generated Please Wait !!");
        const result = await axios.post("/api/generateConfig",{
            projectId : projectDetail?.projectId,
            deviceType : projectDetail?.device,
            userInput :  userNewScreenInput,
            theme : projectDetail?.theme,
            oldScreenDescription: screenDescription
        })
        console.log(result.data);
        setRefreshData({method:"screenConfig",data:Date.now()})
        toast.success("Screen has been Generated")
        setLoading(false)
    }

    useEffect(() => {
        console.log("Updated theme:", settingDetail?.theme);
    }, [settingDetail?.theme]);


  return (
    <div className='w-[300px] h-[90vh] p-5 border-r'>
      <h2 className='font-medium text-lg'>Setting</h2>

      {loading && <div className="p-3 absolute
            left-1/2 top-20  bg-blue-300/20 border-blue-400 border rounded-xl">
              <h2 className="flex gap-2 items-center"> <Loader2Icon className="animate-spin"/>{loadingMessage}</h2>
            </div>}

        <div className='mt-3'>
            <h2 className='text-sm mb-1'>Project Name</h2>
            <Input placeholder='Project Name' value={projectName} 
            onChange={
            (event)=> {setProjectName(event.target.value) 
            setSettingDetail((prev : any) => ({
            ...prev,
            projectName : projectName
            }))
        }}/>
        </div>

        <div className='mt-3'>
            <h2 className='text-sm mb-1'>Generate New Screen</h2>
            <Textarea placeholder='Enter Prompt to Generate New Screen with AI' onChange={(event) => setUserNewScreenInput(event.target.value)}/>
            <Button size={"sm"} className="mt-2 w-full" onClick={() => GenerateNewScreen()} disabled={loading}>{ loading ? <Loader2Icon className='animate-spin'/> : <SparkleIcon/> }Generate</Button>
        </div>

        <div className='mt-3'>
            <h2 className='text-sm mb-1'>Theme</h2>
            <div className='h-[200px] overflow-auto'>
                <div>
                    {THEME_NAME_LIST.map((name) => {
                    const theme = THEMES[name]; // typed as Theme

                    return (
                        <div key={name} className={`border rounded-2xl p-2 mb-2 ${name === selectedTheme && "border-primary bg-primary/20"}`} onClick={() => onThemeSelect(name)}>
                        <p className="text-xs font-medium">{name}</p>

                        <div className={`flex gap-1 mt-2` } >
                            <div className="w-6 h-6 rounded" style={{ background: theme.primary }} />
                            <div className="w-6 h-6 rounded" style={{ background: theme.secondary }} />
                            <div className="w-6 h-6 rounded" style={{ background: theme.accent }} />
                            <div className="w-6 h-6 rounded border" style={{ background: theme.background }} />
                        </div>
                        </div>
                    );
                    })}
                </div>
            </div>
        </div>

        <div className='mt-3'>
            <h2 className='text-sm mb-1'>Extras</h2>
            <div className='flex gap-3 '>
            <Button size={"sm"} variant={"outline"}className="mt-2 " onClick={()=>takeScreenShot()}><CameraIcon/>ScreenShot</Button>
            <Button size={"sm"} variant={"outline"}className="mt-2 "><ShareIcon/>Share</Button>
            </div>
        </div>

    </div>
  )
}

export default SettingSection
