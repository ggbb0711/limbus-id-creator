'use client'
import { appConfig } from "config/env.client";
import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import "./AlertPopUp.css"
import { IAlert } from "types/IAlert";
import CloseIcon from "assets/icons/CloseIcon";
import IconButton from "components/ui/iconButton/IconButton";
import { useAppDispatch, useAppSelector } from "stores/AppStore";
import { removeAlertReducer } from "stores/slices/AlertSlice";

export default function AlertPopUp(): ReactElement {
    const alerts = useAppSelector(state => state.alert.value)

    return <div className="alert-popup-group" role="status" aria-live="polite">
        {alerts.map(alert => <Alert key={alert.alertId} alert={alert}/>)}
    </div>
}

function Alert({ alert }: { alert: IAlert }): ReactElement {
    const dispatch = useAppDispatch()
    const [slideIn, setSlideIn] = useState(false)

    useEffect(() => {
        const frame = requestAnimationFrame(() => setSlideIn(true))
        const timeout = setTimeout(() => setSlideIn(false), appConfig.timing.alertMs - 1000)
        return () => {
            cancelAnimationFrame(frame)
            clearTimeout(timeout)
        }
    }, [])

    const isFailure = alert.status === "Failure"

    return <div className={`alert-popup ${slideIn ? "active" : ""}`} role={isFailure ? "alert" : undefined}
        style={{ backgroundColor: isFailure ? "var(--Wrath)" : "var(--Gluttony)" }}>
        <p>{alert.msg}</p>
        <IconButton className="alert-popup-close-icon" label="Dismiss" onClick={() => dispatch(removeAlertReducer(alert.alertId))}><CloseIcon /></IconButton>
    </div>
}
