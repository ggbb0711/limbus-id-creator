import React, { ReactElement, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.css'
import './styles/style.css'
import { IdInfoProvider } from './component/context/IdInfoContext';
import {IdCard} from 'component/IdCard/IdCard';
import { PreviewProvider } from 'component/context/PreviewContext';
import { StatusEffectProvider } from 'component/context/StatusEffectContext';
import {MapInteractionCSS} from "react-map-interaction"
import InputTabContainer from 'component/InputTab/InputTabContainer/InputTabContainer';
import ShowInputTab from 'utils/ShowInputTab/ShowInputTab';
import * as htmlToImage from 'html-to-image';
import DownloadBtn from 'utils/DownloadBtn/DownloadBtn';


const root = createRoot(document.getElementById('root')!);

function App():ReactElement{
    const [isShown,setIsShown]=useState(false)
    const domRef=useRef(null)

    const download=async()=>{
        try{
            console.log("downloading")
            const dataUrl = await htmlToImage.toPng(domRef.current);

            // download image
            const link = document.createElement('a');
            link.download = 'customId.png';
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
                <StatusEffectProvider>
                    <>
                        <div className={`main-container ${isShown?"show":""}`}>
                            <div className='preview-container'>
                                <MapInteractionCSS>
                                    <IdCard ref={domRef}/>
                                </MapInteractionCSS>
                            </div>
                            <InputTabContainer/>
                            <ShowInputTab isShown={isShown} clickHandler={()=>setIsShown(!isShown)} />
                            <DownloadBtn clickHandler={download}/>
                        </div>
                    </>
                </StatusEffectProvider>
            </IdInfoProvider>
    </PreviewProvider>
    
</div>
}

root.render(
    <App/>
);
