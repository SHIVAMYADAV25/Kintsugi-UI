import { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import ScreenFrame from './ScreenFrame';
import { ProjectType, ScreenConfig } from '@/type/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Cross, Ghost, MinusIcon, PlusIcon, RefreshCcwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import axios from 'axios';

type Props = {
    projectDetail : ProjectType | undefined,
    screenConfig : ScreenConfig[],
    loading?:boolean,
    takeScreenShot:any
}

const Canvas = ({projectDetail,screenConfig,loading,takeScreenShot}:Props) => {

    const [panningEnable,setPanningEnable] = useState(true);
    const isMobile = projectDetail?.device === "mobile";
    const iframeRefs =  useRef<(HTMLIFrameElement | null)[]>([]);
    const SCREEN_WIDTH = isMobile?400:1200;
    const SCREEN_HEIGTH = isMobile?800:800;
    const gap=isMobile ? 10 : 20;

    const Controls = () => {
        const { zoomIn, zoomOut, resetTransform } = useControls();

        return (
            <div className="tools absolute p-2 px-3 bg-white shadow flex gap-2 rounded-4xl bottom-5 left-1/2 z-30 text-gray-500 ">
            <Button variant={"ghost"} onClick={() => zoomIn()}><PlusIcon/></Button>
            <Button variant={"ghost"} onClick={() => zoomOut()}><MinusIcon/></Button>
            <Button variant={"ghost"} onClick={() => resetTransform()}><RefreshCcwIcon/></Button>
            </div>
        );
        };

 const captureOneIframe = async (iframe: HTMLIFrameElement) => {
  if (!iframe?.contentDocument || !iframe.contentWindow) {
    throw new Error("iframe not ready");
  }

  const doc = iframe.contentDocument;

  if (doc.readyState !== "complete") {
    await new Promise((r) => setTimeout(r, 300));
  }

  if (doc.fonts?.ready) {
    await doc.fonts.ready;
  }

  const target = doc.documentElement;

  return await html2canvas(target, {
    useCORS: true,
    allowTaint: true,
    scale: window.devicePixelRatio || 1,

    onclone: (clonedDoc) => {
      clonedDoc.documentElement.style.background =
        getComputedStyle(doc.documentElement).background;

      clonedDoc.body.style.background =
        getComputedStyle(doc.body).background;
    },
  });
};


const onTakeScreenshot = async (saveOnly = false) => {
  try {
    const iframes = iframeRefs.current.filter(Boolean) as HTMLIFrameElement[];
    if (!iframes.length) {
      toast.error("No iframes found to capture");
      return;
    }

    // capture each iframe to its own canvas
    const shotCanvases: HTMLCanvasElement[] = [];
    for (let i = 0; i < iframes.length; i++) {
      const c = await captureOneIframe(iframes[i]);
      shotCanvases.push(c);
    }

    // stitch into final canvas (side-by-side)
    const scale = window.devicePixelRatio || 1;
    const headerH = 40; // same as your header
    const outW =
      Math.max(iframes.length * (SCREEN_WIDTH + gap), SCREEN_WIDTH) * scale;
    const outH = (SCREEN_HEIGTH + headerH) * scale;

    const out = document.createElement("canvas");
    out.width = outW;
    out.height = outH;

    const ctx = out.getContext("2d");
    if (!ctx) throw new Error("No 2d context");

    // optional transparent background
    ctx.clearRect(0, 0, outW, outH);

    // draw each screen
    for (let i = 0; i < shotCanvases.length; i++) {
      const x = i * (SCREEN_WIDTH + gap) * scale;
      const y = headerH * scale; // because iframe capture is body only
      ctx.drawImage(shotCanvases[i], x, y);
    }

    // download
    const url = out.toDataURL("image/png");
    updateProjectWithScreenShot(url);
    if(!saveOnly){
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.png";
    a.click();
    }
  } catch (e) {
    console.error(e);
    toast.error("Capture failed (iframe)");
  }
};

      useEffect(() => {
  if (!takeScreenShot) return;

  const timeout = setTimeout(() => {
    onTakeScreenshot();
  }, 500); // ⏳ critical delay

  return () => clearTimeout(timeout);
}, [takeScreenShot]);



    const updateProjectWithScreenShot = async (base64Url:string) =>{
        const result = await axios.put("/api/project",{
            screenShot : base64Url,
            projectName:projectDetail?.projectName,
            projectId: projectDetail?.projectId,
            theme : projectDetail?.theme
        })
        console.log(result.data)
    }

  return (
    <div className='w-full h-screen bg-gray-200/20' 
    style={{
        backgroundImage:"radial-gradient(rgba(0,0,0,0.15) 1px , transparent 1px)",
        backgroundSize:"20px 20px"
    }}>
        <TransformWrapper
            initialScale={0.2}
            minScale={0.1}
            maxScale={2}
            initialPositionX={50}
            initialPositionY={50}
            limitToBounds={false}
            wheel={{step:0.8}}
            doubleClick={{disabled:false}}

            panning={{
                disabled: !panningEnable,
                velocityDisabled: false,   // <— smooth panning
                lockAxisX: false,
                lockAxisY: false
            }}
        >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <Controls />
            <TransformComponent
                wrapperStyle={{width:"100%",height:"100%"}}
            >
                <div>
                    {screenConfig.map((Item,index)=>(
                        <div key={index}> 
                            { Item.code ? 
                                <ScreenFrame
                                    x={index * (SCREEN_WIDTH + gap)}
                                    y={0}
                                    width={SCREEN_WIDTH}
                                    height={SCREEN_HEIGTH}
                                    setPanningEnable={setPanningEnable}
                                    htmlCode={Item.code}
                                    projectDetail={projectDetail}
                                    screenConfig={Item}
                                    iframeRef={(ifrm:any) => (iframeRefs.current[index] = ifrm)}
                                />
                             : 
                                <div
                                    className="bg-white rounded-2xl gap-4 flex flex-col"
                                    style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGTH }}
                                >
                                    <Skeleton className='w-full rounded-lg h-10 bg-gray-300'/> 
                                    <Skeleton className='w-[50%] rounded-lg h-20 bg-gray-300'/> 
                                    <Skeleton className='w-[70%] rounded-lg h-30 bg-gray-300'/> 
                                    <Skeleton className='w-[30%] rounded-lg h-10 bg-gray-300'/> 
                                    <Skeleton className='w-full rounded-lg h-10 bg-gray-300'/> 
                                    <Skeleton className='w-[50%] rounded-lg h-20 bg-gray-300'/> 
                                    <Skeleton className='w-[70%] rounded-lg h-30 bg-gray-300'/> 
                                    <Skeleton className='w-[30%] rounded-lg h-10 bg-gray-300'/>
                                </div>
                            }
                        </div>
                    ))} 
                </div>
                
                {/* <ScreenFrame x={300} y={0} setPanningEnable={setPanningEnable}/> */}
            </TransformComponent>
            </>)}
        </TransformWrapper>
    </div>
  )
}

export default Canvas