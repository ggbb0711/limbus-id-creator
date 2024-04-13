import React, { useEffect, useState } from "react";
import replaceKeyWord from "./replaceKeyWord";

export default function useInput(propInputs:{[type:string]:string|number},changeInput:(newInput:{[type:string]:string|number})=>void){
    const [inputs,setInputs]=useState(propInputs)

    function onChangeInput(inputName?:string){
        return(e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>)=>{
            if(inputName) changeInput({...inputs,[inputName]:e.target.value})
            else{
                changeInput({...inputs,[e.target.name]:e.target.value})
            }
        }
    }

    function onChangeAutoCorrectInput(keyWordList:{[key:string]:string},inputName?:string){
        return(e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>)=>{
            if(inputName) changeInput({...inputs,[inputName]:replaceKeyWord(e.target.value,keyWordList)})
            else{
                changeInput({...inputs,[e.target.name]:replaceKeyWord(e.target.value,keyWordList)})
            }
        }
    }

    function onChangeDropDownMenu(dropDownName:string){
        return (newVal:string)=>{
            changeInput({...inputs,[dropDownName]:newVal})
        }
    }


    function onChangeFile(e:React.ChangeEvent<HTMLInputElement>){
        const files=e.currentTarget.files
        changeInput({...inputs,[e.target.name]:(files.length>0)?URL.createObjectURL(files[0]):""})
    }

    function onChangeFileWithName(inputName:string){
        return(e:React.ChangeEvent<HTMLInputElement>)=>{
            const files=e.currentTarget.files
            changeInput({...inputs,[inputName]:(files.length>0)?URL.createObjectURL(files[0]):""})
        }
    }


    useEffect(()=>{
        if(JSON.stringify(propInputs)!==JSON.stringify(inputs)) setInputs(propInputs)
    },[propInputs])

    return {inputs,onChangeInput,onChangeAutoCorrectInput,onChangeDropDownMenu,onChangeFile,onChangeFileWithName}
    
}