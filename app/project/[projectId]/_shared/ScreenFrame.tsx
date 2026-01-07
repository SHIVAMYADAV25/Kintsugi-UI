import { themeToCssVars } from '@/data/themes'
import { ProjectType } from '@/type/types'
import { GripVerticalIcon } from 'lucide-react'
import React from 'react'
import {Rnd} from "react-rnd"

type props = {
    x:number,
    y:number,
    setPanningEnable:(enable:boolean)=>void,
    width:number,
    height:number,
    htmlCode : string | undefined,
    projectDetail :ProjectType | undefined
}

const ScreenFrame = ({x,y,setPanningEnable,width,height,htmlCode,projectDetail}:props) => {


    const replaceCode = htmlCode?.replaceAll("```html","").replaceAll("```","")
    const theme = projectDetail?.theme

    const html = `
        <!doctype html>
        <html>
        <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <!-- Google Font -->
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>

        <!-- Tailwind -->
        <script src="https://cdn.tailwindcss.com/3.0.0"></script>

        <!-- Iconify -->
        <script src="https://code.iconify.design/iconify-icon/3.0.0/iconify-icon.min.js"></script>

        <style>
            ${themeToCssVars(theme)}
        </style>
        </head>

        <body class="bg-[var(--background)] text-[var(--foreground)] w-full">
        ${replaceCode ?? ""}
        </body>

        </html>
        `;


  return (
    <div>
      <Rnd 
        default={{
            x,y,width:width,height:height
        }}
        dragHandleClassName='drag-handle'
        enableResizing={{bottomRight:true,bottomLeft:true}}
        onDragStart={()=>setPanningEnable(false)}
        onDragStop={()=>setPanningEnable(true)}
        onResizeStart={()=>setPanningEnable(false)}
        onResizeStop={()=>setPanningEnable(true)}
      >
        <div className='drag-handle cursor-move bg-white rounded-lg p-3 flex gap-2'> 
            <GripVerticalIcon className='text-gray-50 h-4 w-4'/> Drag Here
        </div>
        <iframe className='w-full h-[calc(100%-40px)] bg-white rounded-2xl mt-5' 
            sandbox='allow-same-origin allow-scripts'
            srcDoc={html}
        />
      </Rnd>
    </div>
  )
}

export default ScreenFrame
