import React, { useEffect } from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { IdInfo, IIdInfo } from "../../Interfaces/IIdInfo";
import { PassiveSkill } from 'Interfaces/PassiveSkill/IPassiveSkill';

const idInfoContext = createContext(null)

const IdInfoProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [idInfo,changeIdInfoValue] = useState<IIdInfo>(new IdInfo())

    function reset(){
        changeIdInfoValue(new IdInfo())
    }

    function setIdInfoValue(newIdInfo:IIdInfo|((prevIdInfo:IIdInfo)=>IIdInfo)){
        //Have to this to because ownCost and resCost can be undefined and cause error
        let setToChangedIdInfo:IIdInfo

        if(typeof newIdInfo === "function"){
            setToChangedIdInfo = newIdInfo(idInfo)
        }
        else setToChangedIdInfo = newIdInfo

        for (let i = 0; i < setToChangedIdInfo.skillDetails.length; i++) {
            if(setToChangedIdInfo.skillDetails[i].type==="PassiveSkill")
                setToChangedIdInfo.skillDetails[i] = {...new PassiveSkill(),...setToChangedIdInfo.skillDetails[i]}
        }
        changeIdInfoValue(newIdInfo)
    }


    return <idInfoContext.Provider value={{idInfoValue:idInfo,setIdInfoValue,reset}}>
            {children}
        </idInfoContext.Provider>;
}

const useIdInfoContext = () => useContext(idInfoContext)

export {IdInfoProvider,useIdInfoContext}
