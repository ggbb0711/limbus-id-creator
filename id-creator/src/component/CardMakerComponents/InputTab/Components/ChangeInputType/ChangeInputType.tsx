import DropDown from "component/util/DropDown/DropDown";
import React from "react";
import { ReactElement } from "react";


export default function ChangeInputType({changeSkillType,type}:{changeSkillType:(newVal:string)=>void,type:string}):ReactElement{

    // function changeSkillType(newVal:string){
    //     const newIdInfoValue={...idInfoValue}
        
    //     switch(newVal){
    //         case "OffenseSkill":{
    //             newIdInfoValue.skillDetails.splice(index,1,new OffenseSkill())
    //             setIdInfoValue({...newIdInfoValue})
    //         }
    //         case "DefenseSkill":{
    //             newIdInfoValue.skillDetails.splice(index,1,new DefenseSkill())
    //             setIdInfoValue({...newIdInfoValue})
    //         }
    //         case "PassiveSkill":{
    //             newIdInfoValue.skillDetails.splice(index,1,new PassiveSkill())
    //             setIdInfoValue({...newIdInfoValue})
    //         }
    //         case "CustomEffect":{
    //             newIdInfoValue.skillDetails.splice(index,1,new CustomEffect())
    //             setIdInfoValue({...newIdInfoValue})
    //         }
    //         case "MentalEffect":{
    //             newIdInfoValue.skillDetails.splice(index,1,new MentalEffect())
    //             setIdInfoValue({...newIdInfoValue})
    //         }
    //     }
    // }
    
    return <DropDown dropDownEl={{
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
    }} cb={changeSkillType} propVal={type}/>
}