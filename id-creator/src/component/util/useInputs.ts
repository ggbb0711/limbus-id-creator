import React, { useEffect, useState } from "react";
import replaceKeyWord from "./replaceKeyWord";
import sanitizeHtml from "sanitize-html";
import isObject from "utils/Functions/isObject";

interface INewInput{
    [type:string]:string|number|INewInput
}

export default function useInput(propInputs:INewInput,changeInput:(newInput:INewInput)=>void){
    const [inputs,setInputs]=useState(propInputs)

    function onChangeInput(inputName?:string){
        return(e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>)=>{
            if(inputName){
                const newInputs = {...inputs}
                let changedField = newInputs
                const fieldPathWay = inputName.split(".")

                for (let i = 0; i < fieldPathWay.length - 1; i++) {
                    let path = changedField[fieldPathWay[i]]
                    if(!isObject(path)) throw new Error("The path proived is not an object");
                    else changedField = path as INewInput
                }

                changedField[fieldPathWay[fieldPathWay.length-1]] = e.target.value

                changeInput(newInputs)
            } 
            else{
                changeInput({...inputs,[e.target.name]:e.target.value})
            }
        }
    }

    function onChangeAutoCorrectInput(keyWordList:{[key:string]:string},inputName?:string){
        return(e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>)=>{
            const replaceWords = replaceKeyWord(e.target.value,keyWordList)
            
            if(inputName) changeInput({...inputs,[inputName]:replaceWords})
            else{
                changeInput({...inputs,[e.target.name]:replaceWords})
            }
        }
    }

    function onChangeDropDownMenu(dropDownName:string){
        return (newVal:string)=>{
            changeInput({...inputs,[dropDownName]:newVal})
        }
    }


    function onChangeFile(e:React.ChangeEvent<HTMLInputElement>){
        let url="";
        const fr = new FileReader()
        if(e.currentTarget.files.length>0){
            fr.readAsDataURL(e.currentTarget.files[0])

            fr.addEventListener("load",()=>{
                url=fr.result as any
            })
        }
        changeInput({...inputs,[e.target.name]:(url)})
    }

    function onChangeFileWithName(inputName:string){
        return(e:React.ChangeEvent<HTMLInputElement>)=>{
            let url="";
            const fr = new FileReader()
            if(e.currentTarget.files.length>0){
                fr.readAsDataURL(e.currentTarget.files[0])

                fr.addEventListener("load",()=>{
                    url=fr.result as any
                    changeInput({...inputs,[inputName]:url})
                })
            }
        }
    }


    useEffect(()=>{
        if(JSON.stringify(propInputs)!==JSON.stringify(inputs)) setInputs(propInputs)
    },[propInputs])

    return {inputs,onChangeInput,onChangeAutoCorrectInput,onChangeDropDownMenu,onChangeFile,onChangeFileWithName}
    
}