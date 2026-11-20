'use client'
import React, { ReactElement, useState } from "react";
import { FloatingPortal, autoUpdate, flip, offset, shift, useDismiss, useFloating, useInteractions, useRole } from "@floating-ui/react";
import { useStatusEffectPopup } from "features/cardCreator/contexts/StatusEffectPopupContext";
import { sanitizeCardHtml } from "utils/htmlUtils";
import "./StatusEffectPopup.css";

export default function StatusEffectPopup(): ReactElement | null {
    const { current, anchor, isOpen, close } = useStatusEffectPopup()
    const [floating, setFloating] = useState<HTMLElement | null>(null)
    const { floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: next => { if (!next) close() },
        placement: "bottom-start",
        middleware: [offset(6), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
        elements: { reference: anchor, floating },
    })
    const dismiss = useDismiss(context)
    const role = useRole(context, { role: "dialog" })
    const { getFloatingProps } = useInteractions([dismiss, role])

    if (!isOpen || !current) return null

    return <FloatingPortal>
        <div ref={setFloating} style={floatingStyles} className="status-effect-popup" aria-label={current.name} {...getFloatingProps()}>
            <div className="status-effect-popup-header" style={{ color: current.color }}>
                {current.image && <img className="status-effect-popup-icon" src={current.image} alt="" />}
                <p className="status-effect-popup-name">{current.name}</p>
            </div>
            <div className="status-effect-popup-description" dangerouslySetInnerHTML={{ __html: sanitizeCardHtml(current.description) }}/>
        </div>
    </FloatingPortal>
}
