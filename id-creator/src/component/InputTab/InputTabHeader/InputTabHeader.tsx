import { useIdInfoContext } from "component/context/IdInfoContext";
import React from "react";
import { ReactElement } from "react";
import "./InputTabHeader.css"
import InputTab from "./InputTab/InputTab";
import { ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { DefenseSkill, IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IOffenseSkill, OffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";

export default function InputTabHeader({changeTab,activeTab}:{changeTab:(newTab:number)=>void,activeTab:number}):ReactElement{
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()

    const {skillDetails} = idInfoValue

    function deleteHandler(i:number){
        let newIndex=i
        if(newIndex<=activeTab){ 
            changeTab(newIndex-1)
        }

        const newIdInfoValue={...idInfoValue}

        newIdInfoValue.skillDetails.splice(newIndex,1)
        
        setIdInfoValue({...newIdInfoValue})
    }

    function addTab(){
        const newTab=new OffenseSkill()
        setIdInfoValue({...idInfoValue,skillDetails:[...skillDetails,newTab]})
    }

    function convertTabName(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never){
        const {type}=skill

        const placeHolderTab={
            "OffenseSkill":"ATK",
            "DefenseSkill":"DEF",
            "PassiveSkill":"PASS",
            "CustomEffect":"CUST",
            "MentalEffect":"MENT"
        }

        if(type!=="MentalEffect"){
            return ((skill as IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect).name?(skill as IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect).name:placeHolderTab[type])
        }
        else{
            return "MENT"
        }    
    }

    function convertTabIcon(type:string):string{
        switch (type){
            case "OffenseSkill":{
                return "Images/stat/stat_attack.png"
            }
            case "DefenseSkill":{
                return "Images/stat/stat_defense.png"
            }
            case "PassiveSkill":{
                return "Images/status-effect/Aggro.png"
            }
            case "CustomEffect":{
                return "Images/status-effect/Discard.png"
            }
            case "MentalEffect":{
                return "Images/Sanity.png"
            }
        }
        return ""
    }

    return <div className="input-tab-header-container">
        <InputTab tabName={"STAT"} tabColor={"var(--None-input-page)"} clickHandler={()=>changeTab(-1)} isActive={activeTab===-1}/>
        {skillDetails.map(function(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never,i:number){
            let tabIcon=convertTabIcon(skill.type)
            if(skill.type==="CustomEffect"){
                if((skill as ICustomEffect).customImg)tabIcon=(skill as ICustomEffect).customImg
            }
            return <InputTab key={skill.inputId} tabName={convertTabName(skill)} tabColor={`var(--${skill.type==="DefenseSkill"||skill.type==="OffenseSkill"?(skill as IOffenseSkill|IDefenseSkill).skillAffinity:"None"}-input-page)`} tabIcon={tabIcon} clickHandler={()=>changeTab(i)} deleteHandler={()=>deleteHandler(i)} isActive={activeTab===i}/>
        })}
        <span className="material-symbols-outlined add-icon" onClick={addTab}>
            add
        </span>
    </div>
}