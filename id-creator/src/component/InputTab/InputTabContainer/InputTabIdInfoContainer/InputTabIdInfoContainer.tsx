import React, { ReactElement, useState } from "react";
import "../InputTabContainer.css"
import { useIdInfoContext } from "component/context/IdInfoContext";
import { IOffenseSkill, OffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { CustomEffect, ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { DefenseSkill, IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IMentalEffect, MentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { IPassiveSkill, PassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import { useStatusEffectContext } from "component/context/StatusEffectContext";
import InputCustomEffectPage from "component/InputTab/InputCustomEffectPage/InputCustomEffectPage";
import InputDefenseSkillPage from "component/InputTab/InputDefenseSkillPage/InputDefenseSkillPage";
import InputMentalEffect from "component/InputTab/InputMentalEffect/InputMentalEffect";
import InputOffenseSkillPage from "component/InputTab/InputOffenseSkillPage/InputOffenseSkillPage";
import InputPassivePage from "component/InputTab/InputPassivePage/InputPassivePage";
import InputIdInfoStatPage from "component/InputTab/InputStatPage/InputIdInfoStatPage/InputIdInfoStatPage";
import InputTabHeader from "component/InputTab/InputTabHeader/InputTabHeader";

export default function InputTabIdInfoContainer():ReactElement{
    const [activeTab,setActiveTab]=useState(-1)
    const {idInfoValue,setIdInfoValue} = useIdInfoContext()
    const {statusEffect}=useStatusEffectContext()
    

    function deleteHandler(i:number){
        let newIndex=i
        if(newIndex<=activeTab){ 
            setActiveTab(newIndex-1)
        }

        const newIdInfoValue={...idInfoValue}

        newIdInfoValue.skillDetails.splice(newIndex,1)
        
        setIdInfoValue({...newIdInfoValue})
    }

    function addTab(){
        const newTab=new OffenseSkill()
        setIdInfoValue({...idInfoValue,skillDetails:[...idInfoValue.skillDetails,newTab]})
    }

    function showInputPage(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never,index:number){
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
                return <InputOffenseSkillPage offenseSkill={skill as IOffenseSkill} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} />
            }
            case "DefenseSkill":{
                return <InputDefenseSkillPage defenseSkill={skill as IDefenseSkill} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} />
            }
            case "PassiveSkill":{
                return <InputPassivePage passiveSkill={skill as IPassiveSkill} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType}/>
            }
            case "CustomEffect":{
                return <InputCustomEffectPage customEffect={skill as ICustomEffect} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} />
            }
            case "MentalEffect":{
                return <InputMentalEffect mentalEffect={skill as IMentalEffect} keyWordList={statusEffect} changeSkill={changeSkill} changeSkillType={changeSkillType} />
            }
        }
    }

    return <div className="input-tab-container">
        <InputTabHeader changeTab={setActiveTab} activeTab={activeTab} skillDetails={idInfoValue.skillDetails} addTab={addTab} deleteHandler={deleteHandler}/>
        {(activeTab===-1)?<InputIdInfoStatPage/>:showInputPage(idInfoValue.skillDetails[activeTab],activeTab)}
    </div>
}