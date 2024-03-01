import { useState } from "react";

interface ITextInput{
    [key:string]:{
        value:string,
        cb?:(e:React.ChangeEvent<HTMLInputElement>)=>void
    }
}

export default function useTextInput({inputs}:{inputs:ITextInput}){
    const [inputValue,setInputValue]=useState(inputs)

    function onChange(e:React.ChangeEvent<HTMLInputElement>){
        const newInputValue=inputValue

        newInputValue[e.target.name].value=e.target.value

        setInputValue(newInputValue)
        if(newInputValue[e.target.name].cb) newInputValue[e.target.name].cb(e)
    }

    return [inputValue,onChange]

}