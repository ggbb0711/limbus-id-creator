import { useEffect, useRef } from "react"
import { DefaultValues, useForm } from "react-hook-form"
import { useCardEditor } from "features/cardCreator/editors/CardEditorContext"
import { CardInfo } from "features/cardCreator/types/CardInfo"
import { useAppDispatch, useAppSelector } from "stores/AppStore"
import { useNumberRegister } from "./useNumberRegister"

export function useInfoForm<T extends CardInfo>() {
    const dispatch = useAppDispatch()
    const editor = useCardEditor()
    const value = useAppSelector(editor.selectInfo) as T
    const form = useForm<T>({ defaultValues: structuredClone(value) as DefaultValues<T> })
    const registerNumber = useNumberRegister(form)
    const { reset, watch } = form
    const lastDispatched = useRef<CardInfo>(value)

    useEffect(() => {
        if (value === lastDispatched.current) return
        lastDispatched.current = value
        reset(structuredClone(value) as DefaultValues<T>)
    }, [value, reset])

    useEffect(() => {
        const subscription = watch(values => {
            const info = structuredClone(values) as T
            lastDispatched.current = info
            dispatch(editor.setInfo(info))
        })
        return () => subscription.unsubscribe()
    }, [watch, dispatch, editor])

    return { ...form, registerNumber }
}
