'use client'
import React, { ReactElement, ReactNode } from "react";
import "./PopUpMenu.css"
import CloseIcon from "assets/icons/CloseIcon";
import Dialog from "components/ui/dialog/Dialog";
import IconButton from "components/ui/iconButton/IconButton";

export default function PopUpMenu({ children, onClose, label, open = true }: { children: ReactNode, onClose: () => void, label: string, open?: boolean }): ReactElement {
    return <Dialog open={open} onClose={onClose} label={label} className="popup-container" backdropClassName="popup-background" contentClassName="popup-outline">
        <div className="popup">
            <IconButton className="close-popup" label="Close" onClick={onClose}><CloseIcon/></IconButton>
            {children}
        </div>
    </Dialog>
}
