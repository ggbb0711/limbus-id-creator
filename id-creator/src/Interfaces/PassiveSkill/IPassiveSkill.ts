import IUID from "Interfaces/IUID";
import ISkill from "Interfaces/SkillAndEffect/ISkill"
import uuid from "../../../node_modules/react-uuid/uuid";

interface ISinCost{
    wrath_cost:number;
    lust_cost:number;
    sloth_cost:number;
    gluttony_cost:number;
    gloom_cost:number;
    pride_cost:number;
    envy_cost:number;
}

export interface IPassiveSkill extends ISkill,IUID{
    name:string,
    skillEffect:string,
    affinity:string,
    req:string,//Res, Own or None
    reqNo:number,
    skillLabel: string,
    ownCost:ISinCost,
    resCost:ISinCost
}

export class PassiveSkill implements IPassiveSkill,IUID{
    skillLabel:string="PASSIVE";
    inputId: string=uuid();
    name: string ="";
    skillEffect: string ="";
    type: string ="PassiveSkill";
    affinity:string="Wrath";
    req:string="Own";//Res or own or none
    reqNo:number=1;
    ownCost: ISinCost = {
        wrath_cost: 0,
        lust_cost: 0,
        sloth_cost: 0,
        gluttony_cost: 0,
        gloom_cost: 0,
        pride_cost: 0,
        envy_cost: 0
    };

    resCost: ISinCost = {
        wrath_cost: 0,
        lust_cost: 0,
        sloth_cost: 0,
        gluttony_cost: 0,
        gloom_cost: 0,
        pride_cost: 0,
        envy_cost: 0
    };
    public constructor(name?:string,skillLabel?:string){
        this.name=(name)?name:""
        this.skillLabel=(skillLabel)?skillLabel:"PASSIVE"
    }
}