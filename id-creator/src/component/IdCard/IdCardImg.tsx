import React, { ReactElement, useEffect, useRef, useState } from "react";
import IdCard from "./IdCard";
import { IdInfoProvider, useIdInfoContext } from "component/context/IdInfoContext";
import { toJpeg, toPng } from "../../../node_modules/html-to-image/lib/index";



export default function IdCardImg():ReactElement{
    const {idInfoValue}=useIdInfoContext()
    const [imgUrl,setImgUrl]=useState("")
    const [isChanging,setIsChanging]=useState(false)
    const ref=useRef<HTMLDivElement>(null)

    // useEffect(()=>{
    //     setIsChanging(true)
    //     if(ref.current){
    //         toJpeg(ref.current)
    //             .then((url)=>{
    //                 setImgUrl(url)
    //             })
    //             .catch(err=>console.log(err))
            
    //     }
    //     setIsChanging(false)

    // },[idInfoValue])

    useEffect(()=>{
        const fetchData=async ()=>{
            if(ref.current){
                try{
                    const url=await toPng(ref.current)
                    setImgUrl(url)
                }
                catch(err){
                    console.log(err)
                }
            }
        }
        fetchData()
        
    },[idInfoValue])
    
    
    return(
        <>
            <div className={`idCard`} ref={ref}>
                <div>
                    <div>
                        <p>Name: {idInfoValue.name}</p>
                        <p>Title: {idInfoValue.title}</p>
                        
                    </div>
                    <div>
                        <img src={idInfoValue.splashArt} alt="splashArt" />
                    </div>
                </div>
            </div>
            <img src={imgUrl} alt="id-card" />
        </>
    )
}