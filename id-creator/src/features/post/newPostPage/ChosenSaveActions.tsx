import React, { ReactElement } from "react";
import { ChosenSave, canUpdateSave, chosenSaveStatus, markForUpdate, undoChosenSave } from "features/post/utils/newPost";

type SavesChange = (saves: readonly ChosenSave[], index: number) => readonly ChosenSave[]

interface ChosenSaveActionsProps {
    save: ChosenSave
    index: number
    isReplacing: boolean
    onChange: (change: SavesChange) => void
    onReplace: () => void
}

const STATUS_LABELS = { updating: "Will update", replaced: "Replaced", new: "New" } as const

export default function ChosenSaveActions({ save, index, isReplacing, onChange, onReplace }: ChosenSaveActionsProps): ReactElement {
    const status = chosenSaveStatus(save)
    const label = `image ${index + 1}`
    return <div className="choosen-save-actions">
        {status !== "kept" && <span className="choosen-save-status">{STATUS_LABELS[status]}</span>}
        {status === "kept" && save.saveId === null && <span className="choosen-save-status muted">Save deleted</span>}
        <div className="choosen-save-buttons">
            {canUpdateSave(save) && <button type="button" className="main-button" aria-label={`Update ${label} from its save`}
                title="Copy the current version of this save" onClick={() => onChange(markForUpdate)}>Update</button>}
            {save.original && <button type="button" className="main-button" aria-label={`Undo changes to ${label}`}
                onClick={() => onChange(undoChosenSave)}>Undo</button>}
            <button type="button" className={`main-button ${isReplacing ? "active" : ""}`} aria-pressed={isReplacing}
                aria-label={`Replace ${label}`} onClick={onReplace}>{isReplacing ? "Cancel" : "Replace"}</button>
        </div>
    </div>
}
