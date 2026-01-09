"use client"

import { useEffect, useState } from 'react'
import axios from "axios"
import {userDetailContext} from "../context/UserDetailContext"
import { SettingContext } from '@/context/SettingContext'
import { RefreshDataContext } from '@/context/RefreshDataContext'

const provider =  ({children} : any) => {

  const [useDetaile,setUserDetail] = useState();
  const [settingDetail,setSettingDetail] = useState();
  const [refresData,setRefreshData] = useState();

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
          <RefreshDataContext.Provider value={{refresData,setRefreshData}}>
           <div>{children}</div>
          </RefreshDataContext.Provider>
        </SettingContext.Provider>
      </userDetailContext.Provider>
    </div>
  )
}

export default provider
