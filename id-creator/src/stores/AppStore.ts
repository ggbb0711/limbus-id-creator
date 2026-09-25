import { configureStore } from '@reduxjs/toolkit'
import { AlertReducer } from './slices/AlertSlice'
import { UiReducer } from './slices/UiSlice'
import { AuthReducer } from './slices/AuthSlice'
import { IdInfoReducer } from 'features/cardCreator/stores/IdInfoSlice'
import { EgoInfoReducer } from 'features/cardCreator/stores/EgoInfoSlice'
import { useDispatch, useSelector } from 'react-redux'
import { BaseApi } from 'api/BaseApi'

export const makeStore = () => configureStore({
    reducer: {
        alert: AlertReducer,
        ui: UiReducer,
        auth: AuthReducer,
        idInfo: IdInfoReducer,
        egoInfo: EgoInfoReducer,
        [BaseApi.reducerPath]: BaseApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(BaseApi.middleware),
})

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
