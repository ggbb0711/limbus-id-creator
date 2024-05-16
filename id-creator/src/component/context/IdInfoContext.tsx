import React, { useEffect } from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { IIdInfo } from "../../Interfaces/IIdInfo";

const idInfo = createContext(null)

const IdInfoProvider: React.FC<{children:ReactElement,idInfoProp:IIdInfo,setIdInfoValue: React.Dispatch<React.SetStateAction<IIdInfo>>}>=({children,idInfoProp,setIdInfoValue})=>{

    return <idInfo.Provider value={{idInfoValue:idInfoProp,setIdInfoValue}}>
            {children}
        </idInfo.Provider>;
}

const useIdInfoContext = () => useContext(idInfo)

export {IdInfoProvider,useIdInfoContext}
