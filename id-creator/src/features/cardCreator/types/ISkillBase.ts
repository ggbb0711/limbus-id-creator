import { SkillType } from "./SkillTypes"

export interface ISkillBase<T extends SkillType = SkillType> {
    readonly type: T
    inputId: string
}
