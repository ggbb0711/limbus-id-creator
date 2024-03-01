import { useState } from "react";

interface IFileInput{
    [key:string]:{
        value:string,
        cb?:(newValue:string)=>void
    }
}

export default function useFileInput({inputs}:{inputs:IFileInput}){
    const [inputValue,setInputValue]=useState(inputs)

    function onChange(e:React.ChangeEvent<HTMLInputElement>){
        const newInputValue=inputValue

        newInputValue[e.target.name].value=e.target.value

        setInputValue(newInputValue)
        if(newInputValue[e.target.name].cb) newInputValue[e.target.name].cb(e.target.value)
    }

    return [inputValue,onChange]

}