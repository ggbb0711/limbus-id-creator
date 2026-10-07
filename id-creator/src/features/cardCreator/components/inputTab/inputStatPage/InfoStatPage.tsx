import React, { ReactElement } from "react";
import "../InputPage.css"
import "./InputStatPage.css"
import DeleteIcon from "assets/icons/DeleteIcon";
import ArrowDownIcon from "assets/icons/ArrowDownIcon";
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import IconButton from "components/ui/iconButton/IconButton";
import SinnerIconPicker from "./sinnerIconPicker/SinnerIconPicker";
import SinnerSplashArtRepositionInput from "./sinnerSplashArtRepositionInput/SinnerSplashArtRepositionInput";
import ImageUploadField from "features/cardCreator/components/shared/imageUploadField/ImageUploadField";
import ColorPicker from "features/cardCreator/components/colorPicker/ColorPicker";
import { STAT_PAGE_COLOR_GROUPS } from "features/cardCreator/components/colorPicker/ColorPresets";
import { useInfoForm } from "features/cardCreator/hooks/useInfoForm";
import { useCardEditor } from "features/cardCreator/editors/CardEditorContext";
import { CardInfo } from "features/cardCreator/types/CardInfo";

export default function InfoStatPage({ collapsePage }: { collapsePage: () => void }): ReactElement {
    const editor = useCardEditor()
    const form = useInfoForm<CardInfo>()
    const { register, setValue, watch, registerNumber } = form
    const { GeneralFields, StatsSection } = editor

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
        <AccordionSection title={editor.generalSectionTitle}>
            <div className="sinner-icon-input-container">
                <p>Pick the sinner icon: </p>
                <SinnerIconPicker/>
                <ImageUploadField id="sinner-icon-image-input" buttonText="Upload sinner icon" maxSize={editor.uploadLimits.sinnerIcon}
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
                        <button type="button" onClick={() => setValue("splashArt", "")} className="main-button">
                            <p className="center-element delete-txt"><DeleteIcon/> Delete splash art</p>
                        </button>
                    </div>
                </>}
            <ImageUploadField id="splash-art-image-input" buttonText="Upload splash art" maxSize={editor.uploadLimits.splashArt}
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
            {GeneralFields && <GeneralFields form={form} registerNumber={registerNumber}/>}
        </AccordionSection>
        <StatsSection form={form} registerNumber={registerNumber}/>
    </div>
}
