import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SaveMode } from 'features/cardCreator/constants'

export type SettingMenuDisplayMode = "Local" | "Cloud" | "Custom keywords"

interface SettingMenuState {
    isSettingMenuActive: boolean
    settingMenuDisplayMode: SettingMenuDisplayMode
    settingMenuSaveMode: SaveMode
}

const initialState: SettingMenuState = {
    isSettingMenuActive: false,
    settingMenuDisplayMode: "Local",
    settingMenuSaveMode: "ID",
}

const SettingMenuSlice = createSlice({
    name: 'settingMenu',
    initialState,
    reducers: {
        openSettingMenu(state) {
            state.isSettingMenuActive = true
        },
        closeSettingMenu(state) {
            state.isSettingMenuActive = false
        },
        setSettingDisplayMode(state, action: PayloadAction<SettingMenuDisplayMode>) {
            state.settingMenuDisplayMode = action.payload
        },
        setSettingMenuSaveMode(state, action: PayloadAction<SaveMode>) {
            state.settingMenuSaveMode = action.payload
        },
    },
})

export const {
    openSettingMenu,
    closeSettingMenu,
    setSettingDisplayMode,
    setSettingMenuSaveMode,
} = SettingMenuSlice.actions

export const SettingMenuReducer = SettingMenuSlice.reducer
