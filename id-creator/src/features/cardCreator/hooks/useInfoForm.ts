import { useEffect } from "react"
import { DefaultValues, useForm } from "react-hook-form"
import { useCardMode } from "features/cardCreator/contexts/CardModeContext"
import { setCard } from "features/cardCreator/stores/cardActions"
import { CardInfo } from "features/cardCreator/types/CardInfo"
import { useAppDispatch, useAppSelector } from "stores/AppStore"
import { selectCard } from "./useCardInfo"
import { useNumberRegister } from "./useNumberRegister"

export function useInfoForm<T extends CardInfo>() {
    const dispatch = useAppDispatch()
    const mode = useCardMode()
    const value = useAppSelector(state => selectCard(state, mode)) as T
    const form = useForm<T>({ defaultValues: structuredClone(value) as DefaultValues<T> })
    const registerNumber = useNumberRegister(form)
    const { reset, watch } = form

    useEffect(() => { reset(structuredClone(value)) }, [JSON.stringify(value)])

    useEffect(() => {
        const subscription = watch(values => dispatch(setCard(mode, structuredClone(values) as T)))
        return () => subscription.unsubscribe()
    }, [watch, dispatch, mode])

    return { ...form, registerNumber }
}
