import { ICustomEffect } from "./CustomEffect/ICustomEffect";
import { DefenseSkill, IDefenseSkill } from "./DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "./MentalEffect/IMentalEffect";
import { IOffenseSkill, OffenseSkill } from "./OffenseSkill/IOffenseSkill";
import { IPassiveSkill, PassiveSkill } from "./PassiveSkill/IPassiveSkill";

interface ISplashArtTranslation{
    x:number,
    y:number
}

interface ISinResistant {
    wrath_resistant:number;
    lust_resistant:number;
    sloth_resistant:number;
    gluttony_resistant:number;
    gloom_resistant:number;
    pride_resistant:number;
    envy_resistant:number;
}

interface ISinCost{
    wrath_cost:number;
    lust_cost:number;
    sloth_cost:number;
    gluttony_cost:number;
    gloom_cost:number;
    pride_cost:number;
    envy_cost:number;
}

export interface IEgoInfo{
    title:string,
    name:string,
    sanityCost:number,
    splashArt:string,
    splashArtScale:number,
    splashArtTranslation:ISplashArtTranslation,
    sinResistant:ISinResistant
    sinCost:ISinCost
    sinnerColor:string,
    sinnerIcon:string,
    egoLevel:string,
    skillDetails:(IOffenseSkill|IDefenseSkill|IPassiveSkill|ICustomEffect|IMentalEffect|never)[]
}

export class EgoInfo implements IEgoInfo{
    title:string = "";
    name:string = "";
    sanityCost: number=0;
    splashArt:string = "";
    splashArtScale:number=1;
    splashArtTranslation:ISplashArtTranslation={
        x:0,
        y:0
    };
    sinResistant:ISinResistant = {
        wrath_resistant:1,
        lust_resistant:1,
        sloth_resistant:1,
        gluttony_resistant:1,
        gloom_resistant:1,
        pride_resistant:1,
        envy_resistant:1,
    };
    sinCost:ISinCost={
        wrath_cost:0,
        lust_cost:0,
        sloth_cost:0,
        gluttony_cost:0,
        gloom_cost:0,
        pride_cost:0,
        envy_cost:0,  
    };
    sinnerColor:string = "var(--Yi-Sang-color)";
    sinnerIcon:string = "Images/sinner-icon/Yi_Sang_Icon.png";
    egoLevel:string = "ZAYIN";
    skillDetails: (IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect | never)[] = [
        new OffenseSkill("Awakening", "Wrath", 1, "AWAKENING"),
        new OffenseSkill("Corrision", "Wrath", 1, "CORRISION"),
        new PassiveSkill("Passive", "PASSIVE"),
    ];

    public constructor(init?: Partial<IEgoInfo>){
        Object.assign(this,init)
    }
}