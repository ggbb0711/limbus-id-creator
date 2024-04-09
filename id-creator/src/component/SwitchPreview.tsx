import React, { ReactElement } from "react";
import { usePreviewContext } from "./context/PreviewContext";

export default function SwitchPreview():ReactElement{
    const {preview,setPreview} = usePreviewContext()

    return(
        <button onClick={()=>setPreview(!preview)}>Switch preview</button>
    )
}