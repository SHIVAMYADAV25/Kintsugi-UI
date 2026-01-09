import { Button } from '@/components/ui/button'
import { ScreenConfig } from '@/type/types'
import { Code2Icon, CopyCheckIcon, Download, GripVerticalIcon, LoaderIcon, MoreVerticalIcon, SparkleIcon, Trash2Icon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { toast } from 'sonner';
import { HTMLWrapper } from '@/data/constant';
import html2canvas from "html2canvas"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from 'axios';
import { useContext, useState } from 'react';
import { RefreshDataContext } from '@/context/RefreshDataContext';
import { Textarea } from '@/components/ui/textarea'


type Props = {
  screen : ScreenConfig  | undefined,
  theme  : any,
  iframeRef : any,
  projectId : string | undefined,
}

const Screenhandler = ({screen , theme, iframeRef,projectId}:Props) => {
  const html = HTMLWrapper(theme,screen?.code);
  const {refresData,setRefreshData} = useContext(RefreshDataContext);
  const [userInput,setUserInput] = useState("");
  const [loading,setLoading] = useState(false)

  const takeIframeScreenshot = async () => {
  const iframe = iframeRef.current;
  if (!iframe) return;

  try {
    const doc = iframe.contentDocument;
    if (!doc) return;

    const body = doc.body;

    // wait one frame to ensure layout is stable
    await new Promise((res) => requestAnimationFrame(res));

    const canvas = await html2canvas(body, {
      backgroundColor: null,
      useCORS: true,
      //@ts-ignore
      scale: window.devicePixelRatio || 1,
    });

    const image = canvas.toDataURL("image/png");

    // download automatically
    const link = document.createElement("a");
    link.href = image;
    link.download = `${screen?.screenName || "screen"}.png`;
    link.click();
  } catch (err) {
    console.error("Screenshot failed.", err);
  }
  };

  const onDelete = async () => {
    const result = await axios.delete(`/api/generateConfig?projectId=${projectId}&screenId=${screen?.screenId}`);
    toast.success("Screen Deleted");
    setRefreshData({method:"screenConfig",data:Date.now()})
  }

  const editScreen = async () =>{
    setLoading(true)
    toast.success("Regenerating new screen Please wait");
    const result = await axios.post(`/api/edit-screen`,{
      projectId:projectId,
      screenId : screen?.screenId,
      userInput : userInput,
      oldCode : screen?.code,
      theme
    });

    console.log(result.data);
    setRefreshData({method:"screenConfig",data:Date.now()})
    toast.success("Screen generated success")
    setLoading(false);
  }


  return (
    <div className='flex justify-between items-center w-full'>
      <div className='flex items-center gap-2'>
       <GripVerticalIcon className='text-gray-50 h-4 w-4'/> Drag Here
       <h2>{screen?.screenName}</h2>
      </div>

      <div>
        <Dialog>
          <DialogTrigger className='border-none'><Button variant={"ghost"}><Code2Icon/></Button></DialogTrigger>
          <DialogContent className='max-w-5xl w-full h-[70vh] flex flex-col'>
            <DialogHeader>
              <DialogTitle>HTML + TailwindCSS code</DialogTitle>
              <DialogDescription>
                <div className='flex-1 overflow-y-auto rounded-md border bg-muted p-4'>
                {/* @ts-ignore */}
                <SyntaxHighlighter 
                language="html" 
                style={docco}
                customStyle={{
                  margin:0,
                  padding:0,
                  whiteSpace:"pre-wrap",
                  wordBreak:'break-word',
                  overflowX:"hidden",
                  height:"50vh"
                }}
                codeTagProps={{
                  style:{
                    whiteSpace:"pre-wrap",
                    wordBreak:"break-word"
                  }
                }}
                >
                  {html}
                </SyntaxHighlighter>
                <Button 
                  className='mt-3'
                  onClick={() => {
                    navigator.clipboard.writeText(html as string) ; 
                    toast.success("code Copied!")
                  }}  
                ><CopyCheckIcon/> Copy</Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Button variant={"ghost"} 
        onClick={() => {
          takeIframeScreenshot();
          toast.success("ScreenShot Downloaded !!!")
        }}>
          <Download/>
        </Button>

        <Popover>
  <PopoverTrigger>
    <Button variant={"ghost"}>  <SparkleIcon/> </Button>
  </PopoverTrigger>
  <PopoverContent>
    <div><Textarea placeholder='what change you want to make ?' onChange={(event)=>setUserInput(event.target.value)}/></div>
    <Button className='mt-2' size={"sm"} onClick={()=>editScreen()} disabled={loading}> {loading ? <LoaderIcon className="animate-spin" /> : <SparkleIcon/> }Regenerate</Button>
  </PopoverContent>
</Popover>
        
        <DropdownMenu>
  <DropdownMenuTrigger><Button variant={"ghost"}><MoreVerticalIcon/></Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem variant={'destructive'} onClick={()=>onDelete()}><Trash2Icon/> Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
      </div>
    </div>
  )
}

export default Screenhandler







