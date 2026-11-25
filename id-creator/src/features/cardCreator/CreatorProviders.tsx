'use client'
import React, { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { CardDomRefProvider } from "./contexts/CardDomRefContext";

const TOUCH_DRAG_DELAY_MS = 200

export default function CreatorProviders({ children }: { children: ReactNode }) {
    return (
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: TOUCH_DRAG_DELAY_MS }}>
            <CardDomRefProvider>{children}</CardDomRefProvider>
        </DndProvider>
    )
}
