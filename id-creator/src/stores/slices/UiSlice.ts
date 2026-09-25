import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
    isLoginMenuActive: boolean
    isSettingMenuActive: boolean
    settingMenuDisplayMode: "Local" | "Cloud" | "Custom keywords"
    settingMenuSaveMode: "ID" | "EGO"
}

const initialState: UiState = {
    isLoginMenuActive: false,
    isSettingMenuActive: false,
    settingMenuDisplayMode: "Local",
    settingMenuSaveMode: "ID",
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
        openSettingMenu(state) {
            state.isSettingMenuActive = true
        },
        closeSettingMenu(state) {
            state.isSettingMenuActive = false
        },
        setSettingDisplayMode(state, action: PayloadAction<"Local" | "Cloud" | "Custom keywords">) {
            state.settingMenuDisplayMode = action.payload
        },
        setSettingMenuSaveMode(state, action: PayloadAction<"ID" | "EGO">) {
            state.settingMenuSaveMode = action.payload
        },
    },
})

export const {
    openLoginMenu,
    closeLoginMenu,
    toggleLoginMenu,
    openSettingMenu,
    closeSettingMenu,
    setSettingDisplayMode,
    setSettingMenuSaveMode,
} = UiSlice.actions

export const UiReducer = UiSlice.reducer
