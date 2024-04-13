import React, { ReactElement, useState } from "react";
import "../InputTabContainer.css"
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
import InputTabHeader from "component/InputTab/InputTabHeader/InputTabHeader";
import { useEgoInfoContext } from "component/context/EgoInfoContext";
import InputEgoInfoStatPage from "component/InputTab/InputStatPage/InputEgoInfoStatPage/InputEgoInfoStatPage";

export default function InputTabEgoInfoContainer():ReactElement{
    const [activeTab,setActiveTab]=useState(-1)
    const {EgoInfoValue,setEgoInfoValue} = useEgoInfoContext()
    const {statusEffect}=useStatusEffectContext()

    function deleteHandler(i:number){
        let newIndex=i
        if(newIndex<=activeTab){ 
            setActiveTab(newIndex-1)
        }

        const newEgoInfoValue={...EgoInfoValue}

        newEgoInfoValue.skillDetails.splice(newIndex,1)
        
        setEgoInfoValue({...newEgoInfoValue})
    }

    function addTab(){
        const newTab=new OffenseSkill()
        setEgoInfoValue({...EgoInfoValue,skillDetails:[...EgoInfoValue.skillDetails,newTab]})
    }


    function showInputPage(skill:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never,index:number){
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
        <InputTabHeader changeTab={setActiveTab} activeTab={activeTab} skillDetails={EgoInfoValue.skillDetails} addTab={addTab} deleteHandler={deleteHandler}/>
        {(activeTab===-1)?<InputEgoInfoStatPage/>:showInputPage(EgoInfoValue.skillDetails[activeTab],activeTab)}
    </div>
}