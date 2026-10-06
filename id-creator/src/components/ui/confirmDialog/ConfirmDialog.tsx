'use client'
import React from "react";
import { ReactElement } from "react";
import "./ConfirmDialog.css"
import Dialog from "components/ui/dialog/Dialog";

interface ConfirmDialogProps {
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps): ReactElement {
    return <Dialog onClose={onCancel} label={message} role="alertdialog" className="confirm-dialog-container" backdropClassName="confirm-dialog-background" contentClassName="confirm-dialog-outline">
        <div className="confirm-dialog">
            <p className="confirm-dialog-message">{message}</p>
            <div className="confirm-dialog-buttons">
                <button type="button" className="main-button" onClick={onConfirm}>Confirm</button>
                <button type="button" className="main-button" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    </Dialog>
}
