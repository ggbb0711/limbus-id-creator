import { appConfig } from "config/env.client";
import { ICustomEffect } from "features/cardCreator/types/skills/customEffect/ICustomEffect";
import React, { ReactElement } from "react";
import "../InputPage.css"
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import SkillPageShell from "features/cardCreator/components/shared/skillPageShell/SkillPageShell";
import ImageUploadField from "features/cardCreator/components/shared/imageUploadField/ImageUploadField";
import EffectEditorField from "features/cardCreator/components/shared/effectEditorField/EffectEditorField";
import { useSkillForm } from "features/cardCreator/hooks/useSkillForm";
import ColorPicker from "features/cardCreator/components/colorPicker/ColorPicker";
import { CUSTOM_EFFECT_COLOR_GROUPS } from "features/cardCreator/components/colorPicker/ColorPresets";

export default function InputCustomEffectPage({ index, collapsePage }: { index: number, collapsePage: () => void }): ReactElement {
    const { register, setValue, watch, deleteSkill, changeSkillType, keyWordList } = useSkillForm<ICustomEffect>(index)
    const inputId = watch("inputId")
    const effectColor = watch("effectColor")
    const customImg = watch("customImg")
    const type = watch("type")
    const effect = watch("effect")

    return <SkillPageShell type={type} collapsePage={collapsePage} onChangeType={changeSkillType} onDelete={deleteSkill}>
        <AccordionSection title="Effect Style">
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor={`custom-effect-img-input_${inputId}`}>Custom image: </label>
                    <ImageUploadField id={`custom-effect-img-input_${inputId}`} buttonText="Upload custom img" maxSize={appConfig.limits.upload.skillImage}
                        value={customImg} onChange={(url) => setValue("customImg", url)} previewClassName="status-icon"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label htmlFor={`effectColor_${inputId}`} className="input-label">Choose the effect color: </label>
                    <ColorPicker presets={CUSTOM_EFFECT_COLOR_GROUPS} id={`effectColor_${inputId}`} value={effectColor} onChange={(color) => setValue("effectColor", color)}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label htmlFor={`isCoinType_${inputId}`} className="input-label">Use as custom coin type: </label>
                    <input type="checkbox" id={`isCoinType_${inputId}`} {...register("isCoinType")}/>
                    <p className="effect-guide">
                        When enable, you can use custom coin with the syntax [coin_1_effect_name] through [coin_9_effect_name] and it will render the coin with the custom images.
                    </p>
                </div>
            </div>
        </AccordionSection>
        <AccordionSection title="Effect Info">
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor={`name_${inputId}`}>Effect name:</label>
                    <input className="input block" style={{ color: effectColor }} type="text" id={`name_${inputId}`} {...register("name")} />
                </div>
            </div>
            <EffectEditorField label="Effect description:" inputId={`effect_${inputId}`} content={effect}
                onChange={(html) => setValue("effect", html)} matchList={keyWordList}/>
        </AccordionSection>
    </SkillPageShell>
}
