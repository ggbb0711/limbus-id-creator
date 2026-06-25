import IUID from "Types/IUID";
import uuid from "react-uuid";
import { IType } from "../../IType";
import { SkillTypes } from "../../SkillTypes";

export interface ICustomEffect extends IType,IUID{
    name:string,
    customImg:string,
    effectColor:string,
    effect:string,
    isCoinType: boolean,
}

export class CustomEffect implements ICustomEffect,IUID{
    inputId: string=uuid();
    name:string="";
    customImg:string="";
    effectColor:string="#F1F1F1";
    effect:string="";
    type = SkillTypes.CustomEffect;
    isCoinType: boolean = false;
}