import { createContext, useContext } from "react"

export type CardMode = "id" | "ego"

const CardModeContext = createContext<CardMode>("id")

export const useCardMode = () => useContext(CardModeContext)

export default CardModeContext
