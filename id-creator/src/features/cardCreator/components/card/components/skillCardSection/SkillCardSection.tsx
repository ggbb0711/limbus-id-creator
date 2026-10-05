import React, { ReactElement } from "react";
import { SkillDetail } from "features/cardCreator/types/SkillDetail";
import CustomSinnerEffect from "../../sections/customSinnerEffect/CustomSinnerEffect";
import DefenseSinnerSkill from "../../sections/defenseSinnerSkill/DefenseSinnerSkill";
import MentalSinnerEffect from "../../sections/mentalSinnerEffect/MentalSinnerEffect";
import OffenseSinnerSkill from "../../sections/offenseSinnerSkill/OffenseSinnerSkill";
import PassiveSinnerSkill from "../../sections/passiveSinnerSkill/PassiveSinnerSkill";

export default function SkillCardSection({skill}:{skill:SkillDetail}):ReactElement{
    switch(skill.type){
        case "OffenseSkill": return <OffenseSinnerSkill offenseSkill={skill}/>
        case "DefenseSkill": return <DefenseSinnerSkill defenseSkill={skill}/>
        case "PassiveSkill": return <PassiveSinnerSkill passiveSkill={skill}/>
        case "CustomEffect": return <CustomSinnerEffect customEffect={skill}/>
        case "MentalEffect": return <MentalSinnerEffect mentalEffect={skill}/>
    }
}
