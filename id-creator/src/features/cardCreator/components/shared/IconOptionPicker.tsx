import React, { ReactElement } from "react"
import { IconOption } from "features/cardCreator/constants"

interface IconOptionPickerProps<T extends IconOption> {
    options: readonly T[]
    active: string
    onSelect: (option: T) => void
    containerClassName: string
    optionClassName: string
}

export default function IconOptionPicker<T extends IconOption>({ options, active, onSelect, containerClassName, optionClassName }: IconOptionPickerProps<T>): ReactElement {
    return <div className={containerClassName}>
        {options.map(option =>
            <img key={option.src} onClick={() => onSelect(option)} className={`${optionClassName} ${active === option.src ? "active" : ""}`} src={option.src} alt={option.alt} />
        )}
    </div>
}
