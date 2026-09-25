import React, { ReactElement, useEffect, useRef } from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import "./SinnerSplashArtRepositionInput.css"

type SplashTransform = { scale: number, translation: { x: number, y: number } }

// Drag/scroll surface that edits the splash art's scale and translation. Uses the same
// translate(x,y) scale(s) model (origin 0 0) as the card, so values are interchangeable.
export default function SinnerSplashArtRepositionInput({scale,translation,onChange}:{scale:number,translation:{
    x:number,
    y:number,
},onChange:(value:SplashTransform)=>void}):ReactElement{
    const transformRef = useRef<ReactZoomPanPinchRef>(null)
    const lastEmitted = useRef({ scale, x: translation.x, y: translation.y })

    // Keep the surface in sync when the value changes from outside (loading a save, reset)
    useEffect(()=>{
        const last = lastEmitted.current
        if (last.scale === scale && last.x === translation.x && last.y === translation.y) return
        lastEmitted.current = { scale, x: translation.x, y: translation.y }
        transformRef.current?.setTransform(translation.x, translation.y, scale, 0)
    },[scale, translation.x, translation.y])

    return(
        <div className="sinner-splash-art-reposition-container">
            <TransformWrapper
                ref={transformRef}
                initialScale={scale}
                initialPositionX={translation.x}
                initialPositionY={translation.y}
                minScale={0.05}
                maxScale={3}
                limitToBounds={false}
                doubleClick={{ disabled: true }}
                onTransformed={(_, state)=>{
                    const last = lastEmitted.current
                    if (last.scale === state.scale && last.x === state.positionX && last.y === state.positionY) return
                    lastEmitted.current = { scale: state.scale, x: state.positionX, y: state.positionY }
                    onChange({ scale: state.scale, translation: { x: state.positionX, y: state.positionY } })
                }}>
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%", cursor: "all-scroll" }} contentStyle={{ width: "100%", height: "100%" }}>
                    <div style={{ width: "100%", height: "100%" }}/>
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
}
