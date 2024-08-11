import React, { ReactElement, useEffect, useRef, useState } from 'react';
import 'styles/reset.css'
import 'styles/style.css'
import '../EditorPage.css'
import { StatusEffectProvider } from 'component/context/StatusEffectContext';
import {MapInteractionCSS} from "react-map-interaction"
import ShowInputTab from 'utils/ShowInputTab/ShowInputTab';
import { useRefDownloadContext } from 'component/context/ImgUrlContext';
import { EgoInfoProvider, useEgoInfoContext } from 'component/context/EgoInfoContext';
import { EgoCard } from 'component/Card/EgoCard';
import InputTabEgoInfoContainer from 'component/InputTab/InputTabContainer/InputTabEgoInfoContainer/InputTabEgoInfoContainer';
import { useSearchParams } from 'react-router-dom';
import { useSaveMenuContext } from 'component/SaveMenu/SaveMenu';
import ResetBtn from 'utils/ResetBtn/ResetBtn';
import ResetMenu from 'utils/ResetMenu/ResetMenu';



export default function EgoCardPage():ReactElement{

    return <EgoInfoProvider>
            <EgoCardContent/>
        </EgoInfoProvider>
    
}

function EgoCardContent():ReactElement{
    const [isShown,setIsShown]=useState(false)
    const [isResetMenuActive,setResetMenuActive] = useState(false)
    const [height,setHeight] = useState(0)
    const {EgoInfoValue,setEgoInfoValue,reset} = useEgoInfoContext()
    const {setLocalSaveName,changeSaveInfo,setLoadObjInfoValueCb} = useSaveMenuContext() 
    const domRef=useRef(null)
    const [query] = useSearchParams()
    const {setDomRef} = useRefDownloadContext()

    useEffect(()=>{
        //Get the last save id
        const lastSave = JSON.parse(localStorage.getItem("currEgoSave"))
        if(lastSave){
            setEgoInfoValue
            (lastSave)
        }
        //Get local save id based on the url
        const id = parseInt(query.get('id'))
        if(query.get('saveMode')==="local"){
            const save = JSON.parse(localStorage.getItem("EgoLocalSaves"))
            if(save && save[id] && id!==undefined){
                setEgoInfoValue(save[id].saveInfo)
            }
        }
        //Setting the save menu
        setLocalSaveName("EgoLocalSaves")
        changeSaveInfo(EgoInfoValue)
        setLoadObjInfoValueCb(()=>{return setEgoInfoValue})
        //Setting the domref for downloading
        setDomRef(domRef)
    },[])

    useEffect(()=>{
        setHeight(Math.floor(window.innerHeight)-Math.floor(document.querySelector(".site-header").clientHeight)-2)
    },[window.innerHeight])

    useEffect(()=>{
        changeSaveInfo(EgoInfoValue)
        //Save the last change
        localStorage.setItem("currEgoSave",JSON.stringify(EgoInfoValue))
    },[JSON.stringify(EgoInfoValue)])

    return <StatusEffectProvider skillDetails={EgoInfoValue.skillDetails}>
            <div className={`editor-container ${isShown?"show":""}`} style={{height:height}}>
                <InputTabEgoInfoContainer/>
                <ShowInputTab isShown={isShown} clickHandler={()=>setIsShown(!isShown)} />
                <ResetBtn clickHandler={()=>setResetMenuActive(!isResetMenuActive)}/>
                <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={reset} />
                <div className='preview-container'>
                    <MapInteractionCSS>
                        <EgoCard ref={domRef}/>
                    </MapInteractionCSS>
                </div>
            </div>
    </StatusEffectProvider>
}