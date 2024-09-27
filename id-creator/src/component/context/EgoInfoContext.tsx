import React from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { EgoInfo, IEgoInfo } from 'Interfaces/IEgoInfo';
import { PassiveSkill } from 'Interfaces/PassiveSkill/IPassiveSkill';

const egoInfo = createContext(null)

const EgoInfoProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [EgoInfoValue,changeEgoInfoValue]=useState<IEgoInfo>(new EgoInfo())


    function reset(){
        changeEgoInfoValue(new EgoInfo())
    }

    function setEgoInfoValue(newEgoInfo:IEgoInfo|((prevEgoInfo:IEgoInfo)=>IEgoInfo)){
        //Have to this to because ownCost and resCost can be undefined and cause error
        let setToChangedEgoInfo:IEgoInfo

        if(typeof newEgoInfo === "function"){
            setToChangedEgoInfo = newEgoInfo(EgoInfoValue)
        }
        else setToChangedEgoInfo = newEgoInfo

        for (let i = 0; i < setToChangedEgoInfo.skillDetails.length; i++) {
            if(setToChangedEgoInfo.skillDetails[i].type==="PassiveSkill")
                setToChangedEgoInfo.skillDetails[i] = {...new PassiveSkill(),...setToChangedEgoInfo.skillDetails[i]}
        }
        changeEgoInfoValue(newEgoInfo)
    }

    return <egoInfo.Provider value={{EgoInfoValue,setEgoInfoValue,reset}}>
            {children}
        </egoInfo.Provider>;
}

const useEgoInfoContext = () => useContext(egoInfo)

export {EgoInfoProvider,useEgoInfoContext}
