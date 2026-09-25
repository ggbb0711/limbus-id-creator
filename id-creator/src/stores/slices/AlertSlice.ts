import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import uuid from 'react-uuid';
import { IAlert } from 'types/utils/IAlert'

const initialState : {value: IAlert[]} = {value: []}; 

const AlertSlice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        addAlertReducer: {
            reducer: (state, action: PayloadAction<IAlert>) => {
                state.value.push(action.payload);
            },
            prepare: (status: string, msg: string) => {
                return { payload: { status, msg, alertId: uuid() } };
            }
        },
        removeAlertReducer: (state, actionPayload: PayloadAction<string>) =>{
            state.value = state.value.filter(alert => alert.alertId !== actionPayload.payload);
        }
    }
})

export const { addAlertReducer, removeAlertReducer } = AlertSlice.actions;
export const AlertReducer = AlertSlice.reducer;