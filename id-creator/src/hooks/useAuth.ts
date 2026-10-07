import { useAppSelector } from 'stores/AppStore'
import { useHydrated } from './useHydrated'

export function useAuth() {
    const user = useAppSelector(state => state.auth.user)
    const isInitializing = useAppSelector(state => state.auth.isInitializing)
    const isHydrated = useHydrated()
    return isHydrated ? { user, isInitializing } : { user: null, isInitializing: true }
}
