'use client'
import React, { KeyboardEvent, ReactElement, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ArrowDownIcon from "assets/icons/ArrowDownIcon";
import ArrowUpIcon from "assets/icons/ArrowUpIcon";
import CloseIcon from "assets/icons/CloseIcon";
import IconButton from "components/ui/iconButton/IconButton";
import { useDialog } from "components/ui/dialog/useDialog";
import { CarouselIndex } from "hooks/useCarouselIndex";
import "./ImageViewer.css";

export const imageAlt = (title: string, index: number) => `${title} – image ${index + 1}`

export function CarouselArrows({ carousel, className }: { carousel: CarouselIndex, className: string }): ReactElement {
    return <>
        {carousel.hasPrev && <IconButton className={`${className} left`} label="Previous image" onClick={carousel.prev}>
            <ArrowDownIcon/>
        </IconButton>}
        {carousel.hasNext && <IconButton className={`${className} right`} label="Next image" onClick={carousel.next}>
            <ArrowUpIcon/>
        </IconButton>}
    </>
}

export default function ImageViewer({ images, title, alts, carousel, onClose }: { images: string[], title: string, alts?: string[], carousel: CarouselIndex, onClose: () => void }): ReactElement {
    const containerRef = useRef<HTMLDivElement>(null)
    useDialog(true, onClose, containerRef)

    function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === "ArrowLeft") carousel.prev()
        else if (event.key === "ArrowRight") carousel.next()
    }

    return <div className="image-pop-up-container" ref={containerRef} role="dialog" aria-modal="true" aria-label="Image viewer" tabIndex={-1} onKeyDown={onKeyDown}>
        <TransformWrapper minScale={0.05} maxScale={3} limitToBounds={false} doubleClick={{ disabled: true }}>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <img src={images[carousel.index]} alt={alts?.[carousel.index] ?? imageAlt(title, carousel.index)} className="image-pop-up" />
            </TransformComponent>
        </TransformWrapper>
        <IconButton className="image-pop-up-close" label="Close image viewer" onClick={onClose}>
            <CloseIcon/>
        </IconButton>
        <CarouselArrows carousel={carousel} className="image-pop-up-arrow"/>
    </div>
}
