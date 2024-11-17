import React, { ReactElement } from "react";
import "../InputTabContainer.css"
import { useIdInfoContext } from "component/context/IdInfoContext";
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
import InputIdInfoStatPage from "component/CardMakerComponents/InputTab/InputStatPage/InputIdInfoStatPage/InputIdInfoStatPage";
import InputTabSide from "component/CardMakerComponents/InputTab/InputTabSide/InputTabSide";
import { useAlertContext } from "component/context/AlertContext";


export default function InputTabIdInfoContainer({
        resetBtnHandler,
        activeTab,
        changeActiveTab,
    }:{
        resetBtnHandler:()=>void,
        activeTab:number,
        changeActiveTab:(i:number)=>void}):ReactElement{
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()
    const {statusEffect}=useStatusEffectContext()
    const {addAlert} = useAlertContext()


    

    function deleteHandler(id:string){
        for(let i = 0;i<idInfoValue.skillDetails.length;i++){
            if(idInfoValue.skillDetails[i].inputId===id){
                const newIdInfoValue={...idInfoValue}

                newIdInfoValue.skillDetails.splice(i,1)
                
                setIdInfoValue({...newIdInfoValue})
                if(i===activeTab&&i===idInfoValue.skillDetails.length) changeActiveTab(activeTab-1)
            }
        }
    }

    function addTab(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect){
        if(idInfoValue.skillDetails.length>=20)addAlert("Failure","There can only be 20 or less skill/effects in an ID")
        else setIdInfoValue({...idInfoValue,skillDetails:[...idInfoValue.skillDetails,skill]})
    }

    function showInputPage(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never,index:number){
        if(!skill) return;
        function changeSkill(newSkill:{[key:string]:string}){
            const newIdInfoValue={...idInfoValue}
            newIdInfoValue.skillDetails[index]=newSkill
            setIdInfoValue({...newIdInfoValue})
        }
        
        function changeSkillType(newVal:string){
            const newIdInfoValue={...idInfoValue}
            
            switch(newVal){
                case "OffenseSkill":{
                    newIdInfoValue.skillDetails.splice(index,1,new OffenseSkill())
                    setIdInfoValue({...newIdInfoValue})
                    break
                }
                case "DefenseSkill":{
                    newIdInfoValue.skillDetails.splice(index,1,new DefenseSkill())
                    setIdInfoValue({...newIdInfoValue})
                    break
                }
                case "PassiveSkill":{
                    newIdInfoValue.skillDetails.splice(index,1,new PassiveSkill())
                    setIdInfoValue({...newIdInfoValue})
                    break
                }
                case "CustomEffect":{
                    newIdInfoValue.skillDetails.splice(index,1,new CustomEffect())
                    setIdInfoValue({...newIdInfoValue})
                    break
                }
                case "MentalEffect":{
                    newIdInfoValue.skillDetails.splice(index,1,new MentalEffect())
                    setIdInfoValue({...newIdInfoValue})
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
        <InputTabSide sinnerIcon={idInfoValue.sinnerIcon} skillDetails={idInfoValue.skillDetails} changeTab={changeActiveTab} 
        activeTab={activeTab} addTab={addTab} resetBtnHandler={resetBtnHandler}></InputTabSide>
        {(activeTab!==-2)?(activeTab===-1)?<InputIdInfoStatPage  collaspPage={()=>changeActiveTab(-2)}/>:showInputPage(idInfoValue.skillDetails[activeTab],activeTab):<></>}
    </div>
}