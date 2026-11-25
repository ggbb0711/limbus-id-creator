import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import "./DragAndDroppableSkill.css"
import { SkillDetail } from "features/cardCreator/types/SkillDetail";
import { DndItemType } from "features/cardCreator/constants";


export default function DragAndDroppableSkill({skill,isDraggingHandler,dropHandler,children}:{
        skill:SkillDetail,
        isDraggingHandler:(isDragging:boolean)=>void,
        dropHandler:(item:any)=>void,
        children:ReactNode
    }){
    const ref = useRef<HTMLDivElement>(null)

    const [dimensions,setDimensions] = useState({ width: 0, height: 0 })

    const [{isDragging},drag] = useDrag(()=>({
        type:DndItemType.CardSkill,
        item:{
            skill,
            skillWidth: dimensions.width,
            skillHeight: dimensions.height
        },
        collect(monitor){
            return {
                isDragging:monitor.isDragging()
            }
        }
    }),[skill,dimensions]) 
    const [{isOver},drop] = useDrop(()=>({
        accept:DndItemType.CardSkill,
        drop:dropHandler,
        collect(monitor) {
            return {
                isOver:monitor.isOver()
            }
        },
    }),[dropHandler])

    useEffect(()=>{
        isDraggingHandler(isDragging)
    },[isDragging])


    useEffect(() => {
        if (ref.current) {
            const width = ref.current.clientWidth
            const height = ref.current.clientHeight
            setDimensions({ width, height })
            drag(drop(ref))
        }
    }, [ref, drag, drop])

    useEffect(()=>{
        if (ref.current) {
            const width = ref.current.clientWidth
            const height = ref.current.clientHeight
            setDimensions({ width, height })
        }
    },[ ref?.current?.clientWidth, ref?.current?.clientHeight])

    
    function pausePanning(e: React.MouseEvent){
        if(e.button !== 0) return
        isDraggingHandler(true)
        window.addEventListener("mouseup", () => isDraggingHandler(false), { once: true })
    }

    return (
        <div ref={ref}
            onMouseDown={pausePanning}
            className={isOver?"hover-border":""}
        >
            {children}
        </div>
    )
}
