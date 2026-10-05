import { createContext, useContext } from "react"
import { SaveMode } from "features/cardCreator/constants"

export type CardMode = "id" | "ego"

const CardModeContext = createContext<CardMode>("id")

export const useCardMode = () => useContext(CardModeContext)

export const toSaveMode = (mode: CardMode): SaveMode => (mode === "id" ? "ID" : "EGO")

export const toCardMode = (mode: SaveMode): CardMode => (mode === "ID" ? "id" : "ego")

export default CardModeContext
