'use client'
import React, { ReactElement, useState } from "react"
import { createPortal } from "react-dom"
import "./SkillActionsMenu.css"
import ContextMenu, { contextMenuParts } from "components/ui/contextMenu/ContextMenu"
import DropdownMenu, { dropdownMenuParts } from "components/ui/dropdownMenu/DropdownMenu"
import { MenuParts } from "components/ui/menu/MenuParts"
import ConfirmDialog from "components/ui/confirmDialog/ConfirmDialog"
import IconButton from "components/ui/iconButton/IconButton"
import ArrowUpIcon from "assets/icons/ArrowUpIcon"
import ArrowDownIcon from "assets/icons/ArrowDownIcon"
import CheckIcon from "assets/icons/CheckIcon"
import DeleteIcon from "assets/icons/DeleteIcon"
import MoreIcon from "assets/icons/MoreIcon"
import SwapIcon from "assets/icons/SwapIcon"
import { SKILL_TYPES } from "features/cardCreator/types/SkillTypes"
import { SKILL_DATA } from "features/cardCreator/skills/skillData"
import { MoveDirection, SkillActionsProps } from "features/cardCreator/types/SkillActions"

function SkillActionItems({ parts: Menu, actions, onRequestDelete }: { parts: MenuParts, actions: SkillActionsProps, onRequestDelete: () => void }): ReactElement {
    return <>
        <Menu.Sub>
            <Menu.SubTrigger><SwapIcon/>Change type</Menu.SubTrigger>
            <Menu.SubContent>
                {SKILL_TYPES.map(type => <Menu.Item key={type} disabled={type === actions.type} onSelect={() => actions.onChangeType(type)}>
                    <span className="menu-item-check">{type === actions.type && <CheckIcon width="16px" height="16px"/>}</span>
                    <img className="menu-item-icon" src={SKILL_DATA[type].icon} alt="" crossOrigin="anonymous"/>
                    {SKILL_DATA[type].label}
                </Menu.Item>)}
            </Menu.SubContent>
        </Menu.Sub>
        <Menu.Item disabled={!actions.canMoveUp} onSelect={() => actions.onMove(MoveDirection.Up)}><ArrowUpIcon/>Move up</Menu.Item>
        <Menu.Item disabled={!actions.canMoveDown} onSelect={() => actions.onMove(MoveDirection.Down)}><ArrowDownIcon/>Move down</Menu.Item>
        <Menu.Separator/>
        <Menu.Item danger onSelect={onRequestDelete}><DeleteIcon/>Delete</Menu.Item>
    </>
}

function useDeleteConfirmation(actions: SkillActionsProps) {
    const [isConfirming, setIsConfirming] = useState(false)
    const dialog = isConfirming && createPortal(<ConfirmDialog
        message={`Are you sure you want to delete this ${SKILL_DATA[actions.type].label}?`}
        onConfirm={() => { setIsConfirming(false); actions.onDelete() }}
        onCancel={() => setIsConfirming(false)}
    />, document.body)
    return { requestDelete: () => setIsConfirming(true), dialog }
}

export function SkillActionsDropdown(actions: SkillActionsProps): ReactElement {
    const { requestDelete, dialog } = useDeleteConfirmation(actions)
    return <>
        <DropdownMenu trigger={<IconButton className="skill-actions-button" label="Skill actions"><MoreIcon/></IconButton>}>
            <SkillActionItems parts={dropdownMenuParts} actions={actions} onRequestDelete={requestDelete}/>
        </DropdownMenu>
        {dialog}
    </>
}

export function SkillContextMenu({ children, ...actions }: SkillActionsProps & { children: ReactElement }): ReactElement {
    const { requestDelete, dialog } = useDeleteConfirmation(actions)
    return <>
        <ContextMenu trigger={children}>
            <SkillActionItems parts={contextMenuParts} actions={actions} onRequestDelete={requestDelete}/>
        </ContextMenu>
        {dialog}
    </>
}
