"use client"

import { useEffect, useState } from 'react'
import axios from "axios"
import {userDetailContext} from "../context/UserDetailContext"
import { SettingContext } from '@/context/SettingContext'

const provider =  ({children} : any) => {

  const [useDetaile,setUserDetail] = useState("");
  const [settingDetail,setSettingDetail] = useState("");

    useEffect(()=>{
        CreateNewUser();
    },[])

    const CreateNewUser = async () => {
        const result = await axios.post("/api/user",{});

        // console.log(result)
        setUserDetail(result.data);
    }

  return (
    <div>
       {/* at any component we can set user */}
      <userDetailContext.Provider value={{useDetaile,setUserDetail}}>
        <SettingContext.Provider value={{settingDetail, setSettingDetail}}>
           <div>{children}</div>
        </SettingContext.Provider>
      </userDetailContext.Provider>
    </div>
  )
}

export default provider
