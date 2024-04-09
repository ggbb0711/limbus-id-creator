import IUID from "Interfaces/IUID";
import IEffect from "Interfaces/SkillAndEffect/IEffect";
import uuid from "../../../node_modules/react-uuid/uuid";

export interface ICustomEffect extends IEffect,IUID{
    name:string,
    customImg:string,
    effectColor:string,
    effect:string,
}

export class CustomEffect implements ICustomEffect,IUID{
    inputId: string=uuid();
    name:string="";
    customImg:string="";
    effectColor:string="#F1F1F1";
    effect:string="";
    type:string="CustomEffect";
}