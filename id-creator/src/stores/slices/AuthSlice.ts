import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserSessionProfileDTO } from 'types/auth/IAuthResponse'

interface AuthState {
    accessToken: string | null,
    user: UserSessionProfileDTO | null,
    isInitializing: boolean
}

const initialState: AuthState = { accessToken: null, user: null, isInitializing: true }

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ accessToken: string, user: UserSessionProfileDTO }>) => {
            state.accessToken = action.payload.accessToken
            state.user = action.payload.user
            state.isInitializing = false
        },
        updateSessionUser: (state, action: PayloadAction<Partial<Pick<UserSessionProfileDTO, "userName" | "userIcon">>>) => {
            if (state.user) Object.assign(state.user, action.payload)
        },
        clearCredentials: (state) => {
            state.accessToken = null
            state.user = null
            state.isInitializing = false
        },
    }
})

export const { setCredentials, updateSessionUser, clearCredentials } = AuthSlice.actions
export const AuthReducer = AuthSlice.reducer
