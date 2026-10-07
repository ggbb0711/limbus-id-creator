import uuid from "react-uuid"
import { IActiveSkill, createActiveSkillDefaults } from "../activeSkill/IActiveSkill"

export type IOffenseSkill = IActiveSkill<"OffenseSkill">

export const createOffenseSkill = (overrides: Partial<Omit<IOffenseSkill, "type">> = {}): IOffenseSkill => ({
    ...createActiveSkillDefaults(),
    inputId: uuid(),
    ...overrides,
    type: "OffenseSkill",
})
