import { useCallback } from "react"
import { useAppDispatch } from "stores/AppStore"
import { showAlert } from "stores/slices/AlertSlice"
import { AlertStatus } from "types/IAlert"

export type AddAlert = (status: AlertStatus, msg: string) => void

export function useAddAlert(): AddAlert {
    const dispatch = useAppDispatch()
    return useCallback((status: AlertStatus, msg: string) => { dispatch(showAlert(status, msg)) }, [dispatch])
}
