import IEffect from "Interfaces/SkillAndEffect/IEffect";

export interface ICustomEffect extends IEffect{
    name:string,
    customImg:string,
    effectColor:string,
    effect:string,
}

export class CustomEffect implements ICustomEffect{
    name:string="";
    customImg:string="";
    effectColor:string="";
    effect:string="";
    type:string="CustomEffect";
}