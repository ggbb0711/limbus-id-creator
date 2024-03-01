import ISkill from "Interfaces/SkillAndEffect/ISkill"

export interface IPassiveSkill extends ISkill{
    name:string,
    skillEffect:string,
    ActiveReq:{
        affinity:string,
        req:string,//Res or own
        reqNo:number
    }[]
}

export class PassiveSkill implements IPassiveSkill{
    name: string ="";
    skillEffect: string ="";
    ActiveReq=[];
    type: string ="PassiveSkill";
}