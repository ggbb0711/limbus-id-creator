import uuid from "react-uuid"
import { ISkillBase } from "../../ISkillBase"

export interface ICustomEffect extends ISkillBase<"CustomEffect"> {
    name: string
    customImg: string
    effectColor: string
    effect: string
    isCoinType: boolean
}

export const createCustomEffect = (overrides: Partial<Omit<ICustomEffect, "type">> = {}): ICustomEffect => ({
    inputId: uuid(),
    name: "",
    customImg: "",
    effectColor: "#F1F1F1",
    effect: "",
    isCoinType: false,
    ...overrides,
    type: "CustomEffect",
})
