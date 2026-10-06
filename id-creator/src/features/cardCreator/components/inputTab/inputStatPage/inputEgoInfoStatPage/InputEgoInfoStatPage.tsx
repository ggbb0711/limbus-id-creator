import { getResistTier } from "features/cardCreator/utils/card/getResistTier";
import { appConfig } from "config/env.client";
import React from "react";
import { ReactElement } from "react";
import "../../InputPage.css"
import "../InputStatPage.css"
import DropDown from "components/ui/dropDown/DropDown";
import ArrowDownIcon from "assets/icons/ArrowDownIcon";
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import { EGO_LEVEL_OPTIONS } from "../egoLevelDropDown/EgoLevelDropDown";
import SinnerIconPicker from "../sinnerIconPicker/SinnerIconPicker";
import SinnerSplashArtRepositionInput from "../sinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import ImageUploadField from "features/cardCreator/components/shared/imageUploadField/ImageUploadField";
import NumberField from "features/cardCreator/components/shared/numberField/NumberField";
import SinNumberInputs from "features/cardCreator/components/shared/sinNumberInputs/SinNumberInputs";
import { IEgoInfo } from "features/cardCreator/types/IEgoInfo";
import { useInfoForm } from "features/cardCreator/hooks/useInfoForm";
import ColorPicker from "features/cardCreator/components/colorPicker/ColorPicker";
import { STAT_PAGE_COLOR_GROUPS } from "features/cardCreator/components/colorPicker/ColorPresets";
import IconButton from "components/ui/iconButton/IconButton";

export default function InputEgoInfoStatPage({ collapsePage }: { collapsePage: () => void }): ReactElement {
    const { register, setValue, watch, registerNumber } = useInfoForm<IEgoInfo>()

    const splashArt = watch("splashArt")
    const sinnerColor = watch("sinnerColor")
    const splashArtScale = watch("splashArtScale")
    const splashArtTranslation = watch("splashArtTranslation")
    const sinResistant = watch("sinResistant")
    const egoLevel = watch("egoLevel")

    return <div className="input-page input-stat-page">
        <div className="input-page-icon-container">
            <IconButton className="collasp-icon" label="Collapse the input page" onClick={collapsePage}>
                <ArrowDownIcon/>
            </IconButton>
        </div>
        <AccordionSection title="Ego General Info">
            <div className="sinner-icon-input-container">
                <p>Pick the sinner icon: </p>
                <SinnerIconPicker/>
                <ImageUploadField id="sinner-icon-image-input" buttonText="Upload sinner icon" maxSize={appConfig.limits.upload.egoSinnerIcon}
                    onChange={(url) => setValue("sinnerIcon", url)}/>
            </div>
            <div className="sinner-color-input-container">
                <p>Pick a color for your sinner: </p>
                <ColorPicker presets={STAT_PAGE_COLOR_GROUPS} className="sinner-color-input" id="sinnerColor" value={sinnerColor} onChange={(color) => setValue("sinnerColor", color)}/>
            </div>
            {splashArt &&
                <div className="input-group-container">
                    <p className="center-element">Delete the splash art? <IconButton className="material-symbols-outlined delete-splash-art-btn" label="Delete the splash art" onClick={() => setValue("splashArt", "")}>
                        delete
                    </IconButton></p>
                    <p style={{ textAlign: "center" }}>Control the position of the splash art by dragging and zooming on this circle:</p>
                    <SinnerSplashArtRepositionInput scale={splashArtScale} translation={splashArtTranslation} onChange={(value) => {
                        setValue("splashArtScale", value.scale)
                        setValue("splashArtTranslation", value.translation)
                    }}/>
                </div>}
            <ImageUploadField id="splash-art-img-input" buttonText="Upload splash art" maxSize={appConfig.limits.upload.egoSplashArt}
                onChange={(url) => setValue("splashArt", url)}/>
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
        </AccordionSection>
        <AccordionSection title="Ego Stats">
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
                colorFor={(key) => getResistTier(sinResistant?.[key], "sin").color}/>
        </AccordionSection>
    </div>
}
