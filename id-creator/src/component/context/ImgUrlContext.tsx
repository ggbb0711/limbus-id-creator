import React, { createContext, ReactElement, useCallback, useContext, useState } from "react";
import * as htmlToImage from 'html-to-image';


const refDownload = createContext(null)

const RefDownloadProvider: React.FC<{children:ReactElement,domRef:React.MutableRefObject<any>}>=({children,domRef})=>{
    const [imgUrl,setImgUrl] = useState("")

    const setImgUrlState=useCallback(async():Promise<string>=>{
        try{
            const dataUrl = await htmlToImage.toPng(domRef.current)
            setImgUrl(dataUrl)
            return dataUrl
        }
        catch(err){
            console.log(err)
            return ""
        }
    },[domRef])

    return <refDownload.Provider value={{imgUrl,setImgUrlState}}>
        {children}
    </refDownload.Provider>
}

const useRefDownloadContext = ()=>useContext(refDownload)

export {RefDownloadProvider,useRefDownloadContext}