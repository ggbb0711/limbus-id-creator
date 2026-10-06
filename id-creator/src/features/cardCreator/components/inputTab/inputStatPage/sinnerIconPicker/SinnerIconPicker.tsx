import React, { ReactElement } from "react";
import "./SinnerIconInput.css"
import "./SinnerEgoIconInput.css"
import { SINNERS } from "features/cardCreator/constants";
import { useCardEditor } from "features/cardCreator/editors/CardEditorContext";
import { useCardSelector } from "features/cardCreator/hooks/useCardInfo";
import IconOptionPicker from "features/cardCreator/components/shared/iconOptionPicker/IconOptionPicker";
import { useAppDispatch } from "stores/AppStore";

export default function SinnerIconPicker(): ReactElement {
    const editor = useCardEditor()
    const currentIcon = useCardSelector(info => info.sinnerIcon)
    const dispatch = useAppDispatch()
    const prefix = editor.iconPickerClass

    return <IconOptionPicker options={SINNERS} active={currentIcon} containerClassName={`${prefix}-container`} optionClassName={prefix}
        onSelect={(sinner) => {
            dispatch(editor.updateBaseField("sinnerColor", sinner.color))
            dispatch(editor.updateBaseField("sinnerIcon", sinner.src))
        }}/>
}
