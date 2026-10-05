import { ICustomEffect } from "./skills/customEffect/ICustomEffect"
import { IDefenseSkill } from "./skills/defenseSkill/IDefenseSkill"
import { IMentalEffect } from "./skills/mentalEffect/IMentalEffect"
import { IOffenseSkill } from "./skills/offenseSkill/IOffenseSkill"
import { IPassiveSkill } from "./skills/passiveSkill/IPassiveSkill"
import { SkillType } from "./SkillTypes"

export type SkillDetail = IOffenseSkill | IDefenseSkill | IPassiveSkill | ICustomEffect | IMentalEffect

export type SkillOfType<T extends SkillType> = Extract<SkillDetail, { type: T }>

export const isSkillType = <T extends SkillType>(type: T) =>
    (skill: SkillDetail): skill is SkillOfType<T> => skill.type === type

export const isActiveSkill = (skill: SkillDetail): skill is IOffenseSkill | IDefenseSkill =>
    skill.type === "OffenseSkill" || skill.type === "DefenseSkill"
