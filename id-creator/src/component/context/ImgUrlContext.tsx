import React, { createContext, ReactElement, useCallback, useContext, useState } from "react";
import TurnRefToImg from "utils/Functions/TurnRefToImg";


const refDownload = createContext(null)

const RefDownloadProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [imgUrl,setImgUrl] = useState("")
    const [domRef,setDomRef] = useState<React.MutableRefObject<any>>()
    

    const setImgUrlState=useCallback(async():Promise<string>=>{
        if(domRef?.current){
            const dataUrl = await TurnRefToImg(domRef)
            setImgUrl(dataUrl)
            return dataUrl
        }
            
    },[domRef])

    return <refDownload.Provider value={{imgUrl,setImgUrlState,setDomRef}}>
        {children}
    </refDownload.Provider>
}

const useRefDownloadContext = ()=>useContext(refDownload)

export {RefDownloadProvider,useRefDownloadContext}