'use client'
import { useEffect, useRef } from "react";
import { useRefreshMutation } from "api/AuthApi";

export default function AuthBootstrap(){
    const [refresh] = useRefreshMutation()
    const started = useRef(false)

    useEffect(()=>{
        if(started.current) return
        started.current = true
        refresh()
    },[refresh])

    return null
}
