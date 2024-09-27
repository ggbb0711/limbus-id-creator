import { ICustomEffect } from "./CustomEffect/ICustomEffect";
import { DefenseSkill, IDefenseSkill } from "./DefenseSkill/IDefenseSkill";
import { IMentalEffect, MentalEffect } from "./MentalEffect/IMentalEffect";
import { IOffenseSkill, OffenseSkill } from "./OffenseSkill/IOffenseSkill";
import { IPassiveSkill, PassiveSkill } from "./PassiveSkill/IPassiveSkill";

interface ISplashArtTranslation{
    x:number,
    y:number,
}

export interface IIdInfo{
    title:string,
    name:string,
    splashArt:string,
    splashArtScale:number,
    splashArtTranslation:ISplashArtTranslation,
    hp:number,
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

export class IdInfo implements IIdInfo{
    title:string = "";
    name:string ="";
    splashArt:string ="";
    splashArtScale:number=1;
    splashArtTranslation:ISplashArtTranslation={
        x:0,
        y:0
    };
    hp:number=0;
    minSpeed:number=0;
    maxSpeed:number=0;
    staggerResist:string ="";
    defenseLevel:number=0;
    slashResistant:number=1;
    pierceResistant:number=1;
    bluntResistant:number=1;
    sinnerColor: string = "var(--Yi-Sang-color)";
    sinnerIcon: string = "Images/sinner-icon/Yi_Sang_Icon.png";
    rarity: string = "Images/rarity/IDNumber1.png";
    skillDetails: (IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect | never)[] = [
        new OffenseSkill("Skill 1", "Wrath", 3, "SKILL 1"),
        new OffenseSkill("Skill 2", "Gluttony", 2, "SKILL 2"),
        new OffenseSkill("Skill 3", "Pride", 1, "SKILL 3"),
        new DefenseSkill("Defense"),
        new PassiveSkill("Passive"),
        new PassiveSkill("Support", "SUPPORT"),
    ];

    public constructor(init?: Partial<IIdInfo>){
        console.log(this)
        Object.assign(this,init)
    }
}