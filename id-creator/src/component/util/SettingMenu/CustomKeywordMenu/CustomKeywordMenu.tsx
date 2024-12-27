import React, { useCallback, useEffect, useState } from "react";
import "./CustomKeywordMenu.css"
import { ICustomKeyword } from "Interfaces/ICustomKeyword";
import CustomKeywordTab from "./CustomKeywordTab";
import uuid from "react-uuid";


export default function CustomKeywordMenu(){
    const [newKeyword,setNewKeyword] = useState("")
    const [newKeywordColor,setNewKeywordColor] = useState("")
    const [customKeywords,setCustomKeywords] = useState<ICustomKeyword[]>([])

    useEffect(()=>{
        const customKeywordsString = localStorage.getItem("customKeywords")
        if(!customKeywordsString) localStorage.setItem("customKeywords","[]")
        else setCustomKeywords(JSON.parse(customKeywordsString))
    },[])

    useEffect(()=>{
        localStorage.setItem("customKeywords",JSON.stringify(customKeywords))
    },[JSON.stringify(customKeywords)])

    const changeKeyword = useCallback((id:string,newKeyword:string,newColor:string)=>{
        setCustomKeywords(keywords=>keywords.map(keyword=>{
            if(keyword.customKeywordID===id){
                keyword.keyword=newKeyword
                keyword.color=newColor
            }
            return keyword
        }))
    },[setCustomKeywords])

    const deleteKeyword = useCallback((id:string)=>{
        setCustomKeywords(keywords=>keywords.filter(keywords=>keywords.customKeywordID!==id))
    },[setCustomKeywords])



    return <div className="custom-keyword-menu">
        <form onSubmit={(e)=>{
            e.preventDefault()
            if(newKeyword&&customKeywords.length<20){
                setCustomKeywords([{
                    customKeywordID: uuid(),
                    keyword:newKeyword,
                    color:newKeywordColor
                },...customKeywords])
                setNewKeyword("")
            }
        }} className="custom-keyword-input-container">
            <label htmlFor="custom-keyword-input">Add new custom keyword(Note: custom keywords will only be saved on your current machine): </label>
            <input className="input" id="custom-keyword-input" name="custom-keyword-input" value={newKeyword} 
            style={{color:newKeywordColor}}
            onChange={(e)=>setNewKeyword(e.target.value)}></input>
            <div className="center-element">
                <label htmlFor="new-kewyord-color-input">Color: </label>
                <input type="color" id="new-kewyord-color-input" name="new-keyword-color-input" value={newKeywordColor} onChange={(e)=>setNewKeywordColor(e.target.value)}/>
            </div>
            <input type="submit" className="main-button" value={"Add"}></input>
        </form>
        <div className="custom-keyword-container">
            {customKeywords.map(keyword=>
                <React.Fragment key={keyword.customKeywordID}>
                    <CustomKeywordTab keyword={keyword} changeKeyword={changeKeyword} deleteKeyword={deleteKeyword}/>
                </React.Fragment>
            )}
        </div>
        <p>Custom keywords: {customKeywords.length}/20</p>
    </div>
}