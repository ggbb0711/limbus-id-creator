import React, { ReactElement, useState } from "react";
import "./InputTabContainer.css"
import InputStatPage from "../InputStatPage/InputStatPage";
import InputTabHeader from "../InputTabHeader/InputTabHeader";
import { useIdInfoContext } from "component/context/IdInfoContext";
import InputOffenseSkillPage from "../InputOffenseSkillPage/InputOffenseSkillPage";
import InputDefenseSkillPage from "../InputDefenseSkillPage/InputDefenseSkillPage";
import InputPassivePage from "../InputPassivePage/InputPassivePage";
import InputCustomEffectPage from "../InputCustomEffectPage/InputCustomEffectPage";
import InputMentalEffect from "../InputMentalEffect/InputMentalEffect";

export default function InputTabContainer():ReactElement{
    const [activeTab,setActiveTab]=useState(-1)
    const {idInfoValue} = useIdInfoContext()

    function showInputPage(type:string,index:number){
        switch(type){
            case "OffenseSkill":{
                return <InputOffenseSkillPage index={index}/>
            }
            case "DefenseSkill":{
                return <InputDefenseSkillPage index={index}/>
            }
            case "PassiveSkill":{
                return <InputPassivePage index={index}/>
            }
            case "CustomEffect":{
                return <InputCustomEffectPage index={index}/>
            }
            case "MentalEffect":{
                return <InputMentalEffect index={index}/>
            }
        }
    }

    return <div className="input-tab-container">
        <InputTabHeader changeTab={setActiveTab} activeTab={activeTab}/>
        {(activeTab===-1)?<InputStatPage/>:showInputPage(idInfoValue.skillDetails[activeTab].type,activeTab)}
    </div>
}