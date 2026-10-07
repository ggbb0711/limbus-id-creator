import { Dispatch, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { appConfig } from 'config/env.client'
import { AlertStatus, IAlert } from 'types/IAlert'

const initialState: { value: IAlert[] } = { value: [] }

const AlertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        addAlertReducer: {
            reducer: (state, action: PayloadAction<IAlert>) => {
                state.value.push(action.payload)
            },
            prepare: (status: AlertStatus, msg: string) => {
                return { payload: { status, msg, alertId: nanoid() } }
            }
        },
        removeAlertReducer: (state, action: PayloadAction<string>) => {
            state.value = state.value.filter(alert => alert.alertId !== action.payload)
        }
    }
})

export const { addAlertReducer, removeAlertReducer } = AlertSlice.actions
export const AlertReducer = AlertSlice.reducer

export const showAlert = (status: AlertStatus, msg: string) => (dispatch: Dispatch) => {
    const { alertId } = dispatch(addAlertReducer(status, msg)).payload
    setTimeout(() => dispatch(removeAlertReducer(alertId)), appConfig.timing.alertMs)
}
