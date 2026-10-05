import { createSlice } from "@reduxjs/toolkit"
import { appConfig } from "config/env.client"
import { createEgoInfo } from "features/cardCreator/types/IEgoInfo"
import { createCardReducers, createCardState } from "./createCardSlice"

export const egoInfoSlice = createSlice({
    name: "egoInfo",
    initialState: createCardState(createEgoInfo()),
    reducers: createCardReducers(createEgoInfo, { maxSkills: appConfig.limits.card.maxSkills }),
})

export const EgoInfoReducer = egoInfoSlice.reducer
