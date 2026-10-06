import { useEffect } from "react"
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

    useEffect(() => { reset(structuredClone(value)) }, [JSON.stringify(value)])

    useEffect(() => {
        const subscription = watch(values => dispatch(editor.setInfo(structuredClone(values) as T)))
        return () => subscription.unsubscribe()
    }, [watch, dispatch, editor])

    return { ...form, registerNumber }
}
