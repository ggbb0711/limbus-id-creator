import React, { CSSProperties, ReactElement, ReactNode, useState } from "react"
import "features/cardCreator/components/inputTab/InputPage.css"
import ArrowDownIcon from "assets/icons/ArrowDownIcon"
import DeleteIcon from "assets/icons/DeleteIcon"
import ConfirmDialog from "components/ui/confirmDialog/ConfirmDialog"
import ChangeInputType from "features/cardCreator/components/inputTab/components/changeInputType/ChangeInputType"
import { SKILL_DATA } from "features/cardCreator/skills/skillData"
import { SkillType } from "features/cardCreator/types/SkillTypes"
import IconButton from "components/ui/iconButton/IconButton"

interface SkillPageShellProps {
    type: SkillType
    className?: string
    style?: CSSProperties
    collapsePage: () => void
    onChangeType: (type: SkillType) => void
    onDelete: () => void
    children: ReactNode
}

export default function SkillPageShell({ type, className = "", style, collapsePage, onChangeType, onDelete, children }: SkillPageShellProps): ReactElement {
    const [isConfirming, setIsConfirming] = useState(false)

    return <div className={`input-page ${className}`} style={style}>
        <div className="input-page-icon-container">
            <IconButton className="collasp-icon" label="Collapse the input page" onClick={collapsePage}>
                <ArrowDownIcon/>
            </IconButton>
        </div>
        <div className="input-group-container">
            <label className="input-label">Change skill:</label>
            <ChangeInputType changeSkillType={onChangeType} type={type}/>
        </div>
        {children}
        <button className="main-button delete-skill-button" onClick={() => setIsConfirming(true)}>
            <DeleteIcon/> Delete the skill
        </button>
        {isConfirming && <ConfirmDialog
            message={`Are you sure you want to delete this ${SKILL_DATA[type].label}?`}
            onConfirm={() => { setIsConfirming(false); onDelete() }}
            onCancel={() => setIsConfirming(false)}
        />}
    </div>
}
