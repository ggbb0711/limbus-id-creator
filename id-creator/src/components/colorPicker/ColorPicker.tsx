import React, { ReactElement, useEffect, useRef } from "react";
import "@melloware/coloris/dist/coloris.css"
import "./ColorPicker.css"

let colorisSetup:Promise<void>|null = null

function setupColoris(){
    colorisSetup ??= import("@melloware/coloris").then(({default:Coloris})=>{
        Coloris.init()
        Coloris({
            el: ".coloris-input",
            wrap: false,
            themeMode: "dark",
            format: "auto",
            formatToggle: true,
            alpha: true,
            closeButton: true,
        })
    })
    return colorisSetup
}

function normalizeColor(text:string):string|null{
    const color = text.trim()
    if(!color) return null
    if(CSS.supports("color",color)) return color
    if(CSS.supports("color","#"+color)) return "#"+color
    return null
}

export default function ColorPicker({value,onChange,id,className,title}:{value:string,onChange:(color:string)=>void,id?:string,className?:string,title?:string}):ReactElement{
    const inputRef = useRef<HTMLInputElement>(null)
    const onChangeRef = useRef(onChange)

    useEffect(()=>{
        onChangeRef.current = onChange
    },[onChange])

    useEffect(()=>{
        setupColoris()
    },[])

    useEffect(()=>{
        const input = inputRef.current
        if(!input) return
        const handleInput = ()=>{
            const color = normalizeColor(input.value)
            if(color) onChangeRef.current(color)
        }
        input.addEventListener("input",handleInput)
        return ()=>input.removeEventListener("input",handleInput)
    },[])

    useEffect(()=>{
        const input = inputRef.current
        if(input && document.activeElement!==input && input.value!==(value ?? "")) input.value = value ?? ""
    },[value])

    return <div className={`clr-field color-picker ${className ?? ""}`} style={{color:value}} title={title}>
        <button type="button" aria-label={title ?? "Pick a color"}/>
        <input ref={inputRef} id={id} className="coloris-input color-picker-input" type="text"
            defaultValue={value} placeholder="color" spellCheck={false} autoComplete="off"/>
    </div>
}
