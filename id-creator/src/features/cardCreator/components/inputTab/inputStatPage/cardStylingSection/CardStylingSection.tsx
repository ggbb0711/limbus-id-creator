import React, { ReactElement } from "react";
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import { CARD_LAYOUTS, CARD_SIZE } from "features/cardCreator/constants";
import { StatFieldsProps } from "features/cardCreator/editors/CardEditorDefinition";
import { CardInfo } from "features/cardCreator/types/CardInfo";
import "./CardStylingSection.css"

interface SizeSliderProps {
    id: string
    label: string
    range: { min: number, max: number, step: number }
    value: number
    disabled: boolean
    hint: string
    onChange: (value: number) => void
}

function SizeSlider({ id, label, range, value, disabled, hint, onChange }: SizeSliderProps): ReactElement {
    return <div className={`card-size-slider ${disabled ? "disabled" : ""}`}>
        <label className="input-label" htmlFor={id}>{label}</label>
        <output htmlFor={id}>{value}px</output>
        <input type="range" id={id} min={range.min} max={range.max} step={range.step} value={value} disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}/>
        {disabled && <p className="card-size-hint">{hint}</p>}
    </div>
}

export default function CardStylingSection({ form }: Pick<StatFieldsProps<CardInfo>, "form">): ReactElement {
    const { watch, setValue } = form
    const layout = watch("cardLayout")
    const isVertical = layout === "Vertical"

    return <AccordionSection title="Card Styling">
        <div className="input-group-container">
            <p className="input-label" id="card-layout-label">Layout:</p>
            <div className="card-layout-options" role="radiogroup" aria-labelledby="card-layout-label">
                {CARD_LAYOUTS.map(option =>
                    <label key={option} className="card-layout-option">
                        <input type="radio" name="cardLayout" value={option} checked={layout === option} onChange={() => setValue("cardLayout", option)}/>
                        <span>{option}</span>
                    </label>
                )}
            </div>
        </div>
        <SizeSlider id="cardWidth" label="Card width:" range={CARD_SIZE.width} value={watch("cardWidth")} disabled={!isVertical}
            hint="Width follows the skills in horizontal layout." onChange={(value) => setValue("cardWidth", value)}/>
        <SizeSlider id="cardHeight" label="Card height:" range={CARD_SIZE.height} value={watch("cardHeight")} disabled={isVertical}
            hint="Height follows the skills in vertical layout." onChange={(value) => setValue("cardHeight", value)}/>
    </AccordionSection>
}
