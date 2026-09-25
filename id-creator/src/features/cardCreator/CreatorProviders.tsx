'use client'
import React, { ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { CardDomRefProvider } from "./contexts/CardDomRefContext";

export default function CreatorProviders({ children }: { children: ReactNode }) {
    return (
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
            <CardDomRefProvider>{children}</CardDomRefProvider>
        </DndProvider>
    )
}
