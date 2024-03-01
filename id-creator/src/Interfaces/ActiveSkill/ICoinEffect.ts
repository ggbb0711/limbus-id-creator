import { IActiveSkillEffect } from "./IActiveSkillEffect";

export interface ICoinEffect{
    coin:number,
    effect:IActiveSkillEffect[]
}

export class CoinEffect implements ICoinEffect{
    coin: number = 0;
    effect: IActiveSkillEffect[]=[]
}