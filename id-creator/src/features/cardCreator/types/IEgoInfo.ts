import { EgoLevel, SinRecord, createSinRecord } from "features/cardCreator/constants"
import { ICardInfoBase, createCardInfoBaseDefaults } from "./ICardInfoBase"
import { createOffenseSkill } from "./skills/offenseSkill/IOffenseSkill"
import { createPassiveSkill } from "./skills/passiveSkill/IPassiveSkill"

export interface IEgoInfo extends ICardInfoBase {
    sanityCost: number
    sinResistant: SinRecord
    sinCost: SinRecord
    egoLevel: EgoLevel
}

export const createEgoInfo = (overrides: Partial<IEgoInfo> = {}): IEgoInfo => ({
    ...createCardInfoBaseDefaults(),
    sanityCost: 0,
    sinResistant: createSinRecord(1),
    sinCost: createSinRecord(0),
    egoLevel: "ZAYIN",
    skillDetails: [
        createOffenseSkill({ name: "Awakening", skillAffinity: "Wrath", skillAmt: 1, skillLabel: "AWAKENING" }),
        createOffenseSkill({ name: "Corrosion", skillAffinity: "Wrath", skillAmt: 1, skillLabel: "CORROSION" }),
        createPassiveSkill({ name: "Passive", skillLabel: "PASSIVE" }),
    ],
    ...overrides,
})
