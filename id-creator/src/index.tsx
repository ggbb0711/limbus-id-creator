import React, { ReactElement, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.css'
import './styles/style.css'
import { IdInfoProvider } from './component/context/IdInfoContext';
import { PreviewProvider } from 'component/context/PreviewContext';
import { StatusEffectProvider } from 'component/context/StatusEffectContext';
import {MapInteractionCSS} from "react-map-interaction"
import InputTabContainer from 'component/InputTab/InputTabContainer/InputTabContainer';
import ShowInputTab from 'utils/ShowInputTab/ShowInputTab';
import * as htmlToImage from 'html-to-image';
import DownloadBtn from 'utils/DownloadBtn/DownloadBtn';
import { EgoInfoProvider } from 'component/context/EgoInfoContext';
import ChangeModeBtn from 'utils/ChangeModeBtn/ChangeModeBtn';
import { IdCard } from 'component/Card/IdCard';
import { EgoCard } from 'component/Card/EgoCard';


const root = createRoot(document.getElementById('root')!);

function App():ReactElement{
    const [isShown,setIsShown]=useState(false)
    const [mode,setMode]=useState("IdInfo")
    const domRef=useRef(null)

    const download=async()=>{
        try{
            const dataUrl = await htmlToImage.toPng(domRef.current);

            // download image
            const link = document.createElement('a');
            link.download = (mode==="IdInfo")?'customId.png':'customEgo.png';
            link.href = dataUrl;
            link.click();
        }
        catch(err){
            console.log(err)
        }
    }

    return <div>
    <PreviewProvider>
            <IdInfoProvider>
                <EgoInfoProvider>
                    <StatusEffectProvider>
                        <>
                            <div className={`main-container ${isShown?"show":""}`}>
                                <div className='preview-container'>
                                    <MapInteractionCSS>
                                        {(()=>{
                                            if(mode==="IdInfo") return <IdCard ref={domRef}/>

                                            if(mode==="EgoInfo") return <EgoCard ref={domRef}/>
                                        })()}
                                        
                                    </MapInteractionCSS>
                                </div>
                                <InputTabContainer mode={mode}/>
                                <ShowInputTab isShown={isShown} clickHandler={()=>setIsShown(!isShown)} />
                                <DownloadBtn clickHandler={download}/>
                                <ChangeModeBtn mode={mode} setMode={()=>setMode(mode==="IdInfo"?"EgoInfo":"IdInfo")}/>
                            </div>
                        </>
                    </StatusEffectProvider>
                </EgoInfoProvider>
            </IdInfoProvider>
    </PreviewProvider>
    
</div>
}

root.render(
    <App/>
);
