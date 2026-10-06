import React, { ReactElement } from "react";
import "./SinnerIconInput.css"
import "./SinnerEgoIconInput.css"
import { SINNERS } from "features/cardCreator/constants";
import { useCardMode } from "features/cardCreator/contexts/CardModeContext";
import { useCardSelector } from "features/cardCreator/hooks/useCardInfo";
import { updateBaseField } from "features/cardCreator/stores/cardActions";
import IconOptionPicker from "features/cardCreator/components/shared/iconOptionPicker/IconOptionPicker";
import { useAppDispatch } from "stores/AppStore";

const CLASS_PREFIX = { id: "sinner-icon", ego: "sinner-ego-icon" } as const

export default function SinnerIconPicker(): ReactElement {
    const mode = useCardMode()
    const currentIcon = useCardSelector(info => info.sinnerIcon)
    const dispatch = useAppDispatch()
    const prefix = CLASS_PREFIX[mode]

    return <IconOptionPicker options={SINNERS} active={currentIcon} containerClassName={`${prefix}-container`} optionClassName={prefix}
        onSelect={(sinner) => {
            dispatch(updateBaseField(mode, "sinnerColor", sinner.color))
            dispatch(updateBaseField(mode, "sinnerIcon", sinner.src))
        }}/>
}
