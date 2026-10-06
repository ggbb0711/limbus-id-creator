import { canAddTag } from "utils/canAddTag";
import { getResistTier } from "features/cardCreator/utils/card/getResistTier";
import { appConfig } from "config/env.client";
import React, { useState } from "react";
import { ReactElement } from "react";
import "../../InputPage.css"
import "../InputStatPage.css"
import "./InputIdInfoStatPage.css"
import TraitInput from "./TraitInput"
import AddIcon from "assets/icons/AddIcon"
import DeleteIcon from "assets/icons/DeleteIcon";
import ArrowDownIcon from "assets/icons/ArrowDownIcon";
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import SinnerIconPicker from "../sinnerIconPicker/SinnerIconPicker";
import SinnerRarityIconInput from "../sinnerRarityInput/SinnerRarityInput";
import SinnerSplashArtRepositionInput from "../sinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import ImageUploadField from "features/cardCreator/components/shared/imageUploadField/ImageUploadField";
import NumberField from "features/cardCreator/components/shared/numberField/NumberField";
import { DAMAGE_TYPES, DamageType } from "features/cardCreator/constants";
import { IIdInfo } from "features/cardCreator/types/IIdInfo";
import { useInfoForm } from "features/cardCreator/hooks/useInfoForm";
import ColorPicker from "features/cardCreator/components/colorPicker/ColorPicker";
import { STAT_PAGE_COLOR_GROUPS } from "features/cardCreator/components/colorPicker/ColorPresets";
import IconButton from "components/ui/iconButton/IconButton";

const resistField = (damageType: DamageType) => `${damageType.toLowerCase()}Resistant` as "slashResistant" | "pierceResistant" | "bluntResistant"

const StatLabel = ({ icon, alt, text }: { icon: string, alt: string, text: string }) =>
    <><img className="stat-icon" src={icon} alt={alt} /> <span>{text}</span></>

export default function InputIdInfoStatPage({ collapsePage }: { collapsePage: () => void }): ReactElement {
    const { register, setValue, watch, registerNumber } = useInfoForm<IIdInfo>()

    const traits = watch("traits") ?? []
    const [traitInput, setTraitInput] = useState("")

    function handleAddTrait() {
        const trimmed = traitInput.trim()
        if (canAddTag(traits, trimmed, appConfig.limits.card.maxTraits)) {
            setValue("traits", [...traits, trimmed])
            setTraitInput("")
        }
    }

    const splashArt = watch("splashArt")
    const sinnerColor = watch("sinnerColor")
    const splashArtScale = watch("splashArtScale")
    const splashArtTranslation = watch("splashArtTranslation")

    return <div className="input-page input-stat-page">
        <div className="input-page-icon-container">
            <IconButton className="collasp-icon" label="Collapse the input page" onClick={collapsePage}>
                <ArrowDownIcon/>
            </IconButton>
        </div>
        <AccordionSection title="Sinner General Info">
            <div className="sinner-icon-input-container">
                <p>Pick the sinner icon: </p>
                <SinnerIconPicker/>
                <ImageUploadField id="sinner-icon-image-input" buttonText="Upload sinner icon" maxSize={appConfig.limits.upload.idSinnerIcon}
                    onChange={(url) => setValue("sinnerIcon", url)}/>
            </div>
            <div className="sinner-color-input-container">
                <p>Pick a color for your sinner: </p>
                <ColorPicker presets={STAT_PAGE_COLOR_GROUPS} className="sinner-color-input" id="sinnerColor" value={sinnerColor} onChange={(color) => setValue("sinnerColor", color)}/>
            </div>
            {splashArt &&
                <>
                    <div className="input-group-container">
                        <p>Control the position of the splash art by dragging and zooming on this circle:</p>
                        <SinnerSplashArtRepositionInput scale={splashArtScale} translation={splashArtTranslation} onChange={(value) => {
                            setValue("splashArtScale", value.scale)
                            setValue("splashArtTranslation", value.translation)
                        }}/>
                    </div>
                    <div className="input-group-container">
                        <button onClick={() => setValue("splashArt", "")} className="main-button">
                            <p className="center-element delete-txt"><DeleteIcon/> Delete splash art</p>
                        </button>
                    </div>
                </>}
            <ImageUploadField id="splash-art-image-input" buttonText="Upload splash art" maxSize={appConfig.limits.upload.idSplashArt}
                onChange={(url) => setValue("splashArt", url)}/>
            <div>
                <p>Pick the sinner rarity: </p>
                <SinnerRarityIconInput/>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="title">Title: </label>
                    <input type="text" className="input stat-page-input-border block" id="title" {...register("title")}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="name">Name: </label>
                    <input type="text" className="input stat-page-input-border" id="name" {...register("name")}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor="traits">Traits: ({traits.length}/{appConfig.limits.card.maxTraits})</label>
                    <div className="trait-input-row">
                        <TraitInput
                            value={traits}
                            onChange={(newTags) => setValue("traits", newTags)}
                            maxTags={appConfig.limits.card.maxTraits}
                            inputValue={traitInput}
                            onChangeInput={setTraitInput}
                            inputProps={{ placeholder: "Add trait...", id: "traits" }}
                            className="input stat-page-input-border trait-input"
                            tagClassName="trait-tab"
                        />
                        <button
                            type="button"
                            className="main-button trait-add-btn"
                            onClick={handleAddTrait}
                            disabled={traits.length >= appConfig.limits.card.maxTraits}
                            aria-label="Add trait"
                        >
                            <AddIcon/>
                        </button>
                    </div>
                </div>
            </div>
        </AccordionSection>
        <AccordionSection title="Sinner Stats">
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
                const tier = getResistTier(watch(field), "damage")
                return <div className="input-group-container" key={damageType}>
                    <NumberField<IIdInfo> name={field} registerNumber={registerNumber} inputClassName="stat-page-input-border" style={{ color: tier.color }}
                        label={<>
                            <img className="stat-icon" src={`/Images/attack/attackt_${damageType}.webp`} alt={`attackt_${damageType.toLowerCase()}`} />
                            <span>{damageType} resist (<span style={{ color: tier.color }}>{tier.label}</span>):</span>
                        </>}/>
                </div>
            })}
        </AccordionSection>
    </div>
}
