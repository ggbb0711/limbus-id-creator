import React, { ReactNode, useEffect, useRef, useState } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import "./DragAndDroppableSkill.css"
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";


export default function DragAndDroppableSkill({skill,isDraggingHandler,dropHandler,children}:{
        skill:IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect,
        isDraggingHandler:(isDragging:boolean)=>void,
        dropHandler:(item:any)=>void,
        children:ReactNode
    }){
    const ref = useRef()

    const [_,drag] = useDrag(()=>({
        type:"SinnerSkill",
        item:{
            skill
        }
    }),[skill]) 
    const [{isOver},drop] = useDrop(()=>({
        accept:"SinnerSkill",
        drop:dropHandler,
        collect(monitor) {
            return {
                isOver:monitor.isOver()
            }
        },
    }),[dropHandler])

    // useEffect(()=>{
    //     isDraggingHandler(isDragging)
    // },[isDragging])


    useEffect(()=>{
        if(ref.current)drag(drop(ref))
    },[ref])


    
    return (
        <div ref={ref}
            onMouseDown={()=>isDraggingHandler(true)}
            onDragEnd={()=>isDraggingHandler(false)}
            onMouseUp={()=>isDraggingHandler(false)}
            className={isOver?"hover-border":""}
            
        >
            {children}
        </div>
    )
}
