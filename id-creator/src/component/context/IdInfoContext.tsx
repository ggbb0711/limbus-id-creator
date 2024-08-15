import React, { useEffect } from 'react'
import { ReactElement, createContext, useContext, useState } from "react";
import { IIdInfo } from "../../Interfaces/IIdInfo";
import { DefenseSkill } from 'Interfaces/DefenseSkill/IDefenseSkill';
import { OffenseSkill } from 'Interfaces/OffenseSkill/IOffenseSkill';
import { PassiveSkill } from 'Interfaces/PassiveSkill/IPassiveSkill';
import { ISaveFile, SaveFile } from 'Interfaces/ISaveFile';

const idInfoContext = createContext(null)

const IdInfoProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [idInfo,setIdInfoValue] = useState<IIdInfo>({
        title:"",
        name:"",
        splashArt:"",
        splashArtScale:1,
        splashArtTranslation:{
            x:0,
            y:0,
        },
        hp:0,
        minSpeed:0,
        maxSpeed:0,
        staggerResist:"",
        defenseLevel:0,
        slashResistant:1,
        pierceResistant:1,
        bluntResistant:1,
        sinnerColor:"var(--Yi-Sang-color)",
        sinnerIcon:"Images/sinner-icon/Yi_Sang_Icon.png",
        rarity:"Images/rarity/IDNumber1.png",
        skillDetails:[new OffenseSkill("Skill 1","Wrath",3,"SKILL 1"),new OffenseSkill("Skill 2","Gluttony",2,"SKILL 2"),new OffenseSkill("Skill 3","Pride",1,"SKILL 3"),new DefenseSkill("Defense"),new PassiveSkill("Passive"), new PassiveSkill("Support","SUPPORT")],
    })


    function reset(){
        setIdInfoValue({
            title:"",
            name:"",
            splashArt:"",
            splashArtScale:1,
            splashArtTranslation:{
                x:0,
                y:0,
            },
            hp:0,
            minSpeed:0,
            maxSpeed:0,
            staggerResist:"",
            defenseLevel:0,
            slashResistant:1,
            pierceResistant:1,
            bluntResistant:1,
            sinnerColor:"var(--Yi-Sang-color)",
            sinnerIcon:"Images/sinner-icon/Yi_Sang_Icon.png",
            rarity:"Images/rarity/IDNumber1.png",
            skillDetails:[new OffenseSkill("Skill 1","Wrath",3,"SKILL 1"),new OffenseSkill("Skill 2","Gluttony",2,"SKILL 2"),new OffenseSkill("Skill 3","Pride",1,"SKILL 3"),new DefenseSkill("Defense"),new PassiveSkill("Passive"), new PassiveSkill("Support","SUPPORT")],
        })
    }


    return <idInfoContext.Provider value={{idInfoValue:idInfo,setIdInfoValue,reset}}>
            {children}
        </idInfoContext.Provider>;
}

const useIdInfoContext = () => useContext(idInfoContext)

export {IdInfoProvider,useIdInfoContext}
