import { createSlice } from "@reduxjs/toolkit"
import { appConfig } from "config/env.client"
import { createIdInfo } from "features/cardCreator/types/IIdInfo"
import { createCardReducers, createCardState } from "./createCardSlice"

export const idInfoSlice = createSlice({
    name: "idInfo",
    initialState: createCardState(createIdInfo()),
    reducers: createCardReducers(createIdInfo, { maxSkills: appConfig.limits.card.maxSkills }),
})

export const IdInfoReducer = idInfoSlice.reducer
