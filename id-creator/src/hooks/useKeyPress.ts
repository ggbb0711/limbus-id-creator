import { RefObject, useEffect, useRef, useState } from "react";


export default function useKeyPress(key:string,ref:RefObject<HTMLElement|null>,keyDownCb?:(e:KeyboardEvent)=>void,keyUpCb?:(e:KeyboardEvent)=>void){
    const [keyPress,setKeyPress] = useState(false)

    // Keep the latest callbacks without re-subscribing the listeners on every render
    const callbacksRef = useRef({keyDownCb,keyUpCb})
    useEffect(()=>{
        callbacksRef.current = {keyDownCb,keyUpCb}
    })

    useEffect(()=>{
        // Capture the element: ref.current may already be null when the cleanup runs
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
