import { DamageType, SinAffinity, SkillFrame } from "features/cardCreator/constants"
import { ISkillBase } from "../../ISkillBase"

export type ActiveSkillType = "OffenseSkill" | "DefenseSkill"

export interface IActiveSkill<T extends ActiveSkillType = ActiveSkillType> extends ISkillBase<T> {
    name: string
    skillAffinity: SinAffinity
    basePower: number
    coinNo: number
    coinPow: number
    skillImage: string
    skillEffect: string
    skillLabel: string
    skillFrame: SkillFrame
    skillLevel: number
    skillAmt: number
    atkWeight: number
    damageType: DamageType
}

export type ActiveSkillDefaults = Omit<IActiveSkill, "type" | "inputId">

export const createActiveSkillDefaults = (): ActiveSkillDefaults => ({
    name: "",
    skillAffinity: "Wrath",
    basePower: 0,
    coinNo: 1,
    coinPow: 0,
    skillImage: "",
    skillEffect: "",
    skillLabel: "SKILL",
    skillFrame: "1",
    skillLevel: 0,
    skillAmt: 1,
    atkWeight: 1,
    damageType: "Slash",
})
