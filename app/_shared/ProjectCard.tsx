import { ProjectType } from '@/type/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    project : ProjectType
}

const ProjectCard = ({project}:Props) => {
  return (
    <Link href={"/project/"+project.projectId}>
    <div className='rounded-2xl p-4 cursor-pointer'>
      <Image
    src={project.screenShot}
    alt={project.projectName || "Project"}
    width={300}
    height={200}
    className="rounded-xl object-contain h-[200px] w-full bg-black"
  />
      <div className='p-2'>
        <h2>{project.projectName}</h2>
        <p className='text-sm text-gray-500'>{project.createdOn}</p>
      </div>
    </div>
    </Link>
  )
}

export default ProjectCard
