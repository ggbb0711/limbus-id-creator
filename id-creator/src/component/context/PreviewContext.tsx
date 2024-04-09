import React from 'react'
import { ReactElement, createContext, useContext, useState } from "react";

const previewContext = createContext(null)

const PreviewProvider: React.FC<{children:ReactElement}>=({children})=>{
    const [preview,setPreview]=useState(true)
    return <previewContext.Provider value={{preview,setPreview}}>
            {children}
        </previewContext.Provider>;
}

const usePreviewContext = () => useContext(previewContext)

export {PreviewProvider,usePreviewContext}
