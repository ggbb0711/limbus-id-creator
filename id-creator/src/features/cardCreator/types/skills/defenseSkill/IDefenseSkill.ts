import uuid from "react-uuid"
import { DefenseType } from "features/cardCreator/constants"
import { IActiveSkill, createActiveSkillDefaults } from "../activeSkill/IActiveSkill"

export interface IDefenseSkill extends IActiveSkill<"DefenseSkill"> {
    defenseType: DefenseType
    showDefenseIcon: boolean
}

export const createDefenseSkill = (overrides: Partial<Omit<IDefenseSkill, "type">> = {}): IDefenseSkill => ({
    ...createActiveSkillDefaults(),
    skillLabel: "Defense",
    defenseType: "Block",
    showDefenseIcon: true,
    inputId: uuid(),
    ...overrides,
    type: "DefenseSkill",
})
