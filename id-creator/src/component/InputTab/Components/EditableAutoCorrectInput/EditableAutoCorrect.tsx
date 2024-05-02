import React, { useMemo, useState } from "react";
import { ReactElement, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import SuggestBox from "./SuggestBox/SuggestBox";
import useKeyPress from "component/util/useKeyPress";
import "./EditableAutoCorrect.css"
import getCaretCharacterOffsetWithin from "component/util/getCaretCharacterOffsetWithin";
import getCaretHTMLCharacterOffSet from "component/util/getCaretHTMLCharacterOffSet";
import ecapeRegExp from "component/util/ecapeRegExp";
import setEditableCaretPos from "component/util/setEditableCaretPos";


export default function EditableAutoCorrect({inputId,content,matchList,changeHandler}:{inputId:string,content:string,changeHandler:(e:React.ChangeEvent<HTMLInputElement>)=>void,matchList:{[key:string]:string}}):ReactElement{
    const contentEditableRef=useRef<HTMLDivElement>(null)
    const suggestionBoxRef = useRef<HTMLDivElement>(null)
    const [activeSuggestBox,setActiveSuggestBox]=useState(false)
    const [suggestBoxPos,setSuggestBoxPos] = useState({left:0,top:15})
    const [currentActiveChoice,setCurrentActiveChoice] = useState(0)
    const [itemList,setItemList] = useState<((string|ReactElement)[])[]>([])
    const [caretPos,setCaretPos] = useState(0)
    const enterKeyPress=useKeyPress("Enter",contentEditableRef)
    const arrowUpKeyPress = useKeyPress("ArrowUp",contentEditableRef)
    const arrowDownKeyPress = useKeyPress("ArrowDown",contentEditableRef)
    const regex = /(?<=\[)([\-+\w]*)$/g
    
    const selectSuggestion = useMemo(() => {
        return function(item) {
            if(contentEditableRef.current){
                const addInItem =`${item[0]}] ` 
                const innerHTMLIndex = getCaretHTMLCharacterOffSet(contentEditableRef.current.innerHTML,caretPos)
                const foundWord=contentEditableRef.current.innerHTML.substring(0,innerHTMLIndex+1).match(regex)
                const firstHalf = contentEditableRef.current.innerHTML.substring(0,innerHTMLIndex+1).replace(regex,addInItem)
                const secondHalf =  contentEditableRef.current.innerHTML.substring(innerHTMLIndex+1)

                contentEditableRef.current.innerHTML = firstHalf + secondHalf
                const event = new Event("input", { bubbles: true })
                contentEditableRef.current.dispatchEvent(event)
                setActiveSuggestBox(false)
                setItemList([])
                setCaretPos(caretPos-foundWord[0].length+addInItem.length-2)
            }
        };
    }, [contentEditableRef, regex, setActiveSuggestBox, caretPos]);

    const updateSuggestBox = useMemo(() => {
        return function() {
            if(suggestionBoxRef.current){
                const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
                const parentRect = contentEditableRef.current.getBoundingClientRect();
                let left = rect.left - parentRect.left + window.scrollX;
                let top = rect.top - parentRect.top + window.scrollY + 20;
                
                setSuggestBoxPos({left, top});
            }
        };
    }, [suggestionBoxRef, contentEditableRef, setSuggestBoxPos]);

    const updateItemList = useMemo(()=>()=>{
        const textNoLine = (contentEditableRef.current.innerText as string).replace(/(\r\n|\n|\r)/gm,"").substring(0,caretPos+1).toLowerCase()
        const newItemList = Object.keys(matchList).map(key=>[key,matchList[key]]).filter(value=>{
            const searchIndex=textNoLine.search(regex)
            if(searchIndex<0) return false
            const matchSubString = textNoLine.substring(searchIndex)
            
            return value[0].match(ecapeRegExp(matchSubString))}
        ).slice(0,4)
        if(newItemList.length>0){
            setActiveSuggestBox(true)
            updateSuggestBox()
            setCurrentActiveChoice(0)
        }
        else setActiveSuggestBox(false)
        setItemList(newItemList)
    },[caretPos,matchList,contentEditableRef])

    const handleKeyUp=useMemo(()=>()=>{
        const position = getCaretCharacterOffsetWithin(contentEditableRef.current);
        setCaretPos(position)
    },[])

    useEffect(()=>{
        updateItemList()
    },[caretPos])
    
    useEffect(()=>{
        if((enterKeyPress)&&itemList.length>0&&activeSuggestBox) selectSuggestion(itemList[currentActiveChoice])
    },[enterKeyPress])

    useEffect(()=>{
        if(arrowDownKeyPress&&itemList.length>0&&activeSuggestBox) setCurrentActiveChoice((currentActiveChoice+1>itemList.length-1)?0:currentActiveChoice+1)
    },[arrowDownKeyPress])

    useEffect(()=>{
        if(arrowUpKeyPress&&itemList.length>0&&activeSuggestBox) setCurrentActiveChoice((currentActiveChoice-1<0)?itemList.length-1:currentActiveChoice-1)
    },[arrowUpKeyPress])

    useEffect(()=>{
        //So the suggestion box dissappear when click on another tab
        setActiveSuggestBox(false)
    },[inputId])

    useEffect(()=>{
        const {left,top} = suggestBoxPos
        const newLeft = ((left+suggestionBoxRef.current.clientWidth)>=contentEditableRef.current.clientWidth)?left-suggestionBoxRef.current.clientWidth:left
        const newTop = ((top+suggestionBoxRef.current.clientHeight)>=contentEditableRef.current.clientHeight)?top - suggestionBoxRef.current.clientHeight - 20:top
        setSuggestBoxPos({left:newLeft,top:newTop})
    },[JSON.stringify(suggestBoxPos)])

    useEffect(()=>{
        //For some reason the contenteditable component doesn't change the itemList and activeSuggestBox dependencies
        //when putting it as a prop
        if(contentEditableRef.current) contentEditableRef.current.onkeydown=((e)=>{
            if(((itemList.length>0||activeSuggestBox)&&(e.key==="Enter"||e.key==="ArrowUp"||e.key==="ArrowDown"))){
                e.preventDefault()
            }
        })
    },[JSON.stringify(itemList),activeSuggestBox])

    return <div style={{position:"relative"}}>
        <ContentEditable id={inputId}
            className="input editable-auto-correct"
            innerRef={contentEditableRef}
            html={content}
            onChange={changeHandler}
            onKeyUp={handleKeyUp}
            contentEditable={true}
        />
        <SuggestBox ref={suggestionBoxRef} 
            isActive={activeSuggestBox} 
            items={itemList} 
            template={(item) => <div dangerouslySetInnerHTML={{ __html: item[1] }}></div>} 
            selectFunc={(item) => selectSuggestion(item)} 
            position={suggestBoxPos}
            currentActiveChoice={currentActiveChoice} />
    </div> 
}