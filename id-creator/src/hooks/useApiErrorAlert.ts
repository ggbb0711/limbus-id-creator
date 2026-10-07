import { useEffect } from "react"
import getApiErrorMessage from "api/getApiErrorMessage"
import { useAddAlert } from "./useAddAlert"

export function useApiErrorAlert(error: unknown, fallback?: string) {
    const addAlert = useAddAlert()
    useEffect(() => {
        if (error) addAlert("Failure", getApiErrorMessage(error, fallback))
    }, [error, addAlert, fallback])
}
