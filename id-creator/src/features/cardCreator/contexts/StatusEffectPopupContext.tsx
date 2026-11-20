'use client'
import React, { ReactElement, ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";
import { SkillDetail } from "features/cardCreator/types/SkillDetail";
import { StatusEffectInfo, buildStatusEffectLookup } from "features/cardCreator/types/StatusEffectInfo";
import { toKeywordKey } from "features/cardCreator/utils/keywords/keywords";
import StatusEffectPopup from "features/cardCreator/components/statusEffectPopup/StatusEffectPopup";

export interface StatusEffectPopupState {
    current: StatusEffectInfo | null
    anchor: Element | null
    isOpen: boolean
    open: (info: StatusEffectInfo, anchor: Element) => void
    close: () => void
    openFromElement: (target: EventTarget | null) => boolean
}

const statusEffectPopupState: StatusEffectPopupState = {
    current: null,
    anchor: null,
    isOpen: false,
    open: () => {},
    close: () => {},
    openFromElement: () => false,
}

const StatusEffectPopupContext = createContext<StatusEffectPopupState>(statusEffectPopupState)

export function useStatusEffectPopup(): StatusEffectPopupState {
    return useContext(StatusEffectPopupContext)
}

export function StatusEffectPopupProvider({ skills, children }: { skills: readonly SkillDetail[], children: ReactNode }): ReactElement {
    const statusEffectslookup = useMemo(() => buildStatusEffectLookup(skills), [skills])
    const [popup, setPopup] = useState<{ current: StatusEffectInfo, anchor: Element } | null>(null)

    const open = useCallback((current: StatusEffectInfo, anchor: Element) => setPopup({ current, anchor }), [])
    const close = useCallback(() => setPopup(null), [])

    const openFromElement = useCallback((target: EventTarget | null) => {
        if (!(target instanceof Element)) return false
        const anchor = target.closest("[data-status-effect]")
        if (!anchor) return false
        const info = statusEffectslookup[toKeywordKey(anchor.textContent?.trim() ?? "")]
        if (!info) return false
        setPopup({ current: info, anchor })
        return true
    }, [statusEffectslookup])

    const value = useMemo<StatusEffectPopupState>(() => ({
        current: popup?.current ?? null,
        anchor: popup?.anchor ?? null,
        isOpen: popup !== null,
        open,
        close,
        openFromElement,
    }), [popup, open, close, openFromElement])

    return <StatusEffectPopupContext.Provider value={value}>
        {children}
        <StatusEffectPopup/>
    </StatusEffectPopupContext.Provider>
}
