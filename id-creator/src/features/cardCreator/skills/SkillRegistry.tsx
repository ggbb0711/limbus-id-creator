import React, { ComponentType, ReactElement } from "react"
import { SkillOfType } from "features/cardCreator/types/SkillDetail"
import { SkillType } from "features/cardCreator/types/SkillTypes"
import OffenseSinnerSkill from "features/cardCreator/components/card/sections/offenseSinnerSkill/OffenseSinnerSkill"
import DefenseSinnerSkill from "features/cardCreator/components/card/sections/defenseSinnerSkill/DefenseSinnerSkill"
import PassiveSinnerSkill from "features/cardCreator/components/card/sections/passiveSinnerSkill/PassiveSinnerSkill"
import CustomSinnerEffect from "features/cardCreator/components/card/sections/customSinnerEffect/CustomSinnerEffect"
import MentalSinnerEffect from "features/cardCreator/components/card/sections/mentalSinnerEffect/MentalSinnerEffect"
import InputOffenseSkillPage from "features/cardCreator/components/inputTab/inputOffenseSkillPage/InputOffenseSkillPage"
import InputDefenseSkillPage from "features/cardCreator/components/inputTab/inputDefenseSkillPage/InputDefenseSkillPage"
import InputPassivePage from "features/cardCreator/components/inputTab/inputPassivePage/InputPassivePage"
import InputCustomEffectPage from "features/cardCreator/components/inputTab/inputCustomEffectPage/InputCustomEffectPage"
import InputMentalEffect from "features/cardCreator/components/inputTab/inputMentalEffect/InputMentalEffect"

export interface SkillInputPageProps {
    index: number
    collapsePage: () => void
}

export interface SkillView<K extends SkillType> {
    renderCard(skill: SkillOfType<K>): ReactElement
    InputPage: ComponentType<SkillInputPageProps>
}

export const SKILL_VIEWS = {
    OffenseSkill: {
        renderCard: skill => <OffenseSinnerSkill offenseSkill={skill}/>,
        InputPage: InputOffenseSkillPage,
    },
    DefenseSkill: {
        renderCard: skill => <DefenseSinnerSkill defenseSkill={skill}/>,
        InputPage: InputDefenseSkillPage,
    },
    PassiveSkill: {
        renderCard: skill => <PassiveSinnerSkill passiveSkill={skill}/>,
        InputPage: InputPassivePage,
    },
    CustomEffect: {
        renderCard: skill => <CustomSinnerEffect customEffect={skill}/>,
        InputPage: InputCustomEffectPage,
    },
    MentalEffect: {
        renderCard: skill => <MentalSinnerEffect mentalEffect={skill}/>,
        InputPage: InputMentalEffect,
    },
} satisfies { [K in SkillType]: SkillView<K> }

export const getSkillView = (type: SkillType): SkillView<SkillType> => SKILL_VIEWS[type]
