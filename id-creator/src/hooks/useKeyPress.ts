import { RefObject, useEffect, useRef, useState } from "react";


export default function useKeyPress(key:string,ref:RefObject<HTMLElement|null>,keyDownCb?:(e:KeyboardEvent)=>void,keyUpCb?:(e:KeyboardEvent)=>void){
    const [keyPress,setKeyPress] = useState(false)

    const callbacksRef = useRef({keyDownCb,keyUpCb})
    useEffect(()=>{
        callbacksRef.current = {keyDownCb,keyUpCb}
    })

    useEffect(()=>{
        const el = ref.current
        if(!el) return

        const onKeyDown = (e:KeyboardEvent)=>{
            if(e.key===key){
                callbacksRef.current.keyDownCb?.(e)
                setKeyPress(true)
            }
        }
        const onKeyUp = (e:KeyboardEvent)=>{
            if(e.key===key){
                callbacksRef.current.keyUpCb?.(e)
                setKeyPress(false)
            }
        }

        el.addEventListener("keydown",onKeyDown)
        el.addEventListener("keyup",onKeyUp)
        return ()=>{
            el.removeEventListener("keydown",onKeyDown)
            el.removeEventListener("keyup",onKeyUp)
        }
    },[ref,key])

    return keyPress
}
