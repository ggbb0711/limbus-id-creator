import { SkillType } from "features/cardCreator/types/SkillTypes"

export enum MoveDirection {
    Up = -1,
    Down = 1,
}

export interface SkillActionsProps {
    type: SkillType
    canMoveUp: boolean
    canMoveDown: boolean
    onChangeType: (type: SkillType) => void
    onMove: (direction: MoveDirection) => void
    onDelete: () => void
}
