import React, { FormEvent, ReactElement, useId, useState } from "react";
import PopUpMenu from "components/ui/popUpMenu/PopUpMenu";
import "./SaveNameDialog.css"
import "../SettingMenu.css"

interface SaveNameDialogProps {
    open: boolean
    title: string
    submitLabel: string
    initialName: string
    onSubmit: (name: string) => void
    onClose: () => void
}

function SaveNameForm({ submitLabel, initialName, onSubmit, onClose }: Omit<SaveNameDialogProps, "open" | "title">): ReactElement {
    const inputId = useId()
    const [name, setName] = useState(initialName)
    const trimmed = name.trim()

    function submit(event: FormEvent) {
        event.preventDefault()
        if (!trimmed) return
        onSubmit(trimmed)
        onClose()
    }

    return <form className="save-name-dialog" onSubmit={submit}>
        <label htmlFor={inputId}>Enter the name of the save:</label>
        <input className="input save-name-dialog-input" id={inputId} type="text" placeholder="Save name" value={name} onChange={(e) => setName(e.target.value)}/>
        <button type="submit" className="main-button create-new-save-btn" disabled={!trimmed}>{submitLabel}</button>
    </form>
}

export default function SaveNameDialog({ open, title, ...formProps }: SaveNameDialogProps): ReactElement {
    return <PopUpMenu open={open} label={title} onClose={formProps.onClose}>
        {open && <SaveNameForm {...formProps}/>}
    </PopUpMenu>
}
