import React, { ReactElement } from "react"
import { FieldErrors, Path } from "react-hook-form"
import AccordionSection from "components/ui/accordionSection/AccordionSection"
import { RegisterNumber } from "features/cardCreator/hooks/useNumberRegister"
import { IActiveSkill } from "features/cardCreator/types/skills/activeSkill/IActiveSkill"
import NumberField from "./NumberField"

type StatField = keyof Pick<IActiveSkill, "basePower" | "coinPow" | "coinNo" | "skillLevel" | "atkWeight" | "skillAmt">

interface SkillStatsSectionProps<T extends IActiveSkill> {
    registerNumber: RegisterNumber<T>
    errors: FieldErrors<T>
    idSuffix: string
    levelLabel: string
}

export default function SkillStatsSection<T extends IActiveSkill>({ registerNumber, errors, idSuffix, levelLabel }: SkillStatsSectionProps<T>): ReactElement {
    const rows: [StatField, string][][] = [
        [["basePower", "Base power:"], ["coinPow", "Coin power:"]],
        [["coinNo", "Coin number:"], ["skillLevel", levelLabel]],
        [["atkWeight", "Atk weight:"], ["skillAmt", "Amt:"]],
    ]

    return <AccordionSection title="Skill Stats">
        {rows.map(row =>
            <div className="input-group-container" key={row[0][0]}>
                {row.map(([name, label]) =>
                    <NumberField<T> key={name} name={name as Path<T>} label={label} registerNumber={registerNumber} errors={errors} idSuffix={idSuffix}/>
                )}
            </div>
        )}
    </AccordionSection>
}
