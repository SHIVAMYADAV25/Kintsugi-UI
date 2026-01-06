"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { THEMES, THEME_NAME_LIST } from "@/data/themes";
import { CameraIcon, ShareIcon, SparkleIcon } from 'lucide-react'
import { useState } from 'react';

const SettingSection = () => {
    const [selectedTheme,setSelectedTheme] = useState("PAPER_GRAY");
    const [projectName,setProjectName] = useState("");
    const [userNewScreenInput,setUserNewScreenInput] = useState("");

  return (
    <div className='w-[300px] h-[90vh] p-5 border-r'>
      <h2 className='font-medium text-lg'>Setting</h2>

        <div className='mt-3'>
            <h2 className='text-sm mb-1'>Project Name</h2>
            <Input placeholder='Project Name' onChange={(event)=>setProjectName(event.target.value)}/>
        </div>

        <div className='mt-3'>
            <h2 className='text-sm mb-1'>Generate New Screen</h2>
            <Textarea placeholder='Enter Prompt to Generate New Screen with AI' onChange={(event) => setUserNewScreenInput(event.target.value)}/>
            <Button size={"sm"} className="mt-2 w-full"><SparkleIcon/>Generate</Button>
        </div>

        <div className='mt-3'>
            <h2 className='text-sm mb-1'>Theme</h2>
            <div className='h-[200px] overflow-auto'>
                <div>
                    {THEME_NAME_LIST.map((name) => {
                    const theme = THEMES[name]; // typed as Theme

                    return (
                        <div key={name} className={`border rounded-2xl p-2 ${name === selectedTheme && "border-primary bg-primary/20"}`} onClick={()=>setSelectedTheme(name)}>
                        <p className="text-xs font-medium">{name}</p>

                        <div className={`flex gap-1 mt-2`} >
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
            <Button size={"sm"} variant={"outline"}className="mt-2 "><CameraIcon/>ScreenShot</Button>
            <Button size={"sm"} variant={"outline"}className="mt-2 "><ShareIcon/>Share</Button>
            </div>
        </div>

    </div>
  )
}

export default SettingSection
