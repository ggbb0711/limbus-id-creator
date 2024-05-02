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
            //The library keep filtering out the inline style
            //I have to extract out the span and its style
            //then, inject it after it has been cleaned
            // const styleRegex =/(?<=<span\s[^>]*\s)style=['"]([^'"]*)['"]/gm
            // const spanRegex =/<span\s[^>]*>/gm
            // const styleAttributes = replaceWords.match(styleRegex)            
            // const cleanInput = sanitizeHtml(replaceWords,{
            //     allowedTags:['div','span','br','img'],
            //     allowedAttributes:{
            //         span:["style","contenteditable","class"],
            //         img:["class","src","alt"],
            //     },
            //     allowedStyles:{
            //         'span':{
            //             'color': [/^#(0x)?[0-9a-f]+$/i],
            //             'text-decoration':[/^underline$/]
            //         }
            //     },
            //     allowedSchemes:['data']
            // })
            // const spanTagArr = cleanInput.match(spanRegex)
            // const textBetweenSpanTagArr = cleanInput.split(spanRegex)

            // //Inject the style back to the span tag
            // for (let i = 1; i < textBetweenSpanTagArr.length; i++) {
            //     textBetweenSpanTagArr[i]+=spanTagArr[i-1].slice(0,6)+styleAttributes[i-1]+spanTagArr[i-1].slice(6)               
            // }
            
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