import uuid from "react-uuid"
import { ISkillBase } from "../../ISkillBase"

export interface IMentalEffect extends ISkillBase<"MentalEffect"> {
    effect: string
}

export const createMentalEffect = (overrides: Partial<Omit<IMentalEffect, "type">> = {}): IMentalEffect => ({
    inputId: uuid(),
    effect: "",
    ...overrides,
    type: "MentalEffect",
})
