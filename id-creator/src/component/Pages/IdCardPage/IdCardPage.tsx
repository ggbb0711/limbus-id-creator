import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import 'styles/reset.css'
import 'styles/style.css'
import '../EditorPage.css'
import { StatusEffectProvider } from 'component/context/StatusEffectContext';
import {MapInteractionCSS} from "react-map-interaction"
import { IdCard } from 'component/Card/IdCard';
import { IdInfoProvider, useIdInfoContext } from 'component/context/IdInfoContext';
import InputTabIdInfoContainer from 'component/InputTab/InputTabContainer/InputTabIdInfoContainer/InputTabIdInfoContainer';
import {  useRefDownloadContext } from 'component/context/ImgUrlContext';
import {  useSearchParams } from 'react-router-dom';
import { useSaveMenuContext } from 'component/SaveMenu/SaveMenu';
import ResetMenu from 'utils/ResetMenu/ResetMenu';
import { IdInfo } from 'Interfaces/IIdInfo';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"; 




export default function IdCardPage():ReactElement{
    
    return <IdInfoProvider>
        <IdCardContext/>
    </IdInfoProvider>
}


function IdCardContext():ReactElement{
    const [isShown,setIsShown]=useState(false)
    const [isResetMenuActive,setResetMenuActive] = useState(false)
    const [height,setHeight] = useState(0)
    const {idInfoValue,setIdInfoValue,reset} = useIdInfoContext()
    const {setLocalSaveName,changeSaveInfo,setLoadObjInfoValueCb} = useSaveMenuContext() 
    const domRef=useRef(null)
    const [query] = useSearchParams()
    const {setDomRef} = useRefDownloadContext()
    const [activeTab,setActiveTab]=useState(-1)

    function changeActiveTab(i:number){
        if(activeTab===i) setActiveTab(-2)
        else setActiveTab(i)
    }

    useEffect(()=>{
        //Get the last save id
        const lastSave = JSON.parse(localStorage.getItem("currIdSave"))
        if(lastSave){
            setIdInfoValue(lastSave)
        }
        //Get local save id based on the url
        const id = parseInt(query.get('id'))
        if(query.get('saveMode')==="local"){
            const save = JSON.parse(localStorage.getItem("IdLocalSaves"))
            if(save && save[id] && id!==undefined){
                setIdInfoValue(save[id].saveInfo)
            }
        }
        //Setting the save menu
        setLocalSaveName("IdLocalSaves")
        changeSaveInfo(idInfoValue)
        setLoadObjInfoValueCb(()=>{return setIdInfoValue})
        //Setting the domref for downloading
        setDomRef(domRef)
    },[])

    useEffect(()=>{
        setHeight(Math.floor(window.innerHeight)-Math.floor(document.querySelector(".site-header").clientHeight)-2)
    },[window.innerHeight])

    useEffect(()=>{
        changeSaveInfo(new IdInfo(idInfoValue))
        //Save the last change
        localStorage.setItem("currIdSave",JSON.stringify(new IdInfo(idInfoValue)))
    },[JSON.stringify(idInfoValue)])

    return <StatusEffectProvider skillDetails={idInfoValue.skillDetails}>
        <div className={`editor-container ${isShown?"show":""}`} style={{height:height}}>
            <InputTabIdInfoContainer 
                resetBtnHandler={()=>setResetMenuActive(!isResetMenuActive)}
                activeTab={activeTab}
                changeActiveTab={changeActiveTab} />
            <ResetMenu isActive={isResetMenuActive} setIsActive={setResetMenuActive} confirmFn={reset} />
            <div className='preview-container'>
                <IdCard ref={domRef} changeActiveTab={setActiveTab}/>
            </div>
        </div>
    </StatusEffectProvider>
}