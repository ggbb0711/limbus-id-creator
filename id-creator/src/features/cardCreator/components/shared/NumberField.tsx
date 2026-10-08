import React, { CSSProperties, ReactElement, ReactNode } from "react"
import { FieldErrors, FieldValues, Path, get } from "react-hook-form"
import { RegisterNumber } from "features/cardCreator/hooks/useNumberRegister"

interface NumberFieldProps<T extends FieldValues> {
    name: Path<T>
    label: ReactNode
    registerNumber: RegisterNumber<T>
    idSuffix?: string
    errors?: FieldErrors<T>
    inputClassName?: string
    style?: CSSProperties
}

export default function NumberField<T extends FieldValues>({ name, label, registerNumber, idSuffix, errors, inputClassName = "block", style }: NumberFieldProps<T>): ReactElement {
    const id = idSuffix ? `${name}_${idSuffix}` : name
    const message: unknown = errors ? get(errors, name)?.message : undefined
    return <div className="input-container">
        <label className="input-label" htmlFor={id}>{label}</label>
        <input className={`input ${inputClassName} ${message ? "input-error" : ""}`} style={style} type="number" id={id} {...registerNumber(name)}/>
        {message ? <p className="input-error-msg">{String(message)}</p> : null}
    </div>
}
