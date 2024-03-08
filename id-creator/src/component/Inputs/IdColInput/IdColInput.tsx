import { CustomEffect, ICustomEffect } from "Interfaces/CustomEffect/ICustomEffect";
import { DefenseSkill, IDefenseSkill } from "Interfaces/DefenseSkill/IDefenseSkill";
import { IOffenseSkill, OffenseSkill } from "Interfaces/OffenseSkill/IOffenseSkill";
import { IPassiveSkill, PassiveSkill } from "Interfaces/PassiveSkill/IPassiveSkill";
import { useIdInfoContext } from "component/context/IdInfoContext";
import React, { ReactElement, useState } from "react";
import uuid from "../../../../node_modules/react-uuid/uuid";
import OffenseSkillInput from "../SkillAndEffectInput/OffenseSkillInput/OffenseSkillInput";
import DropDown from "component/DropDown/DropDown";
import DefenseSkillInput from "../SkillAndEffectInput/DeffenseSkill/DefenseSkillInput";
import PassiveSkillInput from "../SkillAndEffectInput/PassiveSkill/PassiveSkillInput";
import CustomEffectInput from "../SkillAndEffectInput/CustomEffect/CustomEffectInput";
import MentalEffectInput from "../SkillAndEffectInput/MentalEffect/MentalEffectInput";
import { MentalEffect } from "Interfaces/MentalEffect/IMentalEffect";

export default function IdColInput({index}:{index:number}):ReactElement{
    const {idInfoValue,setIdInfoValue}=useIdInfoContext()
    const [inputType,setInputType]=useState<string>("OffenseSkill")

    function addInput(){
        const newIdInfoValue=idInfoValue

        switch(inputType){
            case"OffenseSkill":{
                newIdInfoValue.cols[index].push(new OffenseSkill())
                break;
            }
            case"DefenseSkill":{
                newIdInfoValue.cols[index].push(new DefenseSkill())
                break;
            }
            case"PassiveSkill":{
                newIdInfoValue.cols[index].push(new PassiveSkill())
                break;
            }
            case"CustomEffect":{
                newIdInfoValue.cols[index].push(new CustomEffect())
                break;
            }
            case"MentalEffect":{
                newIdInfoValue.cols[index].push(new MentalEffect())
                break;
            }
            default:{
                break;
            }
        }
        setIdInfoValue({...newIdInfoValue})
    }

    return(<div>
        {idInfoValue.cols[index].map((input:IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect,i:number)=>{
            switch(input.type){
                case "OffenseSkill":{
                    return <OffenseSkillInput colIndex={index} inputIndex={i} key={input.inputId}/>
                }
                case "DefenseSkill":{
                    return <DefenseSkillInput colIndex={index} inputIndex={i} key={input.inputId}/>
                }
                case "PassiveSkill":{
                    return <PassiveSkillInput colIndex={index} inputIndex={i} key={input.inputId}/>
                }
                case "CustomEffect":{
                    return <CustomEffectInput colIndex={index} inputIndex={i} key={input.inputId}/>
                }
                case "MentalEffect":{
                    return <MentalEffectInput colIndex={index} inputIndex={i} key={input.inputId}/>
                }
                default:{
                    break
                }
            }
        })}
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
        <button onClick={addInput}>Add input</button>
    </div>)
}