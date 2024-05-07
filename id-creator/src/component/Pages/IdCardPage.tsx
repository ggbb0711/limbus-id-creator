import React, { ReactElement, useRef, useState } from 'react';
import 'styles/reset.css'
import 'styles/style.css'
import { StatusEffectProvider } from 'component/context/StatusEffectContext';
import {MapInteractionCSS} from "react-map-interaction"
import ShowInputTab from 'utils/ShowInputTab/ShowInputTab';
import { IdCard } from 'component/Card/IdCard';
import { IdInfoProvider, useIdInfoContext } from 'component/context/IdInfoContext';
import InputTabIdInfoContainer from 'component/InputTab/InputTabContainer/InputTabIdInfoContainer/InputTabIdInfoContainer';
import { RefDownloadProvider } from 'component/context/ImgUrlContext';
import { SaveLocalMenu } from 'component/SaveMenu/SaveLocalMenu/SaveLocalMenu';



export default function IdCardPage():ReactElement{
    

    return <div>
        <IdInfoProvider>
            <IdCardContent/>
        </IdInfoProvider>
    </div>
}

function IdCardContent():ReactElement{
    const [isShown,setIsShown]=useState(false)
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()
    const domRef=useRef(null)


    return <StatusEffectProvider skillDetails={idInfoValue.skillDetails}>
        <RefDownloadProvider domRef={domRef}>
            <SaveLocalMenu saveObjInfoValue={idInfoValue} setObjInfoValue={setIdInfoValue} localSaveName={'IdLocalSaves'}>
                <div className={`main-container ${isShown?"show":""}`}>
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