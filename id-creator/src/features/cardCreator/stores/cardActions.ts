import { CardMode } from "features/cardCreator/contexts/CardModeContext"
import { CardInfo } from "features/cardCreator/types/CardInfo"
import { ICardInfoBase } from "features/cardCreator/types/ICardInfoBase"
import { IEgoInfo } from "features/cardCreator/types/IEgoInfo"
import { IIdInfo } from "features/cardCreator/types/IIdInfo"
import { CardField } from "./createCardSlice"
import { migrateEgoInfo, migrateIdInfo } from "features/cardCreator/utils/save/migrateCardInfo"
import { egoInfoSlice } from "./EgoInfoSlice"
import { idInfoSlice } from "./IdInfoSlice"

export const cardSlice = (mode: CardMode) => (mode === "id" ? idInfoSlice : egoInfoSlice)

export const loadCard = (mode: CardMode, raw: unknown) =>
    mode === "id" ? idInfoSlice.actions.loadInfo(migrateIdInfo(raw)) : egoInfoSlice.actions.loadInfo(migrateEgoInfo(raw))

export const resetCard = (mode: CardMode) => cardSlice(mode).actions.resetInfo()

export const setCard = (mode: CardMode, info: CardInfo) =>
    mode === "id" ? idInfoSlice.actions.setInfo(info as IIdInfo) : egoInfoSlice.actions.setInfo(info as IEgoInfo)

export const updateBaseField = <K extends CardField<ICardInfoBase>>(mode: CardMode, field: K, value: ICardInfoBase[K]) =>
    mode === "id" ? idInfoSlice.actions.updateField(field, value) : egoInfoSlice.actions.updateField(field, value)
