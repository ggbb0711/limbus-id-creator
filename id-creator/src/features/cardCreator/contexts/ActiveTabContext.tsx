'use client'
import { Dispatch, SetStateAction, createContext, useContext } from "react"

export const ActiveTabContext = createContext<Dispatch<SetStateAction<number>>>(() => {})

export function useSetActiveTab(): Dispatch<SetStateAction<number>> {
    return useContext(ActiveTabContext)
}
