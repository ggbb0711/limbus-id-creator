import IUID from "Interfaces/IUID";
import ISkill from "Interfaces/SkillAndEffect/ISkill"
import uuid from "../../../node_modules/react-uuid/uuid";

export interface IPassiveSkill extends ISkill,IUID{
    name:string,
    skillEffect:string,
    affinity:string,
    req:string,//Res or own
    reqNo:number
}

export class PassiveSkill implements IPassiveSkill,IUID{
    inputId: string=uuid();
    name: string ="";
    skillEffect: string ="";
    type: string ="PassiveSkill";
    affinity:string;
    req:string="None";//Res or own or none
    reqNo:number
}