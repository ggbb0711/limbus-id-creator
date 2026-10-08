import React, { ReactElement, useState } from "react";
import "./IdStatFields.css"
import { appConfig } from "config/env.client";
import { canAddTag } from "utils/canAddTag";
import AddIcon from "assets/icons/AddIcon";
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import TraitInput from "./TraitInput";
import SinnerRarityIconInput from "../sinnerRarityInput/SinnerRarityInput";
import NumberField from "features/cardCreator/components/shared/NumberField";
import { DAMAGE_TYPES, DamageType } from "features/cardCreator/constants";
import { getResistTier } from "features/cardCreator/utils/card/getResistTier";
import { IIdInfo } from "features/cardCreator/types/IIdInfo";
import { StatFieldsProps } from "features/cardCreator/editors/CardEditorDefinition";

const resistField = (damageType: DamageType) => `${damageType.toLowerCase()}Resistant` as "slashResistant" | "pierceResistant" | "bluntResistant"

const StatLabel = ({ icon, alt, text }: { icon: string, alt: string, text: string }) =>
    <><img className="stat-icon" src={icon} alt={alt} /> <span>{text}</span></>

export function IdGeneralFields({ form }: StatFieldsProps<IIdInfo>): ReactElement {
    const { setValue, watch } = form
    const traits = watch("traits") ?? []
    const [traitInput, setTraitInput] = useState("")
    const maxTraits = appConfig.limits.card.maxTraits

    function handleAddTrait() {
        const trimmed = traitInput.trim()
        if (canAddTag(traits, trimmed, maxTraits)) {
            setValue("traits", [...traits, trimmed])
            setTraitInput("")
        }
    }

    return <>
        <div>
            <p>Pick the sinner rarity: </p>
            <SinnerRarityIconInput/>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label className="input-label" htmlFor="traits">Traits: ({traits.length}/{maxTraits})</label>
                <div className="trait-input-row">
                    <TraitInput
                        value={traits}
                        onChange={(newTags) => setValue("traits", newTags)}
                        maxTags={maxTraits}
                        inputValue={traitInput}
                        onChangeInput={setTraitInput}
                        inputProps={{ placeholder: "Add trait...", id: "traits" }}
                        className="input stat-page-input-border trait-input"
                        tagClassName="trait-tab"
                    />
                    <button type="button" className="main-button trait-add-btn" onClick={handleAddTrait} disabled={traits.length >= maxTraits} aria-label="Add trait">
                        <AddIcon/>
                    </button>
                </div>
            </div>
        </div>
    </>
}

export function IdStatsSection({ form, registerNumber }: StatFieldsProps<IIdInfo>): ReactElement {
    const { register, watch } = form
    return <AccordionSection title="Sinner Stats">
        <div className="input-group-container">
            <NumberField<IIdInfo> name="minSpeed" registerNumber={registerNumber} inputClassName="stat-page-input-border"
                label={<StatLabel icon="/Images/stat/stat_speed.webp" alt="speed_icon" text="Speed from"/>}/>
            <NumberField<IIdInfo> name="maxSpeed" registerNumber={registerNumber} inputClassName="stat-page-input-border"
                label={<StatLabel icon="/Images/stat/stat_speed.webp" alt="speed_icon" text="Speed to"/>}/>
        </div>
        <div className="input-group-container">
            <NumberField<IIdInfo> name="hp" registerNumber={registerNumber} inputClassName="stat-page-input-border"
                label={<StatLabel icon="/Images/stat/stat_hp.webp" alt="hp_icon" text="Health"/>}/>
        </div>
        <div className="input-group-container">
            <NumberField<IIdInfo> name="defenseLevel" registerNumber={registerNumber} inputClassName="stat-page-input-border"
                label={<StatLabel icon="/Images/stat/stat_def.webp" alt="def_icon" text="Defense"/>}/>
        </div>
        <div className="input-group-container">
            <div className="input-container">
                <label htmlFor="staggerResist" className="input-label">Stagger Threshold:</label>
                <input type="text" className="input stat-page-input-border" id="staggerResist" {...register("staggerResist")}/>
            </div>
        </div>
        {DAMAGE_TYPES.map(damageType => {
            const field = resistField(damageType)
            const tier = getResistTier(watch(field))
            return <div className="input-group-container" key={damageType}>
                <NumberField<IIdInfo> name={field} registerNumber={registerNumber} inputClassName="stat-page-input-border" style={{ color: tier.color }}
                    label={<>
                        <img className="stat-icon" src={`/Images/attack/attackt_${damageType}.webp`} alt={`attackt_${damageType.toLowerCase()}`} />
                        <span>{damageType} resist (<span style={{ color: tier.color }}>{tier.label}</span>):</span>
                    </>}/>
            </div>
        })}
    </AccordionSection>
}
