import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'styles/reset.css'
import 'styles/style.css'
import '../EditorPage.css'
import { StatusEffectProvider } from 'component/context/StatusEffectContext';
import {MapInteractionCSS} from "react-map-interaction"
import ShowInputTab from 'utils/ShowInputTab/ShowInputTab';
import { IdCard } from 'component/Card/IdCard';
import { IdInfoProvider, useIdInfoContext } from 'component/context/IdInfoContext';
import InputTabIdInfoContainer from 'component/InputTab/InputTabContainer/InputTabIdInfoContainer/InputTabIdInfoContainer';
import { RefDownloadProvider } from 'component/context/ImgUrlContext';
import { SaveLocalMenu } from 'component/SaveMenu/SaveLocalMenu/SaveLocalMenu';
import { DefenseSkill } from 'Interfaces/DefenseSkill/IDefenseSkill';
import { OffenseSkill } from 'Interfaces/OffenseSkill/IOffenseSkill';
import { PassiveSkill } from 'Interfaces/PassiveSkill/IPassiveSkill';
import { useParams, useSearchParams } from 'react-router-dom';
import { IIdInfo } from 'Interfaces/IIdInfo';



export default function IdCardPage():ReactElement{
    const [idInfo,setIdInfo] = useState<IIdInfo>({
        title:"",
        name:"",
        splashArt:"",
        splashArtScale:1,
        splashArtTranslation:{
            x:0,
            y:0,
        },
        HP:0,
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
    const [query,setQuery] = useSearchParams()

    useEffect(()=>{
        const id = parseInt(query.get('id'))
        if(query.get('saveMode')==="local"){
            const save = JSON.parse(localStorage.getItem("IdLocalSaves"))
            if(save && save[id] && id!==undefined){
                setIdInfo(save[id].saveInfo)
            }
        }
    },[])

    return <div>
        <IdInfoProvider idInfoProp={idInfo} setIdInfoValue={setIdInfo}>
            <IdCardContent/>
        </IdInfoProvider>
    </div>
}

function IdCardContent():ReactElement{
    const [isShown,setIsShown]=useState(false)
    const [height,setIsHeight] = useState(0)
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()
    const domRef=useRef(null)

    useEffect(()=>{
        setIsHeight(window.innerHeight-document.querySelector(".site-header").clientHeight-1)
    },[])

    return <StatusEffectProvider skillDetails={idInfoValue.skillDetails}>
        <RefDownloadProvider domRef={domRef}>
            <SaveLocalMenu saveObjInfoValue={idInfoValue} setObjInfoValue={setIdInfoValue} localSaveName={'IdLocalSaves'}>
                <div className={`editor-container ${isShown?"show":""}`} style={{height:height}}>
                    <InputTabIdInfoContainer/>
                    <ShowInputTab isShown={isShown} clickHandler={()=>setIsShown(!isShown)} />
                    <div className='preview-container'>
                        <MapInteractionCSS>
                            <IdCard ref={domRef} />
                        </MapInteractionCSS>
                    </div>
                </div>
            </SaveLocalMenu>
        </RefDownloadProvider>
        
</StatusEffectProvider>
}