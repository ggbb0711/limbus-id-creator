import { createContext, useContext } from "react"
import type { CardEditorDefinition } from "./CardEditorDefinition"

const CardEditorContext = createContext<CardEditorDefinition | null>(null)

export function useCardEditor(): CardEditorDefinition {
    const editor = useContext(CardEditorContext)
    if (!editor) throw new Error("useCardEditor must be used inside a CardEditorContext provider")
    return editor
}

export default CardEditorContext
