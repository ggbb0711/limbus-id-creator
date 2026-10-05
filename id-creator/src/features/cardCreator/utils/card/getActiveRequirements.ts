import { SIN_KEYS, SinKey, SinRecord } from "features/cardCreator/constants"

export interface ActiveRequirement {
    key: SinKey
    amount: number
    iconName: string
}

export function getActiveRequirements(requirements: SinRecord): ActiveRequirement[] {
    return SIN_KEYS
        .filter(key => requirements[key] >= 1)
        .map(key => ({ key, amount: requirements[key], iconName: key[0].toUpperCase() + key.slice(1) }))
}
