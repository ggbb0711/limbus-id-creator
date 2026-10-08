import { appConfig } from "config/env.client";
import React, { ReactElement } from "react";
import "../InputPage.css"
import { IDefenseSkill } from "features/cardCreator/types/skills/defenseSkill/IDefenseSkill";
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import SinAffinityInput from "../components/sinAffinityInput/SinAffinityInput";
import SkillFrameInput from "../components/skillFrameInput/SkillFrameInput";
import DamageTypeInput from "../components/damageTypeInput/DamageTypeInput";
import DefenseTypeInput from "../components/defenseTypeInput/DefenseTypeInput";
import SkillPageShell from "features/cardCreator/components/shared/SkillPageShell";
import SkillStatsSection from "features/cardCreator/components/shared/SkillStatsSection";
import ImageUploadField from "features/cardCreator/components/shared/ImageUploadField";
import EffectEditorField from "features/cardCreator/components/shared/EffectEditorField";
import { useSkillForm } from "features/cardCreator/hooks/useSkillForm";
import { isCounter } from "features/cardCreator/utils/card/skillIcons";

export default function InputDefenseSkillPage({ index, collapsePage }: { index: number, collapsePage: () => void }): ReactElement {
    const { register, setValue, watch, deleteSkill, changeSkillType, registerNumber, keyWordList, errors } = useSkillForm<IDefenseSkill>(index)

    const inputId = watch("inputId")
    const skillAffinity = watch("skillAffinity")
    const skillFrame = watch("skillFrame")
    const skillImage = watch("skillImage")
    const damageType = watch("damageType")
    const defenseType = watch("defenseType")
    const type = watch("type")
    const skillEffect = watch("skillEffect")

    return <SkillPageShell type={type} className="input-defense-skill-page" style={{ background: `var(--${skillAffinity}-input-page)` }}
        collapsePage={collapsePage} onChangeType={changeSkillType} onDelete={deleteSkill}>
        <AccordionSection title="Skill Affinity and Type">
            <div className="input-group-container">
                <div className="input-container">
                    <p className="input-label">Defense type:</p>
                    <DefenseTypeInput onChangeDefenseType={(newVal) => setValue("defenseType", newVal)} activeDefenseType={defenseType}/>
                </div>
                <div className="input-container">
                    <p className="input-label">Damage type:</p>
                    <DamageTypeInput onChangeDamageType={(newVal) => setValue("damageType", newVal)} activeDamageType={damageType} disabled={!isCounter(defenseType)}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <p className="input-label">Sin affinity:</p>
                    <SinAffinityInput onChangeSinAffinity={(newVal) => setValue("skillAffinity", newVal)} activeSin={skillAffinity}/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label htmlFor={`showDefenseIcon_${inputId}`} className="input-label">Show defense icon: </label>
                    <input type="checkbox" id={`showDefenseIcon_${inputId}`} {...register("showDefenseIcon")}/>
                </div>
            </div>
            {skillAffinity !== "None" &&
                <div className="input-group-container">
                    <div className="input-container">
                        <p className="input-label">Skill frame:</p>
                        <SkillFrameInput onChangeSkillFrame={(newVal) => setValue("skillFrame", newVal)} activeFrame={skillFrame} skillAffinity={skillAffinity}/>
                    </div>
                </div>
            }
        </AccordionSection>
        <SkillStatsSection registerNumber={registerNumber} errors={errors} idSuffix={inputId} levelLabel="Defense level:"/>
        <AccordionSection title="Skill Info">
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor={`skill-image-input_${inputId}`}>Skill image: </label>
                    <ImageUploadField id={`skill-image-input_${inputId}`} buttonText="Upload skill img" maxSize={appConfig.limits.upload.skillImage}
                        value={skillImage} onChange={(url) => setValue("skillImage", url)} previewClassName="preview-skill-image"/>
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor={`skillLabel_${inputId}`}>Skill label:</label>
                    <input className="input block" type="text" id={`skillLabel_${inputId}`} {...register("skillLabel")} />
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor={`name_${inputId}`}>Skill name:</label>
                    <input className="input block" type="text" id={`name_${inputId}`} {...register("name")} />
                </div>
            </div>
            <EffectEditorField label="Skill description:" inputId={`skillEffect_${inputId}`} content={skillEffect}
                onChange={(html) => setValue("skillEffect", html)} matchList={keyWordList} guide="skill"/>
        </AccordionSection>
    </SkillPageShell>
}
