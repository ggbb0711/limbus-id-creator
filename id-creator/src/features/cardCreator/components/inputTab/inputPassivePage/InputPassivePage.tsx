import { IPassiveSkill } from "features/cardCreator/types/skills/passiveSkill/IPassiveSkill";
import React, { ReactElement } from "react";
import "../InputPage.css"
import "../inputStatPage/InputStatPage.css"
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import SkillPageShell from "features/cardCreator/components/shared/skillPageShell/SkillPageShell";
import SinNumberInputs from "features/cardCreator/components/shared/sinNumberInputs/SinNumberInputs";
import EffectEditorField from "features/cardCreator/components/shared/effectEditorField/EffectEditorField";
import { useSkillForm } from "features/cardCreator/hooks/useSkillForm";

export default function InputPassivePage({ index, collapsePage }: { index: number, collapsePage: () => void }): ReactElement {
    const { register, setValue, watch, deleteSkill, changeSkillType, registerNumber, keyWordList } = useSkillForm<IPassiveSkill>(index)
    const inputId = watch("inputId")
    const type = watch("type")
    const skillEffect = watch("skillEffect")

    return <SkillPageShell type={type} className="input-passive-page" collapsePage={collapsePage} onChangeType={changeSkillType} onDelete={deleteSkill}>
        <AccordionSection title="Passive Requirements">
            <p className="input-label">Sin Own</p>
            <SinNumberInputs<IPassiveSkill> field="reqOwn" registerNumber={registerNumber} idSuffix={`own_${inputId}`} containerClassName="center-element-vertically"/>
            <p className="input-label">Sin Res</p>
            <SinNumberInputs<IPassiveSkill> field="reqRes" registerNumber={registerNumber} idSuffix={`res_${inputId}`} containerClassName="center-element-vertically"/>
        </AccordionSection>
        <AccordionSection title="Skill Info">
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor={`skillLabel_${inputId}`}>Skill label:</label>
                    <input className="input block" type="text" id={`skillLabel_${inputId}`} {...register("skillLabel")} />
                </div>
            </div>
            <div className="input-group-container">
                <div className="input-container">
                    <label className="input-label" htmlFor={`name_${inputId}`}>Passive name:</label>
                    <input className="input block" type="text" id={`name_${inputId}`} {...register("name")}/>
                </div>
            </div>
            <EffectEditorField label="Passive description:" inputId={`skillEffect_${inputId}`} content={skillEffect}
                onChange={(html) => setValue("skillEffect", html)} matchList={keyWordList}/>
        </AccordionSection>
    </SkillPageShell>
}
