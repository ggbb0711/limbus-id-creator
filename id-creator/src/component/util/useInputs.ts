import React, { useEffect, useState } from "react";
import replaceKeyWord from "./replaceKeyWord";
import sanitizeHtml from "sanitize-html";


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
            console.log(url)
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