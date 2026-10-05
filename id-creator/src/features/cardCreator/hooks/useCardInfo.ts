import { CardMode, useCardMode } from "features/cardCreator/contexts/CardModeContext"
import { CardInfo } from "features/cardCreator/types/CardInfo"
import { cardSlice } from "features/cardCreator/stores/cardActions"
import { RootState, useAppSelector } from "stores/AppStore"

export const selectCard = (state: RootState, mode: CardMode): CardInfo => (mode === "id" ? state.idInfo.value : state.egoInfo.value)

export const selectCardLoadId = (state: RootState, mode: CardMode): number => (mode === "id" ? state.idInfo.loadId : state.egoInfo.loadId)

export function useCardActions() {
    return cardSlice(useCardMode()).actions
}

export function useCardSelector<R>(select: (info: CardInfo) => R, equalityFn?: (a: R, b: R) => boolean): R {
    const mode = useCardMode()
    return useAppSelector(state => select(selectCard(state, mode)), equalityFn)
}
