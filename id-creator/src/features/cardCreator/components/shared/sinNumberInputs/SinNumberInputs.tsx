import React, { Fragment, ReactElement, ReactNode } from "react"
import { FieldValues, Path } from "react-hook-form"
import { SIN_AFFINITIES, Sin, SinKey, SinRecord, toSinKey } from "features/cardCreator/constants"
import { RegisterNumber } from "features/cardCreator/hooks/useNumberRegister"
import { assetPaths } from "features/cardCreator/utils/card/assetPaths"

export type SinRecordField<T> = { [K in keyof T]: T[K] extends SinRecord ? K : never }[keyof T] & string

interface SinNumberInputsProps<T extends FieldValues> {
    field: SinRecordField<T>
    registerNumber: RegisterNumber<T>
    idSuffix: string
    containerClassName?: string
    colorFor?: (key: SinKey) => string | undefined
}

export default function SinNumberInputs<T extends FieldValues>({ field, registerNumber, idSuffix, containerClassName = "", colorFor }: SinNumberInputsProps<T>): ReactElement {
    return <div className="input-group-container">
        {SIN_AFFINITIES.map(sin => {
            const key = toSinKey(sin)
            const id = `${key}_${idSuffix}`
            return <div key={key} className={`input-container ${containerClassName}`}>
                <label htmlFor={id}><img className="stat-icon" src={assetPaths.affinityBig(sin)} alt={`${sin}-input-icon`} /></label>
                <div className="resistant-content">
                    <input type="number" id={id} className="input stat-page-input-border input-number"
                        style={colorFor ? { color: colorFor(key) } : undefined}
                        {...registerNumber(`${field}.${key}` as Path<T>)}/>
                </div>
            </div>
        })}
    </div>
}

export function SinValueList({ values, render }: { values: SinRecord, render: (sin: Sin, value: number) => ReactNode }): ReactElement {
    return <>{SIN_AFFINITIES.map(sin => <Fragment key={sin}>{render(sin, values[toSinKey(sin)])}</Fragment>)}</>
}
