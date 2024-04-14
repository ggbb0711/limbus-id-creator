import React, { useEffect } from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { OffenseSkill } from 'Interfaces/OffenseSkill/IOffenseSkill';
import { PassiveSkill } from 'Interfaces/PassiveSkill/IPassiveSkill';
import { IEgoInfo } from 'Interfaces/IEgoInfo';

const egoInfo = createContext(null)

const EgoInfoProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [EgoInfoValue,setEgoInfoValue]=useState<IEgoInfo>(
        {
            title:"",
            name:"",
            sanityCost:0,
            splashArt:"",
            splashArtScale:1,
            splashArtTranslation:{
                x:0,
                y:0,
            },
            sinResistant:{
                Wrath_resistant:1,
                Lust_resistant:1,
                Sloth_resistant:1,
                Gluttony_resistant:1,
                Gloom_resistant:1,
                Pride_resistant:1,
                Envy_resistant:1,
            },
            sinCost:{
                Wrath_cost:0,
                Lust_cost:0,
                Sloth_cost:0,
                Gluttony_cost:0,
                Gloom_cost:0,
                Pride_cost:0,
                Envy_cost:0,  
            },
            sinnerColor:"var(--Yi-Sang-color)",
            sinnerIcon:"Images/sinner-icon/Yi_Sang_Icon.png",
            egoLevel:"ZAYIN",
            skillDetails:[new OffenseSkill("Awakening","Wrath",1,"AWAKENING"),new OffenseSkill("Corrision","Wrath",1,"CORRISION"),new PassiveSkill("Passive","PASSIVE")]
        }
    )

    // useEffect(()=>{
    //     if(localStorage.getItem("idInfo")) setEgoInfoValue(JSON.parse(localStorage.getItem("idInfo")))
    // },[])

    // useEffect(()=>{
    //     localStorage.setItem("idInfo",JSON.stringify(EgoInfoValue))
    // },[EgoInfoValue])

    return <egoInfo.Provider value={{EgoInfoValue,setEgoInfoValue}}>
            {children}
        </egoInfo.Provider>;
}

const useEgoInfoContext = () => useContext(egoInfo)

export {EgoInfoProvider,useEgoInfoContext}
