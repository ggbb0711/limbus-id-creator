import { CardMode } from "features/cardCreator/contexts/CardModeContext"
import { migrateEgoInfo, migrateIdInfo } from "features/cardCreator/utils/save/migrateCardInfo"
import { egoInfoSlice } from "./EgoInfoSlice"
import { idInfoSlice } from "./IdInfoSlice"

export const cardSlice = (mode: CardMode) => (mode === "id" ? idInfoSlice : egoInfoSlice)

export const loadCard = (mode: CardMode, raw: unknown) =>
    mode === "id" ? idInfoSlice.actions.loadInfo(migrateIdInfo(raw)) : egoInfoSlice.actions.loadInfo(migrateEgoInfo(raw))

export const resetCard = (mode: CardMode) => cardSlice(mode).actions.resetInfo()
