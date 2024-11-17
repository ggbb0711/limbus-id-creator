import React, { ReactElement, useEffect, useState } from "react";
import "../InputTabContainer.css"
import { IOffenseSkill, OffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { CustomEffect, ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { DefenseSkill, IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect, MentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IPassiveSkill, PassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import { useStatusEffectContext } from "component/context/StatusEffectContext";
import InputCustomEffectPage from "component/CardMakerComponents/InputTab/InputCustomEffectPage/InputCustomEffectPage";
import InputDefenseSkillPage from "component/CardMakerComponents/InputTab/InputDefenseSkillPage/InputDefenseSkillPage";
import InputMentalEffect from "component/CardMakerComponents/InputTab/InputMentalEffect/InputMentalEffect";
import InputOffenseSkillPage from "component/CardMakerComponents/InputTab/InputOffenseSkillPage/InputOffenseSkillPage";
import InputPassivePage from "component/CardMakerComponents/InputTab/InputPassivePage/InputPassivePage";
import { useEgoInfoContext } from "component/context/EgoInfoContext";
import InputEgoInfoStatPage from "component/CardMakerComponents/InputTab/InputStatPage/InputEgoInfoStatPage/InputEgoInfoStatPage";
import { useAlertContext } from "component/context/AlertContext";
import InputTabSide from "component/CardMakerComponents/InputTab/InputTabSide/InputTabSide";

export default function InputTabEgoInfoContainer({
        resetBtnHandler,
        activeTab,
        changeActiveTab,
    }:{
        resetBtnHandler:()=>void,
        activeTab:number,
        changeActiveTab:(i:number)=>void}):ReactElement{
    const {EgoInfoValue,setEgoInfoValue} = useEgoInfoContext()
    const {statusEffect}=useStatusEffectContext()
    const {addAlert} = useAlertContext()


    function deleteHandler(id:string){
        for(let i = 0;i<EgoInfoValue.skillDetails.length;i++){
            if(EgoInfoValue.skillDetails[i].inputId===id){
                const newIdInfoValue={...EgoInfoValue}

                newIdInfoValue.skillDetails.splice(i,1)
                
                setEgoInfoValue({...newIdInfoValue})
                if(i===activeTab&&i===EgoInfoValue.skillDetails.length) changeActiveTab(activeTab-1)
            }
        }
    }

    function addTab(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect){
        if(EgoInfoValue.skillDetails.length>=20)addAlert("Failure","There can only be 20 or less skill/effects in an ID")
        else setEgoInfoValue({...EgoInfoValue,skillDetails:[...EgoInfoValue.skillDetails,skill]})
    }


    function showInputPage(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never,index:number){
        if(!skill) return;
        function changeSkill(newSkill:{[key:string]:string}){
            const newEgoInfoValue={...EgoInfoValue}
            newEgoInfoValue.skillDetails[index]=newSkill
            setEgoInfoValue({...newEgoInfoValue})
        }
        
        function changeSkillType(newVal:string){
            const newEgoInfoValue={...EgoInfoValue}
            
            switch(newVal){
                case "OffenseSkill":{
                    newEgoInfoValue.skillDetails.splice(index,1,new OffenseSkill())
                    setEgoInfoValue({...newEgoInfoValue})
                    break
                }
                case "DefenseSkill":{
                    newEgoInfoValue.skillDetails.splice(index,1,new DefenseSkill())
                    setEgoInfoValue({...newEgoInfoValue})
                    break
                }
                case "PassiveSkill":{
                    newEgoInfoValue.skillDetails.splice(index,1,new PassiveSkill())
                    setEgoInfoValue({...newEgoInfoValue})
                    break
                }
                case "CustomEffect":{
                    newEgoInfoValue.skillDetails.splice(index,1,new CustomEffect())
                    setEgoInfoValue({...newEgoInfoValue})
                    break
                }
                case "MentalEffect":{
                    newEgoInfoValue.skillDetails.splice(index,1,new MentalEffect())
                    setEgoInfoValue({...newEgoInfoValue})
                    break
                }
            }
        }

        switch(skill.type){
            case "OffenseSkill":{
                return <InputOffenseSkillPage offenseSkill={skill as IOffenseSkill} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
            case "DefenseSkill":{
                return <InputDefenseSkillPage defenseSkill={skill as IDefenseSkill} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
            case "PassiveSkill":{
                return <InputPassivePage passiveSkill={skill as IPassiveSkill} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
            case "CustomEffect":{
                return <InputCustomEffectPage customEffect={skill as ICustomEffect} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
            case "MentalEffect":{
                return <InputMentalEffect mentalEffect={skill as IMentalEffect} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} deleteSkill={deleteHandler} collaspPage={()=>changeActiveTab(-2)}/>
            }
        }
    }

    return <div className="input-tab-container">
            <InputTabSide sinnerIcon={EgoInfoValue.sinnerIcon} skillDetails={EgoInfoValue.skillDetails} changeTab={changeActiveTab} 
            activeTab={activeTab} addTab={addTab} resetBtnHandler={resetBtnHandler}></InputTabSide>
            {(activeTab!==-2)?(activeTab===-1)?<InputEgoInfoStatPage  collaspPage={()=>changeActiveTab(-2)}/>:showInputPage(EgoInfoValue.skillDetails[activeTab],activeTab):<></>}
        </div>
}