import { useAppSelector } from 'Stores/AppStore'

export function useAuth() {
    const accessToken = useAppSelector(state => state.auth.accessToken)
    const user = useAppSelector(state => state.auth.user)
    const isInitializing = useAppSelector(state => state.auth.isInitializing)
    return { accessToken, user, isLoggedIn: !!user, isInitializing }
}
