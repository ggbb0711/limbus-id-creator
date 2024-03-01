import { ICoinEffect } from "./ICoinEffect";
import { IActiveSkillEffect } from "./IActiveSkillEffect";
import ISkill from "Interfaces/SkillAndEffect/ISkill";

export interface IActiveSkill extends ISkill{
    name:string,
    skillAffinity:string,
    basePower:number,
    coinNo:number,
    coinPow:number,
    coins:ICoinEffect[],//Must be positive
    skillImage:string,
    skillEffect:IActiveSkillEffect,
    skillLabel:string
}