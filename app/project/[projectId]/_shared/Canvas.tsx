import { useState } from 'react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScreenFrame from './ScreenFrame';
import { ProjectType, ScreenConfig } from '@/type/types';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
    projectDetail : ProjectType | undefined,
    screenConfig : ScreenConfig[],
    loading?:boolean

}

const Canvas = ({projectDetail,screenConfig,loading}:Props) => {

    const [panningEnable,setPanningEnable] = useState(true);
    const isMobile = projectDetail?.device === "mobile";

    const SCREEN_WIDTH = isMobile?400:900;
    const SCREEN_HEIGTH = isMobile?800:800;
    const gap=isMobile ? 10 : 10;
  return (
    <div className='w-full h-screen bg-gray-200/20' 
    style={{
        backgroundImage:"radial-gradient(rgba(0,0,0,0.15) 1px , transparent 1px)",
        backgroundSize:"20px 20px"
    }}>
        <TransformWrapper
            initialScale={0.5}
            minScale={0.5}
            maxScale={3}
            initialPositionX={50}
            initialPositionY={50}
            limitToBounds={false}
            wheel={{step:0.8}}
            doubleClick={{disabled:false}}
            panning={{disabled:!panningEnable}}
        >
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
        </TransformWrapper>
    </div>
  )
}

export default Canvas
