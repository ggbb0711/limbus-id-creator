import { IMentalEffect } from "features/cardCreator/types/skills/mentalEffect/IMentalEffect";
import React, { ReactElement } from "react";
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import SkillPageShell from "features/cardCreator/components/shared/skillPageShell/SkillPageShell";
import EffectEditorField from "features/cardCreator/components/shared/effectEditorField/EffectEditorField";
import { useSkillForm } from "features/cardCreator/hooks/useSkillForm";

export default function InputMentalEffect({ index, collapsePage }: { index: number, collapsePage: () => void }): ReactElement {
    const { setValue, watch, deleteSkill, changeSkillType, keyWordList } = useSkillForm<IMentalEffect>(index)
    const inputId = watch("inputId")
    const effect = watch("effect")
    const type = watch("type")

    return <SkillPageShell type={type} collapsePage={collapsePage} onChangeType={changeSkillType} onDelete={deleteSkill}>
        <AccordionSection title="Effect Info">
            <EffectEditorField label="Mental effect:" inputId={`effect_${inputId}`} content={effect}
                onChange={(html) => setValue("effect", html)} matchList={keyWordList}/>
        </AccordionSection>
    </SkillPageShell>
}
