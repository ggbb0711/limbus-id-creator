import IUID from "Interfaces/IUID";
import ISkill from "Interfaces/SkillAndEffect/ISkill"
import uuid from "../../../node_modules/react-uuid/uuid";

export interface IPassiveSkill extends ISkill,IUID{
    name:string,
    skillEffect:string,
    affinity:string,
    req:string,//Res, Own or None
    reqNo:number,
    skillLabel: string,
}

export class PassiveSkill implements IPassiveSkill,IUID{
    skillLabel:string="PASSIVE";
    inputId: string=uuid();
    name: string ="";
    skillEffect: string ="";
    type: string ="PassiveSkill";
    affinity:string="Wrath";
    req:string="Own";//Res or own or none
    reqNo:number=1
    public constructor(name?:string,skillLabel?:string){
        this.name=(name)?name:""
        this.skillLabel=(skillLabel)?skillLabel:"PASSIVE"
    }
}