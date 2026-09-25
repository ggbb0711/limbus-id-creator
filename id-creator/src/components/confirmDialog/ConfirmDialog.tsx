import React from "react";
import { ReactElement } from "react";
import "./ConfirmDialog.css"

interface ConfirmDialogProps {
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps): ReactElement {
    return <div className="confirm-dialog-container">
        <div className="confirm-dialog-background" onClick={onCancel}></div>
        <div className="confirm-dialog-outline">
            <div className="confirm-dialog">
                <p className="confirm-dialog-message">{message}</p>
                <div className="confirm-dialog-buttons">
                    <button className="main-button" onClick={onConfirm}>Confirm</button>
                    <button className="main-button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    </div>
}
