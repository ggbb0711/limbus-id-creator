import IUID from "types/IUID";
import uuid from "react-uuid";
import { IType } from "../../IType";
import { SkillTypes } from "../../SkillTypes";

export interface IMentalEffect extends IType,IUID{
    effect:string
}

export class MentalEffect implements IMentalEffect,IUID{
    inputId: string = uuid()
    effect: string = "";
    type = SkillTypes.MentalEffect;
}