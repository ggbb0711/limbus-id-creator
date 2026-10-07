import React, { ReactElement } from "react";
import DropDown from "components/ui/dropDown/DropDown";
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import { EGO_LEVEL_OPTIONS } from "../egoLevelDropDown/EgoLevelDropDown";
import NumberField from "features/cardCreator/components/shared/numberField/NumberField";
import SinNumberInputs from "features/cardCreator/components/shared/sinNumberInputs/SinNumberInputs";
import { getResistTier } from "features/cardCreator/utils/card/getResistTier";
import { IEgoInfo } from "features/cardCreator/types/IEgoInfo";
import { StatFieldsProps } from "features/cardCreator/editors/CardEditorDefinition";

export function EgoStatsSection({ form, registerNumber }: StatFieldsProps<IEgoInfo>): ReactElement {
    const { setValue, watch } = form
    const sinResistant = watch("sinResistant")
    const egoLevel = watch("egoLevel")

    return <AccordionSection title="Ego Stats">
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label">Ego level:</label>
                <DropDown options={EGO_LEVEL_OPTIONS} value={egoLevel} onChange={(newVal) => setValue("egoLevel", newVal)} label="Ego level"/>
            </div>
        </div>
        <div className="input-group-container">
            <NumberField<IEgoInfo> name="sanityCost" label="Sanity cost:" registerNumber={registerNumber} inputClassName="stat-page-input-border"/>
        </div>
        <p className="input-label">Sin cost:</p>
        <SinNumberInputs<IEgoInfo> field="sinCost" registerNumber={registerNumber} idSuffix="cost"/>
        <p className="input-label">Sin resistant:</p>
        <SinNumberInputs<IEgoInfo> field="sinResistant" registerNumber={registerNumber} idSuffix="resistant"
            colorFor={(key) => getResistTier(sinResistant?.[key]).color}/>
    </AccordionSection>
}
