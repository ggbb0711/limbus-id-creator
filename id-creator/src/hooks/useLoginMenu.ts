import { useAppDispatch, useAppSelector } from 'stores/AppStore'
import { openLoginMenu, closeLoginMenu } from 'stores/slices/UiSlice'

export function useLoginMenu() {
    const isLoginMenuActive = useAppSelector(state => state.ui.isLoginMenuActive)
    const dispatch = useAppDispatch()
    return {
        isLoginMenuActive,
        setIsLoginMenuActive: (v: boolean) => dispatch(v ? openLoginMenu() : closeLoginMenu()),
    }
}
