import { ICardInfoBase, createCardInfoBaseDefaults } from "./ICardInfoBase"
import { createDefenseSkill } from "./skills/defenseSkill/IDefenseSkill"
import { createOffenseSkill } from "./skills/offenseSkill/IOffenseSkill"
import { createPassiveSkill } from "./skills/passiveSkill/IPassiveSkill"

export interface IIdInfo extends ICardInfoBase {
    traits: string[]
    hp: number
    minSpeed: number
    maxSpeed: number
    staggerResist: string
    defenseLevel: number
    slashResistant: number
    pierceResistant: number
    bluntResistant: number
    rarity: string
}

export const createIdInfo = (overrides: Partial<IIdInfo> = {}): IIdInfo => ({
    ...createCardInfoBaseDefaults(),
    traits: [],
    hp: 0,
    minSpeed: 0,
    maxSpeed: 0,
    staggerResist: "",
    defenseLevel: 0,
    slashResistant: 1,
    pierceResistant: 1,
    bluntResistant: 1,
    rarity: "/Images/rarity/IDNumber1.webp",
    skillDetails: [
        createOffenseSkill({ name: "Skill 1", skillAffinity: "Wrath", skillAmt: 3, skillLabel: "SKILL 1" }),
        createOffenseSkill({ name: "Skill 2", skillAffinity: "Gluttony", skillAmt: 2, skillLabel: "SKILL 2" }),
        createOffenseSkill({ name: "Skill 3", skillAffinity: "Pride", skillAmt: 1, skillLabel: "SKILL 3" }),
        createDefenseSkill({ name: "Defense" }),
        createPassiveSkill({ name: "Passive" }),
        createPassiveSkill({ name: "Support", skillLabel: "SUPPORT" }),
    ],
    ...overrides,
})
