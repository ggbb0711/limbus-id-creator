import uuid from "react-uuid"
import { PassiveRequirement, SinAffinity, SinRecord, createSinRecord } from "features/cardCreator/constants"
import { ISkillBase } from "../../ISkillBase"

export interface IPassiveSkill extends ISkillBase<"PassiveSkill"> {
    name: string
    skillEffect: string
    affinity: SinAffinity
    req: PassiveRequirement
    reqNo: number
    skillLabel: string
    reqOwn: SinRecord
    reqRes: SinRecord
}

export const createPassiveSkill = (overrides: Partial<Omit<IPassiveSkill, "type">> = {}): IPassiveSkill => ({
    inputId: uuid(),
    name: "",
    skillEffect: "",
    affinity: "Wrath",
    req: "Own",
    reqNo: 1,
    skillLabel: "PASSIVE",
    reqOwn: createSinRecord(0),
    reqRes: createSinRecord(0),
    ...overrides,
    type: "PassiveSkill",
})
