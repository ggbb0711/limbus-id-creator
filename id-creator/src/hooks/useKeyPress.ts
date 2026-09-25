import { RefObject, useEffect, useState } from "react";


export default function useKeyPress(key:string,ref:RefObject<any>,keyDownCb?:(e:KeyboardEvent)=>void,keyUpCb?:(e:KeyboardEvent)=>void){
    const [keyPress,setKeyPress] = useState(false)
    const onKeyDown = (e:KeyboardEvent)=>{
        if(e.key===key){
            if(keyDownCb) keyDownCb(e)
            setKeyPress(true)
        }
    }

    const onKeyUp = (e:KeyboardEvent)=>{
        if(e.key===key){
            if(keyUpCb) keyUpCb(e)
            setKeyPress(false)
        }
    }

    useEffect(()=>{
        if(ref.current){
            ref.current.addEventListener("keydown",onKeyDown)
            ref.current.addEventListener("keyup",onKeyUp)
        }
        // return ()=>{
        //     ref.current.removeEventListener("keydown",onKeyDown)
        //     ref.current.removeEventListener("keyup",onKeyUp)
        // }
    },[ref])

    return keyPress
}