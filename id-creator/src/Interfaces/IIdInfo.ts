import { ICustomEffect } from "./CustomEffect/ICustomEffect";
import { IDefenseSkill } from "./DefenseSkill/IDefenseSkill";
import { IMentalEffect, MentalEffect } from "./MentalEffect/IMentalEffect";
import { IOffenseSkill } from "./OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "./PassiveSkill/IPassiveSkill";

export interface IIdInfo{
    title:string,
    name:string,
    splashArt:string,
    splashArtScale:number,
    splashArtTranslation:{
        x:number,
        y:number,
    },
    HP:number,
    minSpeed:number,
    maxSpeed:number,
    staggerResist:string,
    defenseLevel:number,
    sinnerColor:string,
    sinnerIcon:string,
    slashResistant:number,
    pierceResistant:number,
    bluntResistant:number,
    rarity:string,
    skillDetails:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)[]
}