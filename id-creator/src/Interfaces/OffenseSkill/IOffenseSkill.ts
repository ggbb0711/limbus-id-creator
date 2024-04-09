import { IActiveSkill } from "Interfaces/ActiveSkill/IActiveSkill";
import { IActiveSkillEffect } from "Interfaces/ActiveSkill/IActiveSkillEffect";
import IUID from "Interfaces/IUID";
import uuid from "../../../node_modules/react-uuid/uuid";

export interface IOffenseSkill extends IActiveSkill,IUID{
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
    type: string="OffenseSkill";
    public constructor(name?:string,skillAffinity?:string,skillAmt?:number,skillLabel?:string){
        this.name=(name)?name:""
        this.skillAffinity=(skillAffinity)?skillAffinity:"Wrath"
        this.skillAmt=(skillAmt)?skillAmt:1
        this.skillLabel=(skillLabel)?skillLabel:"SKILL"
    }
}