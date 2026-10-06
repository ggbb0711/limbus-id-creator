import { useAppSelector } from 'stores/AppStore'

export function useAuth() {
    const user = useAppSelector(state => state.auth.user)
    const isInitializing = useAppSelector(state => state.auth.isInitializing)
    return { user, isInitializing }
}
