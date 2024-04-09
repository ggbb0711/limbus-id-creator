import React, { ReactElement, useEffect, useState } from "react";
import "./SkillDetailContainer.css"
import { useIdInfoContext } from "component/context/IdInfoContext";
import { usePreviewContext } from "component/context/PreviewContext";
import DropDown from "component/DropDown/DropDown";
import OffenseSinnerSkill from "component/IdCard/sections/OffenseSinnerSkill/OffenseSinnerSkill";
import { CustomEffect, ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { DefenseSkill, IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IIdInfo } from "Interfaces/IIdInfo";
import { IMentalEffect, MentalEffect } from "Interfaces/MentalEffect/IMentalEffect";
import { OffenseSkill, IOffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { PassiveSkill, IPassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import DefenseSinnerSkill from "component/IdCard/sections/DefenseSinnerSkill/DefenseSinnerSkill";
import PassiveSinnerSkill from "component/IdCard/sections/PassiveSinnerSkill/PassiveSinnerSkill";
import CustomSinnerEffect from "component/IdCard/sections/CustomSinnerEffect/CustomSinnerEffect";
import MentalSinnerEffect from "component/IdCard/sections/MentalSinnerEffect/MentalSinnerEffect";

export default function SkillDetailContainer({}):ReactElement{
    const {idInfoValue,setIdInfoValue}=useIdInfoContext()
    const [containerWidth,setContainerWidth]=useState("fit-content")
    const {preview} = usePreviewContext()

    const [inputType,setInputType]=useState<string>("OffenseSkill")

    function addInput(){
        const newIdInfoValue=(idInfoValue as IIdInfo)

        switch(inputType){
            case"OffenseSkill":{
                newIdInfoValue.skillDetails.push(new OffenseSkill())
                break;
            }
            case"DefenseSkill":{
                newIdInfoValue.skillDetails.push(new DefenseSkill())
                break;
            }
            case"PassiveSkill":{
                newIdInfoValue.skillDetails.push(new PassiveSkill())
                break;
            }
            case"CustomEffect":{
                newIdInfoValue.skillDetails.push(new CustomEffect())
                break;
            }
            case"MentalEffect":{
                newIdInfoValue.skillDetails.push(new MentalEffect())
                break;
            }
            default:{
                break;
            }
        }
        setIdInfoValue({...newIdInfoValue})
    }

    function printSinnerSkill(skill:((IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)),index:number):HTMLElement{
        const skillType={
            OffenseSkill:<OffenseSinnerSkill key={skill.inputId} skillIndex={index} preview={preview}/>,
            DefenseSkill:<DefenseSinnerSkill key={skill.inputId} skillIndex={index} preview={preview}/>,
            PassiveSkill:<PassiveSinnerSkill key={skill.inputId} skillIndex={index} preview={preview} />,
            CustomEffect:<CustomSinnerEffect key={skill.inputId} skillIndex={index} preview={preview} />,
            MentalEffect:<MentalSinnerEffect key={skill.inputId} skillIndex={index} preview={preview} />
        }
        return skillType[skill.type]
    }

    useEffect(()=>{
        //Doing this because the container wouldn't extend based on the children
        //The width has to change so the container can extend
        setContainerWidth((containerWidth==="fit-content")?"auto":"fit-content")
    },[idInfoValue])

    return(
        <div className="skill-detail-container" style={{"width":containerWidth}}>
            {idInfoValue.skillDetails.map((skill:((IOffenseSkill|IDefenseSkill|IPassiveSkill|IMentalEffect|ICustomEffect|never)),i:number)=>
                printSinnerSkill(skill,i)
            )}
            {/* {preview?<></>:
            <div>
                <DropDown dropDownEl={{
                    OffenseSkill:{
                        el:<p>Offensive skill</p>,
                        value:"OffenseSkill"
                    },
                    DefenseSkill:{
                        el:<p>Defense skill</p>,
                        value:"DefenseSkill"
                    },
                    PassiveSkill:{
                        el:<p>Passive skill</p>,
                        value:"PassiveSkill"
                    },
                    CustomEffect:{
                        el:<p>Custom effect</p>,
                        value:"CustomEffect"
                    },
                    MentalEffect:{
                        el:<p>Mental effect</p>,
                        value:"MentalEffect"
                    },
                }} cb={setInputType}/>
                <button className="sinner-skill-add-btn" onClick={addInput}>Add skill</button>
            </div>} */}
            
        </div>
    )
}