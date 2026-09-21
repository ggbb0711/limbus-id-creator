import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserSessionProfileDTO } from 'Types/API/Auth/IAuthResponse'

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
        clearCredentials: (state) => {
            state.accessToken = null
            state.user = null
            state.isInitializing = false
        },
    }
})

export const { setCredentials, clearCredentials } = AuthSlice.actions
export const AuthReducer = AuthSlice.reducer
