"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Loader, Send } from "lucide-react"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { suggestions } from "@/data/constant"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import axios from "axios"



const Hero = () => {

    const [userInput,setUserInput] = useState<string>();
    const [device,setDevice] = useState<string>("website");
    const {user} = useUser();
    const router = useRouter();
    const [loading,setLoading] = useState<boolean>(false);

    const onCreateProject = async () =>{
        if(!user){
            router.push("/sign-in");
            return
        }

        if(!userInput){
          return
        }

        setLoading(true);
        const projectId = crypto.randomUUID()
        // Create new Project
        const project = await axios.post("/api/project",{userInput : userInput,device :device,projectId : projectId})

        console.log(project.data);
        setLoading(false);
    }

  return (
    <div className='p-10 md:px-24 lg:px-48 xl:px60 mt-20'>
      <h2 className='text-5xl font-bold text-center'>Design High Quality <br/> <span className='text-primary'>Website and Mobile App Design</span> </h2>
      <div className="flex items-center justify-center w-full">
            <TypingAnimation
                words={["Imagine your Idea and turn into reality"]}
                typeSpeed={50}
                deleteSpeed={150}
                pauseDelay={2000}
                className="text-gray-900 text-lg"
                loop
                />
        </div>
      <div className="flex w-full gap-6 items-center justify-center mt-5">
      <InputGroup className="max-w-xl bg-gray-50 z-10 rounded-2xl">
        <InputGroupTextarea
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-20 max-h-24 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Enter what design i want to create"
          value={userInput}
          onChange={(Event) => setUserInput(Event.target.value)}
        />
        <InputGroupAddon align="block-end">
        <Select defaultValue="website" onValueChange={(value) => setDevice(value)}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
        </Select>
          <InputGroupButton className="ml-auto" size="sm" variant="default" onClick={()=>onCreateProject()} disabled={loading}>
            {loading ? <Loader className="animate-spin" /> : <Send/> }
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
        <div className="flex items-center gap-5 mt-4">
        {suggestions.map((item) => {
            const Icon = item.icon;
            return (
            <div key={item.name} onClick={()=>setUserInput(item.description)} className="flex p-2 border rounded-2xl items-center flex-col bg-gray-50 z-10  cursor-pointer">
                <Icon size={24} />
                <h2 className="text-center line-clamp-2 text-sm">{item.name}</h2>
            </div>
            );
        })}
        </div>
    </div>
  )
}

export default Hero
