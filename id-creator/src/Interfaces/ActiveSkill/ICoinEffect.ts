import { IActiveSkillEffect } from "./IActiveSkillEffect";

export interface ICoinEffect{
    coin:number,
    effect:string
}

export class CoinEffect implements ICoinEffect{
    coin: number = 1;
    effect: ""
}