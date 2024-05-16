import React from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { IEgoInfo } from 'Interfaces/IEgoInfo';

const egoInfo = createContext(null)

const EgoInfoProvider: React.FC<{children:ReactElement,EgoInfoValue:IEgoInfo,setEgoInfoValue:React.Dispatch<React.SetStateAction<IEgoInfo>>}>=({children,EgoInfoValue,setEgoInfoValue})=>{


    return <egoInfo.Provider value={{EgoInfoValue,setEgoInfoValue}}>
            {children}
        </egoInfo.Provider>;
}

const useEgoInfoContext = () => useContext(egoInfo)

export {EgoInfoProvider,useEgoInfoContext}
