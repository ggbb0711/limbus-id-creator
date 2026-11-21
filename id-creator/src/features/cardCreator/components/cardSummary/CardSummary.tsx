import React, { ReactElement, ReactNode } from "react";
import IdHeader from "features/cardCreator/components/card/components/cardHeader/IdHeader";
import EgoHeader from "features/cardCreator/components/card/components/cardHeader/EgoHeader";
import SinnerStats from "features/cardCreator/components/card/components/sinnerStats/SinnerStats";
import SinCost from "features/cardCreator/components/card/components/sinCost/SinCost";
import SinResistant from "features/cardCreator/components/card/components/sinResistant/SinResistant";
import OffenseSinnerSkill from "features/cardCreator/components/card/sections/offenseSinnerSkill/OffenseSinnerSkill";
import DefenseSinnerSkill from "features/cardCreator/components/card/sections/defenseSinnerSkill/DefenseSinnerSkill";
import PassiveSinnerSkill from "features/cardCreator/components/card/sections/passiveSinnerSkill/PassiveSinnerSkill";
import CustomSinnerEffect from "features/cardCreator/components/card/sections/customSinnerEffect/CustomSinnerEffect";
import MentalSinnerEffect from "features/cardCreator/components/card/sections/mentalSinnerEffect/MentalSinnerEffect";
import { SkillDetail } from "features/cardCreator/types/SkillDetail";
import { IIdInfo } from "features/cardCreator/types/IIdInfo";
import { IEgoInfo } from "features/cardCreator/types/IEgoInfo";
import Tabs, { Tab } from "components/ui/tabs/Tabs";
import { StatusEffectPopupProvider } from "features/cardCreator/contexts/StatusEffectPopupContext";
import SummarySplashArt from "./SummarySplashArt";
import "./CardSummary.css";

function renderSkill(skill: SkillDetail): ReactElement {
    switch (skill.type) {
        case "OffenseSkill": return <OffenseSinnerSkill key={skill.inputId} offenseSkill={skill}/>
        case "DefenseSkill": return <DefenseSinnerSkill key={skill.inputId} defenseSkill={skill}/>
        case "PassiveSkill": return <PassiveSinnerSkill key={skill.inputId} passiveSkill={skill}/>
        case "CustomEffect": return <CustomSinnerEffect key={skill.inputId} customEffect={skill}/>
        case "MentalEffect": return <MentalSinnerEffect key={skill.inputId} mentalEffect={skill}/>
    }
}

const TAB_GROUPS: { id: string, label: string, types: SkillDetail["type"][] }[] = [
    { id: "skills", label: "Skills", types: ["OffenseSkill", "DefenseSkill"] },
    { id: "passives", label: "Passives", types: ["PassiveSkill"] },
    { id: "effects", label: "Effects", types: ["CustomEffect", "MentalEffect"] },
]

function SummaryHeader({ sinnerColor, sinnerIcon, children }: { sinnerColor: string, sinnerIcon: string, children: ReactNode }): ReactElement {
    return <div className="card-summary-header" style={{ borderColor: sinnerColor }}>
        {children}
        {sinnerIcon && <img className="card-summary-sinner-icon" src={sinnerIcon} alt="" />}
    </div>
}

function IdentityTop({ info, name }: { info: IIdInfo, name: string }): ReactElement {
    return <>
        <SummaryHeader sinnerColor={info.sinnerColor} sinnerIcon={info.sinnerIcon}>
            <IdHeader title={info.title} name={info.name} sinnerColor={info.sinnerColor} rarity={info.rarity} traits={info.traits ?? []}/>
        </SummaryHeader>
        {info.splashArt && <SummarySplashArt kind="Identity" name={name} splashArt={info.splashArt} splashArtScale={info.splashArtScale} splashArtTranslation={info.splashArtTranslation}/>}
        <div className="card-summary-stats">
            <SinnerStats minSpeed={info.minSpeed} maxSpeed={info.maxSpeed} hp={info.hp} staggerResist={info.staggerResist} defenseLevel={info.defenseLevel}
                slashResistant={info.slashResistant} pierceResistant={info.pierceResistant} bluntResistant={info.bluntResistant} sinnerColor={info.sinnerColor}/>
        </div>
    </>
}

function EgoTop({ info, name }: { info: IEgoInfo, name: string }): ReactElement {
    return <>
        <SummaryHeader sinnerColor={info.sinnerColor} sinnerIcon={info.sinnerIcon}>
            <EgoHeader title={info.title} name={info.name} egoLevel={info.egoLevel} sanityCost={info.sanityCost} sinnerColor={info.sinnerColor}/>
        </SummaryHeader>
        {info.splashArt && <SummarySplashArt kind="Ego" name={name} splashArt={info.splashArt} splashArtScale={info.splashArtScale} splashArtTranslation={info.splashArtTranslation}/>}
        <div className="card-summary-stats ego">
            <SinCost sinCost={info.sinCost}/>
            <SinResistant sinResistant={info.sinResistant}/>
        </div>
    </>
}

export type SummaryCard =
    | { kind: "Identity", info: IIdInfo }
    | { kind: "Ego", info: IEgoInfo }

export default function CardSummary({ card }: { card: SummaryCard }): ReactElement {
    const { info } = card
    const name = [info.title, info.name].filter(Boolean).join(" ") || card.kind
    const tabs: Tab[] = TAB_GROUPS
        .map(group => ({ ...group, skills: info.skillDetails.filter(skill => group.types.includes(skill.type)) }))
        .filter(group => group.skills.length > 0)
        .map(group => ({ id: group.id, label: group.label, panel: <div className="card-summary-skill-list">{group.skills.map(renderSkill)}</div> }))

    return <StatusEffectPopupProvider skills={info.skillDetails}>
        <section className="card-summary" aria-label={name}>
            {card.kind === "Identity" ? <IdentityTop info={card.info} name={name}/> : <EgoTop info={card.info} name={name}/>}
            {tabs.length > 0 && <Tabs className="card-summary-tabs" tabs={tabs} label={`${name} details`}/>}
        </section>
    </StatusEffectPopupProvider>
}
