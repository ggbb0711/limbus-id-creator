import { useCallback } from 'react'
import { useAppDispatch } from 'stores/AppStore'
import { openLoginMenu, closeLoginMenu } from 'stores/slices/UiSlice'

export function useLoginMenu() {
    const dispatch = useAppDispatch()
    return {
        openLoginMenu: useCallback(() => { dispatch(openLoginMenu()) }, [dispatch]),
        closeLoginMenu: useCallback(() => { dispatch(closeLoginMenu()) }, [dispatch]),
    }
}
