import { IActiveSkill } from "features/cardCreator/types/skills/activeSkill/IActiveSkill";
import IUID from "types/IUID";
import uuid from "react-uuid";
import { IType } from "../../IType";
import { SkillTypes } from "../../SkillTypes";

export interface IDefenseSkill extends IActiveSkill,IType,IUID{
    defenseType:string,
    damageType:string,
    skillAmt: number,
    skillLevel:number,
    atkWeight: number,
}

export class DefenseSkill implements IDefenseSkill, IUID{
    skillLevel: number=0;
    skillAmt: number=1;
    atkWeight: number=1;
    inputId: string=uuid();
    defenseType: string = "Block";
    damageType: string = "Slash";//For counter skill
    name: string = "";
    skillAffinity: string = "Wrath";
    basePower: number = 0;
    coinNo: number = 1;
    coinPow: number = 0;
    skillImage: string = "";
    skillEffect: string="";
    skillLabel: string = "Defense";
    skillFrame: string = "1"
    type = SkillTypes.DefenseSkill;
    public constructor(name?:string){
        this.name=(name)?name:""
    }
}