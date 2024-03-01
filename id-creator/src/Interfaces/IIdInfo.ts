import { ICustomEffect } from "./CustomEffect/ICustomEffect";
import { IDefenseSkill } from "./DefenseSkill/IDefenseSkill";
import { IOffenseSkill } from "./OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "./PassiveSkill/IPassiveSkill";

export interface IIdInfo{
    title:string,
    name:string,
    splashArt:string,
    HP:number,
    minSpeed:number,
    maxSpeed:number,
    defenseLevel:number,
    cols:((IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|never)[])[]
}