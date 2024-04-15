import { ContenteditableEditor } from "@textcomplete/contenteditable";
import { Textcomplete } from "@textcomplete/core";
import { useStatusEffectContext } from "component/context/StatusEffectContext";
import React from "react";
import { ReactElement, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";


export default function EditableAutoCorrect({inputId,content,matchList,changeHandler}:{inputId:string,content:string,changeHandler:(e:React.ChangeEvent<HTMLInputElement>)=>void,matchList:{[key:string]:string}}):ReactElement{
    const contentEditableRef=useRef(null)
    const {statusEffect} = useStatusEffectContext()

    useEffect(()=>{
        if(contentEditableRef){
            const editable= new ContenteditableEditor(contentEditableRef.current)
            const textComplete= new Textcomplete(editable,[{
                match: /\[([\-+\w]*)$/,
                search(term, callback, match) {
                    callback(Object.keys(statusEffect).map(key=>[key,statusEffect[key]]).filter(value=>value[0].match(term)))
                },
                template: ([keyWord, html]) =>html,
                replace: (result): string => `[${result[0]}] `
            }],{dropdown:{maxCount:5,item:{className: "textcomplete-item",activeClassName: "textcomplete-item active",}}})
        }
    },[])
    
    return  <ContentEditable id={inputId}
    className="input skill-effect-input"
    innerRef={contentEditableRef}
    html={content}
    onChange={changeHandler}/>    
}