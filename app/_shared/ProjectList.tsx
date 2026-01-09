"use client"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ProjectType } from '@/type/types'
import ProjectCard from './ProjectCard'
import { Skeleton } from '@/components/ui/skeleton'

const ProjectList = () => {
  const [projectList, setProjectList] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    GetProjectList()
  }, [])

  const GetProjectList = async () => {
    setLoading(true)
    const result = await axios.get("/api/project")
    setProjectList(result.data)
    setLoading(false)
  }

  return (
    <div className="px-10 md:px-24 xl:px-56">
      <h2 className="font-bold text-xl mb-4">My Project List</h2>

    {!loading && projectList.length == 0 && <div className='p-6 border border-dashed rounded-none'> <h2 className='text-center'> No Project Available </h2> </div>}

      {/* SINGLE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="w-full h-[200px] rounded-2xl" />
                <Skeleton className="mt-3 w-3/4 h-6" />
              </div>
            ))
          : projectList.map((project, index) => (
              <ProjectCard project={project} key={index} />
            ))}
      </div>
    </div>
  )
}

export default ProjectList
