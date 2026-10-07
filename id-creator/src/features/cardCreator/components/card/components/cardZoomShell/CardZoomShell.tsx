import React, { ReactElement, ReactNode } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export default function CardZoomShell({ isDragging, children }: { isDragging: boolean, children: ReactNode }): ReactElement {
    return (
        <TransformWrapper
            initialScale={0.5}
            minScale={.1}
            limitToBounds={false}
            pinch={{ step: 10 }}
            disabled={isDragging}
            initialPositionX={400}
            initialPositionY={60}
            doubleClick={{ disabled: true }}>
            <TransformComponent wrapperStyle={{ width: "100vw" }}>
                {children}
            </TransformComponent>
        </TransformWrapper>
    )
}
