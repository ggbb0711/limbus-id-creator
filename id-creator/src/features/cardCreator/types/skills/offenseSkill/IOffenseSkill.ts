import { IActiveSkill } from "features/cardCreator/types/skills/activeSkill/IActiveSkill";
import IUID from "types/IUID";
import uuid from "react-uuid";
import { IType } from "../../IType";
import { SkillTypes } from "../../SkillTypes";

export interface IOffenseSkill extends IActiveSkill, IType, IUID{
    damageType:string,
    skillLevel:number,
    skillAmt:number,
    atkWeight:number,
}


export class OffenseSkill implements IOffenseSkill,IUID{
    skillLevel: number=0;
    skillAmt: number=1;
    atkWeight: number=1;
    inputId: string=uuid();
    damageType: string="Slash";
    name: string="";
    skillAffinity: string="Wrath";
    basePower: number =0;
    coinNo: number =1;
    coinPow: number =0;
    skillImage: string="";
    skillEffect: string="";
    skillLabel: string="SKILL";
    skillFrame: string = "1";
    type = SkillTypes.OffenseSkill;
    public constructor(name?:string,skillAffinity?:string,skillAmt?:number,skillLabel?:string){
        this.name=(name)?name:""
        this.skillAffinity=(skillAffinity)?skillAffinity:"Wrath"
        this.skillAmt=(skillAmt)?skillAmt:1
        this.skillLabel=(skillLabel)?skillLabel:"SKILL"
    }
}