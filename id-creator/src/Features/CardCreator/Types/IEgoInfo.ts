import { ICustomEffect } from "./Skills/CustomEffect/ICustomEffect";
import { IDefenseSkill } from "./Skills/DefenseSkill/IDefenseSkill";
import { IMentalEffect } from "./Skills/MentalEffect/IMentalEffect";
import { IOffenseSkill, OffenseSkill } from "./Skills/OffenseSkill/IOffenseSkill";
import { IPassiveSkill, PassiveSkill } from "./Skills/PassiveSkill/IPassiveSkill";

interface ISplashArtTranslation{
    x:number,
    y:number
}

interface ISinResistant {
    wrath:number;
    lust:number;
    sloth:number;
    gluttony:number;
    gloom:number;
    pride:number;
    envy:number;
}

interface ISinCost{
    wrath:number;
    lust:number;
    sloth:number;
    gluttony:number;
    gloom:number;
    pride:number;
    envy:number;
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
        wrath:1,
        lust:1,
        sloth:1,
        gluttony:1,
        gloom:1,
        pride:1,
        envy:1,
    };
    sinCost:ISinCost={
        wrath:0,
        lust:0,
        sloth:0,
        gluttony:0,
        gloom:0,
        pride:0,
        envy:0,
    };
    sinnerColor:string = "var(--Yi-Sang-color)";
    sinnerIcon:string = "/Images/sinner-icon/Yi_Sang_Icon.webp";
    egoLevel:string = "ZAYIN";
    localSaveId:number = 1;
    skillDetails: (IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect | never)[] = [
        new OffenseSkill("Awakening", "Wrath", 1, "AWAKENING"),
        new OffenseSkill("Corrosion", "Wrath", 1, "CORROSION"),
        new PassiveSkill("Passive", "PASSIVE"),
    ];

    public constructor(init?: Partial<IEgoInfo>){
        Object.assign(this,init)
    }
}