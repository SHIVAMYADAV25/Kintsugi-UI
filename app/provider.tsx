"use client"

import { useEffect, useState } from 'react'
import axios from "axios"
import {userDetailContext} from "../context/UserDetailContext"

const provider =  ({children} : any) => {

  const [useDetaile,setUserDetail] = useState("");

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
      // at any component we can set user
      <userDetailContext.Provider value={{useDetaile,setUserDetail}}>
            {children}
      </userDetailContext.Provider>
    </div>
  )
}

export default provider
