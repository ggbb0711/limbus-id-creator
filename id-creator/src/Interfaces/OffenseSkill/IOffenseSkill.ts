import { IActiveSkill } from "Interfaces/ActiveSkill/IActiveSkill";
import { IActiveSkillEffect } from "Interfaces/ActiveSkill/IActiveSkillEffect";
import { ICoinEffect } from "Interfaces/ActiveSkill/ICoinEffect";
import IUID from "Interfaces/IUID";
import uuid from "../../../node_modules/react-uuid/uuid";

export interface IOffenseSkill extends IActiveSkill,IUID{
    damageType:string
}


export class OffenseSkill implements IOffenseSkill,IUID{
    inputId: string=uuid();
    damageType: string="Slash";
    name: string="";
    skillAffinity: string="Wrath";
    basePower: number =0;
    coinNo: number =0;
    coinPow: number =0;
    coins: ICoinEffect[]=[];
    skillImage: string="";
    skillEffect: string="";
    skillLabel: string="";
    type: string="OffenseSkill";
}