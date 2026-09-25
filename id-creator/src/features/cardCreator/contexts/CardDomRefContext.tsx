'use client'
import React, { createContext, ReactNode, RefObject, useContext, useRef } from "react";

// The rendered card element, used by the download button and cloud saves to screenshot it.
// Replaces the old module-level ref store (ImgDomRefSlice).
const CardDomRefContext = createContext<RefObject<HTMLDivElement | null> | null>(null)

export function CardDomRefProvider({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    return <CardDomRefContext.Provider value={ref}>{children}</CardDomRefContext.Provider>
}

export function useCardDomRef(): RefObject<HTMLDivElement | null> {
    const ref = useContext(CardDomRefContext)
    if (!ref) throw new Error("useCardDomRef must be used inside <CardDomRefProvider>")
    return ref
}
