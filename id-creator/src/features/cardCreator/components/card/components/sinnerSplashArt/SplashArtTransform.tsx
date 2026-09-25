import React, { ReactNode } from "react";

export default function SplashArtTransform({ scale, translation, children }: { scale: number, translation: { x: number, y: number }, children: ReactNode }) {
    return (
        <div style={{ height: "100%", width: "100%", position: "relative", touchAction: "none" }}>
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    touchAction: "none",
                    cursor: "all-scroll",
                    userSelect: "none",
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        transform: `translate(${translation.x}px, ${translation.y}px) scale(${scale})`,
                        transformOrigin: "0 0",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
