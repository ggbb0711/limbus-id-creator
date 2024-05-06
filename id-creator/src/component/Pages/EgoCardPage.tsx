import React, { ReactElement, useRef, useState } from 'react';
import 'styles/reset.css'
import 'styles/style.css'
import { StatusEffectProvider } from 'component/context/StatusEffectContext';
import {MapInteractionCSS} from "react-map-interaction"
import ShowInputTab from 'utils/ShowInputTab/ShowInputTab';
import { RefDownloadProvider } from 'component/context/ImgUrlContext';
import { SaveLocalMenu } from 'component/SaveMenu/SaveLocalMenu/SaveLocalMenu';
import { EgoInfoProvider, useEgoInfoContext } from 'component/context/EgoInfoContext';
import { EgoCard } from 'component/Card/EgoCard';
import InputTabEgoInfoContainer from 'component/InputTab/InputTabContainer/InputTabEgoInfoContainer/InputTabEgoInfoContainer';



export default function EgoCardPage():ReactElement{
    

    return <div>
        <EgoInfoProvider>
            <EgoCardContent/>
        </EgoInfoProvider>
    </div>
}

function EgoCardContent():ReactElement{
    const [isShown,setIsShown]=useState(false)
    const {EgoInfoValue,setEgoInfoValue} = useEgoInfoContext()
    const domRef=useRef(null)


    return <StatusEffectProvider skillDetails={EgoInfoValue.skillDetails}>
        <RefDownloadProvider domRef={domRef}>
            <SaveLocalMenu saveObjInfoValue={EgoInfoValue} setObjInfoValue={setEgoInfoValue} localSaveName={'EgoLocalSaves'}>
                <div className={`main-container ${isShown?"show":""}`}>
                    <div className='preview-container'>
                        <MapInteractionCSS>
                            <EgoCard/>
                        </MapInteractionCSS>
                    </div>
                    <InputTabEgoInfoContainer/>
                    <ShowInputTab isShown={isShown} clickHandler={()=>setIsShown(!isShown)} />
                </div>
            </SaveLocalMenu>
        </RefDownloadProvider>
        
</StatusEffectProvider>
}