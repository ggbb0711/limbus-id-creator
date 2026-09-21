import IUID from "Types/IUID";
import uuid from "react-uuid";
import { IType } from "../../IType";
import { SkillTypes } from "../../SkillTypes";

interface ISinCost{
    wrath:number;
    lust:number;
    sloth:number;
    gluttony:number;
    gloom:number;
    pride:number;
    envy:number;
}

export interface IPassiveSkill extends IType,IUID{
    name:string,
    skillEffect:string,
    affinity:string,
    req:string,//Res, Own or None
    reqNo:number,
    skillLabel: string,
    reqOwn:ISinCost,
    reqRes:ISinCost
}

export class PassiveSkill implements IPassiveSkill,IUID{
    skillLabel:string="PASSIVE";
    inputId: string=uuid();
    name: string ="";
    skillEffect: string ="";
    type = SkillTypes.PassiveSkill;
    affinity:string="Wrath";
    req:string="Own";//Res or own or none
    reqNo:number=1;
    reqOwn: ISinCost = {
        wrath: 0,
        lust: 0,
        sloth: 0,
        gluttony: 0,
        gloom: 0,
        pride: 0,
        envy: 0
    };

    reqRes: ISinCost = {
        wrath: 0,
        lust: 0,
        sloth: 0,
        gluttony: 0,
        gloom: 0,
        pride: 0,
        envy: 0
    };
    public constructor(name?:string,skillLabel?:string){
        this.name=(name)?name:""
        this.skillLabel=(skillLabel)?skillLabel:"PASSIVE"
    }
}