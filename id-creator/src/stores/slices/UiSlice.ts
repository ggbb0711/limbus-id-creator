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
    },
})

export const {
    openLoginMenu,
    closeLoginMenu,
} = UiSlice.actions

export const UiReducer = UiSlice.reducer
