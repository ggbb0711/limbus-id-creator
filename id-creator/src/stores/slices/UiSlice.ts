import { createSlice } from '@reduxjs/toolkit'

interface UiState {
    isLoginMenuActive: boolean
}

const initialState: UiState = {
    isLoginMenuActive: false,
}

const UiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openLoginMenu(state) {
            state.isLoginMenuActive = true
        },
        closeLoginMenu(state) {
            state.isLoginMenuActive = false
        },
        toggleLoginMenu(state) {
            state.isLoginMenuActive = !state.isLoginMenuActive
        },
    },
})

export const {
    openLoginMenu,
    closeLoginMenu,
    toggleLoginMenu,
} = UiSlice.actions

export const UiReducer = UiSlice.reducer
