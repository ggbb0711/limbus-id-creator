import { ICustomEffect } from "./CustomEffect/ICustomEffect";
import { IDefenseSkill } from "./DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "./MentalEffect/IMentalEffect";
import { IOffenseSkill } from "./OffenseSkill/IOffenseSkill";
import { IPassiveSkill } from "./PassiveSkill/IPassiveSkill";

export interface IEgoInfo{
    title:string,
    name:string,
    sanityCost:number,
    splashArt:string,
    splashArtScale:number,
    splashArtTranslation:{
        x:number,
        y:number,
    },
    sinResistant:{
        wrath_resistant:number;
        lust_resistant:number;
        sloth_resistant:number;
        gluttony_resistant:number;
        gloom_resistant:number;
        pride_resistant:number;
        envy_resistant:number;
    }
    sinCost:{
        wrath_cost:number;
        lust_cost:number;
        sloth_cost:number;
        gluttony_cost:number;
        gloom_cost:number;
        pride_cost:number;
        envy_cost:number;
    }
    sinnerColor:string,
    sinnerIcon:string,
    egoLevel:string,
    skillDetails:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)[]
}