import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'styles/reset.css'
import 'styles/style.css'
import '../EditorPage.css'
import { StatusEffectProvider } from 'component/context/StatusEffectContext';
import {MapInteractionCSS} from "react-map-interaction"
import ShowInputTab from 'utils/ShowInputTab/ShowInputTab';
import { RefDownloadProvider } from 'component/context/ImgUrlContext';
import { SaveLocalMenu } from 'component/SaveMenu/SaveLocalMenu/SaveLocalMenu';
import { EgoInfoProvider, useEgoInfoContext } from 'component/context/EgoInfoContext';
import { EgoCard } from 'component/Card/EgoCard';
import InputTabEgoInfoContainer from 'component/InputTab/InputTabContainer/InputTabEgoInfoContainer/InputTabEgoInfoContainer';
import { IEgoInfo } from 'Interfaces/IEgoInfo';
import { OffenseSkill } from 'Interfaces/OffenseSkill/IOffenseSkill';
import { PassiveSkill } from 'Interfaces/PassiveSkill/IPassiveSkill';
import { useSearchParams } from 'react-router-dom';



export default function EgoCardPage():ReactElement{
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

    const [query,setQuery] = useSearchParams()

    useEffect(()=>{
        const id = parseInt(query.get('id'))
        if(query.get('saveMode')==="local"){
            const save = JSON.parse(localStorage.getItem("EgoLocalSaves"))
            if(save && save[id] && id!==undefined){
                setEgoInfoValue(save[id].saveInfo)
            }
        }
    },[])

    return <div>
        <EgoInfoProvider EgoInfoValue={EgoInfoValue} setEgoInfoValue={setEgoInfoValue}>
            <EgoCardContent/>
        </EgoInfoProvider>
    </div>
}

function EgoCardContent():ReactElement{
    const [isShown,setIsShown]=useState(false)
    const [height,setIsHeight] = useState(0)
    const {EgoInfoValue,setEgoInfoValue} = useEgoInfoContext()
    const domRef=useRef(null)

    useEffect(()=>{
        setIsHeight(window.innerHeight-document.querySelector(".site-header").clientHeight-1)
    },[])

    return <StatusEffectProvider skillDetails={EgoInfoValue.skillDetails}>
        <RefDownloadProvider domRef={domRef}>
            <SaveLocalMenu saveObjInfoValue={EgoInfoValue} setObjInfoValue={setEgoInfoValue} localSaveName={'EgoLocalSaves'}>
                <div className={`editor-container ${isShown?"show":""}`} style={{height:height}}>
                    <InputTabEgoInfoContainer/>
                    <ShowInputTab isShown={isShown} clickHandler={()=>setIsShown(!isShown)} />
                    <div className='preview-container'>
                        <MapInteractionCSS>
                            <EgoCard ref={domRef}/>
                        </MapInteractionCSS>
                    </div>
                </div>
            </SaveLocalMenu>
        </RefDownloadProvider>
        
</StatusEffectProvider>
}