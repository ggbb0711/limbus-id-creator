import React, { CSSProperties, ReactElement, ReactNode } from "react"
import "features/cardCreator/components/inputTab/InputPage.css"
import ArrowDownIcon from "assets/icons/ArrowDownIcon"
import IconButton from "components/ui/iconButton/IconButton"
import { SkillActionsDropdown } from "features/cardCreator/components/skillActionsMenu/SkillActionsMenu"
import { SKILL_DATA } from "features/cardCreator/skills/skillData"
import { SkillActionsProps } from "features/cardCreator/types/SkillActions"

interface SkillPageShellProps {
    className?: string
    style?: CSSProperties
    collapsePage: () => void
    actions: SkillActionsProps
    children: ReactNode
}

export default function SkillPageShell({ className = "", style, collapsePage, actions, children }: SkillPageShellProps): ReactElement {
    return <div className={`input-page ${className}`} style={style}>
        <div className="input-page-icon-container">
            <SkillActionsDropdown {...actions}/>
            <IconButton className="collasp-icon" label="Collapse the input page" onClick={collapsePage}>
                <ArrowDownIcon/>
            </IconButton>
        </div>
        <h2 className="input-page-type">{SKILL_DATA[actions.type].label}</h2>
        {children}
    </div>
}
