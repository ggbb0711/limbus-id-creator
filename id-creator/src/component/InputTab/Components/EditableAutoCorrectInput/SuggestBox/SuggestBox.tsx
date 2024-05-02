import React, { forwardRef, Ref, useEffect, useState } from "react";
import { ReactElement } from "react";
import "./SuggestBox.css"
import useKeyPress from "component/util/useKeyPress";

interface SuggestBoxProps {
    isActive: boolean;
    items: any[];
    selectFunc: (item: any) => void;
    template: (item: any) => ReactElement;
    position:{
      top:number,
      left:number,
    },
    currentActiveChoice:number
}

// export function createSuggestBox({contentEditableRef}:{contentEditableRef:React.MutableRefObject<any>}){
//     useEffect(() => {
//         const handleKeyUp = () => {
//           const position = getCaretCharacterOffsetWithin(contentEditableRef.current);
//           console.log(Object.keys(matchList).map(key=>[key,matchList[key]]).filter(value=>{
//             return value[0].match(contentEditableRef.current.innerHTML.substring(contentEditableRef.current.innerHTML.search(regex))).slice(1)}
//         ).slice(0,4))
//           setItemList(Object.keys(matchList).map(key=>[key,matchList[key]]).filter(value=>value[0].match(content.substring(content.search(regex))).slice(1)).slice(0,4))
//         };
    
//         contentEditableRef.current.addEventListener('keyup', handleKeyUp);
    
//         return () => {
//             contentEditableRef.current.removeEventListener('keyup', handleKeyUp);
//         };
//     }, []);
// }

const SuggestBox = forwardRef(
    (
      { isActive, items, selectFunc, template, position, currentActiveChoice }: SuggestBoxProps,
      ref: Ref<HTMLDivElement>
    ): ReactElement => {
      const {top,left} = position
      
      return (
        <div ref={ref} className={`suggest-box ${isActive ? "" : "hidden"}`} style={{ top,left }}>
          {items.map((item, i) => (
            <div className={`textcomplete-item ${currentActiveChoice===i?'active':''}`} onClick={() => selectFunc(item)} key={i}>
              {template(item)}
            </div>
          ))}
        </div>
      );
    }
  );
  
  export default SuggestBox;