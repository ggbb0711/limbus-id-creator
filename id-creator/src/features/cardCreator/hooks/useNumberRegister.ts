import { FocusEvent, useCallback } from "react"
import { FieldValues, Path, PathValue, UseFormRegisterReturn, UseFormReturn } from "react-hook-form"

export type RegisterNumber<T extends FieldValues> = (name: Path<T>) => UseFormRegisterReturn

export function useNumberRegister<T extends FieldValues>({ register, setValue }: Pick<UseFormReturn<T>, "register" | "setValue">): RegisterNumber<T> {
    return useCallback((name: Path<T>) => {
        const registration = register(name, { valueAsNumber: true })
        return {
            ...registration,
            onBlur: async (event: FocusEvent<HTMLInputElement>) => {
                await registration.onBlur(event)
                if (event.target.value === "" || Number.isNaN(event.target.valueAsNumber)) setValue(name, 0 as PathValue<T, Path<T>>)
            },
        }
    }, [register, setValue])
}
