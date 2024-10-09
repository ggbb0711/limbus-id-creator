import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./DragAndDroppableSkill.css"


export default function DragAndDroppableSkill({skillId,isDraggingHandler,dropHandler,children}:{
        skillId:string,
        isDraggingHandler:(isDragging:boolean)=>void,
        dropHandler:(item:object)=>void,
        children:ReactNode
    }){
    const ref = useRef()
    const [borderPosition, setBorderPosition] = useState<"top" | "bottom" | null>(null);

    const [{isDragging},drag] = useDrag(()=>({
        type:"SinnerSkill",
        item:{
            id:skillId
        },
        collect:(monitor)=>({
            isDragging:monitor.isDragging()
        })
    }),[])
    const [{isOver},drop] = useDrop(()=>({
        accept:"SinnerSkill",
        drop:dropHandler,
        collect:(monitor)=>({
            isOver: monitor.isOver()
        }),
        hover(_, monitor) {
            if (ref.current) {
                const clientOffset = monitor.getClientOffset();
                if (clientOffset) {
                    const isTopHalf = isMouseInTopHalf(ref.current, clientOffset.y);
                    setBorderPosition(isTopHalf ? "top" : "bottom");
                }
            }
        },
    }),[])

    // useEffect(()=>{
    //     isDraggingHandler(isDragging)
    // },[isDragging])

    useEffect(()=>{
        if(!isOver) setBorderPosition(null)
    },[isOver])

    useEffect(()=>{
        if(ref.current)drag(drop(ref))
    },[ref])


    
    return <div ref={ref}
        onMouseDown={()=>isDraggingHandler(true)}
        onDragEnd={()=>isDraggingHandler(false)}
        onMouseUp={()=>isDraggingHandler(false)}
        className={borderPosition==="top"?"hover-border-top":borderPosition==="bottom"?"hover-border-bottom":""}
        >
        {children}
    </div>
}

function isMouseInTopHalf(element: HTMLElement, mouseY: number): boolean {
    const rect = element.getBoundingClientRect();
    const middleY = rect.top + (rect.height / 2);
    return mouseY < middleY;
}