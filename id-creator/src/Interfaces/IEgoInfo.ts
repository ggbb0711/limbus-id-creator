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
        Wrath_resistant:number;
        Lust_resistant:number;
        Sloth_resistant:number;
        Gluttony_resistant:number;
        Gloom_resistant:number;
        Pride_resistant:number;
        Envy_resistant:number;
    }
    sinCost:{
        Wrath_cost:number;
        Lust_cost:number;
        Sloth_cost:number;
        Gluttony_cost:number;
        Gloom_cost:number;
        Pride_cost:number;
        Envy_cost:number;
    }
    sinnerColor:string,
    sinnerIcon:string,
    egoLevel:string,
    skillDetails:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)[]
}