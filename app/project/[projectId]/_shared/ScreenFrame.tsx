import { SettingContext } from '@/context/SettingContext'
import { THEMES, themeToCssVars } from '@/data/themes'
import { ProjectType, ScreenConfig } from '@/type/types'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {Rnd} from "react-rnd"
import Screenhandler from './ScreenHandler'
import { HTMLWrapper } from '@/data/constant'

type props = {
    x:number,
    y:number,
    setPanningEnable:(enable:boolean)=>void,
    width:number,
    height:number,
    htmlCode : string | undefined,
    projectDetail :ProjectType | undefined;
    screenConfig : ScreenConfig | undefined
}

const ScreenFrame = ({x,y,setPanningEnable,width,height,htmlCode,projectDetail,screenConfig}:props) => {


const clean = (htmlCode ?? "")
  .replace(/```html|```/g, "")
  .replace(/<!doctype[^>]*>/gi, "")
  .replace(/<head[\s\S]*?<\/head>/gi, "")
  .replace(/<html[^>]*>/gi, "")
  .replace(/<\/html>/gi, "")
  .replace(/<body[^>]*>/gi, "")
  .replace(/<\/body>/gi, "");


    const {settingDetail,setSettingDetail} = useContext(SettingContext)
    //@ts-ignore
    const themeKey =
    (settingDetail?.theme as string) ??
    (projectDetail?.theme as string) ??
    "SOFT_MONO";

  const theme =
    THEMES[themeKey as keyof typeof THEMES] ?? THEMES.SOFT_MONO;
    // console.log(themeToCssVars(theme))

    const iframeRef =  useRef<HTMLIFrameElement | null>(null);

    // useEffect(()=>{console.log(html)},[])

    const html = HTMLWrapper(theme,clean)

    const [size,setSize] = useState({width,height})

    useEffect(()=>{
      setSize({width,height})
    },[height,width])

    const measureIframeHeight = useCallback(() => {
  const iframe = iframeRef.current;
  if (!iframe) return;

  try {
    const doc = iframe.contentDocument ;
    if (!doc) return;

    const headerH = 48; // if any drag_bar height
    const htmlEl = doc.documentElement;
    const body = doc.body;

    // choose the largest plausible height
    const contentH = Math.max(
      htmlEl?.scrollHeight ?? 0,
      body?.scrollHeight ?? 0,
      htmlEl?.offsetHeight ?? 0,
      body?.offsetHeight ?? 0
    );

    // optional min/max clamps
    const next = Math.min(Math.max(contentH + headerH, 160), 2000);

    setSize((s) =>
      (Math.abs(s.height - next) > 2 ? { ...s, height: next } : s)
    );
  } catch (_) {
    // if sandbox/origin blocks access, we can't measure
    return;
  }
}, []);

useEffect(() => {
  const iframe = iframeRef.current;
  if (!iframe) return;

  const onLoad = () => measureIframeHeight();

  const doc = iframe.contentDocument;
  const observer =
    doc
      ? new MutationObserver(() => measureIframeHeight())
      : null;

  if (doc) {
    observer!.observe(doc.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
  }

  iframe.addEventListener("load", onLoad);
  window.addEventListener("resize", measureIframeHeight);

  const t1 = setTimeout(measureIframeHeight, 50);
  const t2 = setTimeout(measureIframeHeight, 200);
  const t3 = setTimeout(measureIframeHeight, 600);

  return () => {
    iframe.removeEventListener("load", onLoad);
    window.removeEventListener("resize", measureIframeHeight);
    observer?.disconnect();
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
  };
}, [measureIframeHeight, htmlCode]);



  return (
    <div>
      <Rnd 
        default={{
            x,y,width:width,height:height
        }}
        size={size}
        dragHandleClassName='drag-handle'
        enableResizing={{bottomRight:true,bottomLeft:true}}
        onDragStart={() => {
          setPanningEnable(false);
          if (iframeRef.current) iframeRef.current.style.pointerEvents = "none";
        }}
        onDragStop={() => {
          setTimeout(() => setPanningEnable(true), 50);
          if (iframeRef.current) iframeRef.current.style.pointerEvents = "auto";
        }}
        onResizeStart={()=>setPanningEnable(false)}
        onResizeStop={(_,__,ref,___,position)=>{
          setPanningEnable(true)
          setSize({
            width:ref.offsetWidth,
            height:ref.offsetHeight
          })
        }}
        disableDragging={false}
        cancel='.no-drag'
      >
        <div className='drag-handle cursor-move bg-gray-800 text-white rounded-lg p-3 flex gap-2 items-center'> 
            <Screenhandler screen={screenConfig} theme={theme} iframeRef={iframeRef} projectId={projectDetail?.projectId}/>
        </div>
        <iframe 
            key={settingDetail?.theme ?? projectDetail?.theme}
            ref={iframeRef}
            className='w-full h-[calc(100%-40px)] bg-white rounded-2xl mt-5' 
            sandbox='allow-same-origin allow-scripts'
            srcDoc={html}
        />
      </Rnd>
    </div>
  )
}

export default ScreenFrame
