import { IActiveSkill } from "Interfaces/ActiveSkill/IActiveSkill";
import { IActiveSkillEffect } from "Interfaces/ActiveSkill/IActiveSkillEffect";
import { ICoinEffect } from "Interfaces/ActiveSkill/ICoinEffect";

export interface IOffenseSkill extends IActiveSkill{
    damageType:string
}


export class OffenseSkill implements IOffenseSkill{
    damageType: string="";
    name: string="";
    skillAffinity: string="";
    basePower: number =0;
    coinNo: number =0;
    coinPow: number =0;
    coins: ICoinEffect[]=[];
    skillImage: string="";
    skillEffect: IActiveSkillEffect;
    skillLabel: string="";
    type: string="OffenseSkill";
    
}