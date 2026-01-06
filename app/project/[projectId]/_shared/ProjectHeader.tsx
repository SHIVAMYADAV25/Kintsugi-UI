import { Button } from '@/components/ui/button'
import { SaveIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const ProjectHeader = () => {
  return (
     <div className='flex justify-between items-center p-3 shadow'>
        <div className='flex gap-2 items-center'>
            <Image src={"/ux_logo.webp"} alt="logo" width={40} height={40} />
            <h2 className='text-xl font-semibold'>Kintsugi <span className='text-primary'>UI</span></h2>
        </div>
        <Button> <SaveIcon/> Save</Button>
    </div>
  )
}

export default ProjectHeader
