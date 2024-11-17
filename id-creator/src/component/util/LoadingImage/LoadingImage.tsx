import React from "react";
import { useEffect, useState } from "react";


export default function LoadingImage({src,alt="",className=""}:{src:string,alt:string,className:string}){
    const [imgSrc,setImgSrc] = useState("")

    useEffect(()=>{
        const img = new Image()
        img.src = src
        img.onload = () => {
          setImgSrc(src)
        }
    },[])

    return <>{imgSrc?<img src={imgSrc} alt={alt} className={className}/>:<div className="loader"></div>}</>
}