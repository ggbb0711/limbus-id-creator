import { IActiveSkill } from "Interfaces/ActiveSkill/IActiveSkill";
import { IActiveSkillEffect } from "Interfaces/ActiveSkill/IActiveSkillEffect";
import { ICoinEffect } from "Interfaces/ActiveSkill/ICoinEffect";
import IUID from "Interfaces/IUID";
import uuid from "../../../node_modules/react-uuid/uuid";

export interface IDefenseSkill extends IActiveSkill,IUID{
    defenseType:string
}

export class DefenseSkill implements IDefenseSkill, IUID{
    inputId: string=uuid();
    defenseType: string = "Block";
    damageType: string = "Slash";//For counter skill
    name: string = "";
    skillAffinity: string = "";
    basePower: number = 0;
    coinNo: number = 0;
    coinPow: number = 0;
    coins: ICoinEffect[]=[];
    skillImage: string = "";
    skillEffect: string="";
    skillLabel: string = "";
    type: string = "DefenseSkill";
}