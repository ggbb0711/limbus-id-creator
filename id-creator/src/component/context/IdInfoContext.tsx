import React from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { IIdInfo } from "../../Interfaces/IIdInfo";

const idInfo = createContext(null)

const IdInfoProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [idInfoValue,setIdInfoValue]=useState<IIdInfo>(
        {
            title:"",
            name:"",
            splashArt:"",
            HP:0,
            minSpeed:0,
            maxSpeed:0,
            defenseLevel:0,
            cols:[[]],
        }
    )
    return <idInfo.Provider value={{idInfoValue,setIdInfoValue}}>
            {children}
        </idInfo.Provider>;
}

const useIdInfoContext = () => useContext(idInfo)

export {IdInfoProvider,useIdInfoContext}
