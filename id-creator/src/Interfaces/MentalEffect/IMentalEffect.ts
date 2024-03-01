import IEffect from "Interfaces/SkillAndEffect/IEffect";

export interface IMentalEffect extends IEffect{
    effect:string
}

export class MentalEffect implements IMentalEffect{
    effect: string = "";
    type: string = "MentalEffect";
}