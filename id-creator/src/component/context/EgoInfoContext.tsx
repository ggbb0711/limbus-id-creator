import React, { useEffect } from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { IEgoInfo } from 'Interfaces/IEgoInfo';
import { OffenseSkill } from 'Interfaces/OffenseSkill/IOffenseSkill';
import { PassiveSkill } from 'Interfaces/PassiveSkill/IPassiveSkill';
import { ISaveFile, SaveFile } from 'Interfaces/ISaveFile';

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
                wrath_resistant:1,
                lust_resistant:1,
                sloth_resistant:1,
                gluttony_resistant:1,
                gloom_resistant:1,
                pride_resistant:1,
                envy_resistant:1,
            },
            sinCost:{
                wrath_cost:0,
                lust_cost:0,
                sloth_cost:0,
                gluttony_cost:0,
                gloom_cost:0,
                pride_cost:0,
                envy_cost:0,  
            },
            sinnerColor:"var(--Yi-Sang-color)",
            sinnerIcon:"Images/sinner-icon/Yi_Sang_Icon.png",
            egoLevel:"ZAYIN",
            skillDetails:[new OffenseSkill("Awakening","Wrath",1,"AWAKENING"),new OffenseSkill("Corrision","Wrath",1,"CORRISION"),new PassiveSkill("Passive","PASSIVE")]
        }
    )


    function reset(){
        setEgoInfoValue(
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
                    wrath_resistant:1,
                    lust_resistant:1,
                    sloth_resistant:1,
                    gluttony_resistant:1,
                    gloom_resistant:1,
                    pride_resistant:1,
                    envy_resistant:1,
                },
                sinCost:{
                    wrath_cost:0,
                    lust_cost:0,
                    sloth_cost:0,
                    gluttony_cost:0,
                    gloom_cost:0,
                    pride_cost:0,
                    envy_cost:0,  
                },
                sinnerColor:"var(--Yi-Sang-color)",
                sinnerIcon:"Images/sinner-icon/Yi_Sang_Icon.png",
                egoLevel:"ZAYIN",
                skillDetails:[new OffenseSkill("Awakening","Wrath",1,"AWAKENING"),new OffenseSkill("Corrision","Wrath",1,"CORRISION"),new PassiveSkill("Passive","PASSIVE")]
            }
        )
    }


    return <egoInfo.Provider value={{EgoInfoValue,setEgoInfoValue,reset}}>
            {children}
        </egoInfo.Provider>;
}

const useEgoInfoContext = () => useContext(egoInfo)

export {EgoInfoProvider,useEgoInfoContext}
