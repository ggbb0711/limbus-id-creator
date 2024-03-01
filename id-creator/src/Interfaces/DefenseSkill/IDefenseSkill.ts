import { IActiveSkill } from "Interfaces/ActiveSkill/IActiveSkill";
import { IActiveSkillEffect } from "Interfaces/ActiveSkill/IActiveSkillEffect";
import { ICoinEffect } from "Interfaces/ActiveSkill/ICoinEffect";

export interface IDefenseSkill extends IActiveSkill{
    defenseType:string
}

export class DefenseSkill implements IDefenseSkill{
    defenseType: string = "";
    name: string = "";
    skillAffinity: string = "";
    basePower: number = 0;
    coinNo: number = 0;
    coinPow: number = 0;
    coins: ICoinEffect[]=[];
    skillImage: string = "";
    skillEffect: IActiveSkillEffect;
    skillLabel: string = "";
    type: string = "DefenseSkill";
}