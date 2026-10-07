import { useCallback } from "react"
import { FieldValues, Path, PathValue, UseFormRegisterReturn, UseFormReturn } from "react-hook-form"

export type RegisterNumber<T extends FieldValues> = (name: Path<T>) => UseFormRegisterReturn

export function useNumberRegister<T extends FieldValues>({ register, setValue }: Pick<UseFormReturn<T>, "register" | "setValue">): RegisterNumber<T> {
    return useCallback((name: Path<T>) => {
        const registration = register(name, { valueAsNumber: true })
        return {
            ...registration,
            onBlur: async event => {
                await registration.onBlur(event)
                const target = event.target as HTMLInputElement
                if (target.value === "" || Number.isNaN(target.valueAsNumber)) setValue(name, 0 as PathValue<T, Path<T>>)
            },
        }
    }, [register, setValue])
}
