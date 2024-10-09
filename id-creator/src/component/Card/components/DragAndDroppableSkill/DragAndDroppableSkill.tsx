import React, { ReactNode, useEffect, useRef, useState } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import "./DragAndDroppableSkill.css"


export default function DragAndDroppableSkill({skillId,isDraggingHandler,dropHandler,children}:{
        skillId:string,
        isDraggingHandler:(isDragging:boolean)=>void,
        dropHandler:(item:any)=>void,
        children:ReactNode
    }){
    const ref = useRef()

    const [_,drag] = useDrag(()=>({
        type:"SinnerSkill",
        item:{
            id:skillId
        }
    }),[])
    const [{},drop] = useDrop(()=>({
        accept:"SinnerSkill",
        drop:dropHandler,
    }),[dropHandler])

    // useEffect(()=>{
    //     isDraggingHandler(isDragging)
    // },[isDragging])


    useEffect(()=>{
        if(ref.current)drag(drop(ref))
    },[ref])


    
    return <div ref={ref}
        onMouseDown={()=>isDraggingHandler(true)}
        onDragEnd={()=>isDraggingHandler(false)}
        onMouseUp={()=>isDraggingHandler(false)}
        >
        {children}
    </div>
}
