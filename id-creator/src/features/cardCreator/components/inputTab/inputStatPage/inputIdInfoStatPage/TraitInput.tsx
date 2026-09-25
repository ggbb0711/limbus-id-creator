import React, { KeyboardEvent, ReactElement, useRef } from "react";

// Replaces react-tagsinput (React <= 18 only) with the same DOM, so the existing trait styles still apply.
// Enter/Tab adds the typed trait, Backspace on an empty input removes the last one.
export default function TraitInput({value,onChange,inputValue,onChangeInput,maxTags,className,tagClassName,inputProps}:{
    value:string[],
    onChange:(tags:string[])=>void,
    inputValue:string,
    onChangeInput:(value:string)=>void,
    maxTags:number,
    className?:string,
    tagClassName?:string,
    inputProps?:React.InputHTMLAttributes<HTMLInputElement>,
}):ReactElement{
    const inputRef = useRef<HTMLInputElement>(null)

    function addTag():boolean{
        const tag = inputValue.trim()
        if(!tag || value.includes(tag) || value.length >= maxTags) return false
        onChange([...value, tag])
        onChangeInput("")
        return true
    }

    function handleKeyDown(e:KeyboardEvent<HTMLInputElement>){
        if(e.key === "Enter" || e.key === "Tab"){
            const added = addTag()
            if(added || e.key === "Enter") e.preventDefault()
        }
        else if(e.key === "Backspace" && inputValue === "" && value.length > 0){
            e.preventDefault()
            onChange(value.slice(0, -1))
        }
    }

    return <div className={className} onClick={(e)=>{
        if(e.target === e.currentTarget || (e.target as HTMLElement).parentElement === e.currentTarget) inputRef.current?.focus()
    }}>
        <span>
            {value.map((tag)=><span key={tag} className={tagClassName}>{tag}</span>)}
            <input ref={inputRef} type="text" value={inputValue} onChange={(e)=>onChangeInput(e.target.value)} onKeyDown={handleKeyDown} {...inputProps}/>
        </span>
    </div>
}
