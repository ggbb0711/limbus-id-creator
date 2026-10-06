import { CardInfo } from "features/cardCreator/types/CardInfo"
import { useCardEditor } from "features/cardCreator/editors/CardEditorContext"
import { useAppSelector } from "stores/AppStore"

export function useCardActions() {
    return useCardEditor().skillActions
}

export function useCardSelector<R>(select: (info: CardInfo) => R, equalityFn?: (a: R, b: R) => boolean): R {
    const editor = useCardEditor()
    return useAppSelector(state => select(editor.selectInfo(state)), equalityFn)
}
