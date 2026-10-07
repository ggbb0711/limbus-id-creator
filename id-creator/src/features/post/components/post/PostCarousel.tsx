'use client'
import React, { KeyboardEvent, ReactElement, useRef, useState } from "react";
import Image from "next/image";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import ArrowDownIcon from "assets/icons/ArrowDownIcon";
import ArrowUpIcon from "assets/icons/ArrowUpIcon";
import CloseIcon from "assets/icons/CloseIcon";
import IconButton from "components/ui/iconButton/IconButton";
import { useDialog } from "components/ui/dialog/useDialog";
import { CarouselIndex, useCarouselIndex } from "features/post/hooks/useCarouselIndex";
import "./Post.css";

export const imageAlt = (title: string, index: number) => `${title} – image ${index + 1}`

function CarouselArrows({ carousel, className }: { carousel: CarouselIndex, className: string }): ReactElement {
    return <>
        {carousel.hasPrev && <IconButton className={`${className} left`} label="Previous image" onClick={carousel.prev}>
            <ArrowDownIcon/>
        </IconButton>}
        {carousel.hasNext && <IconButton className={`${className} right`} label="Next image" onClick={carousel.next}>
            <ArrowUpIcon/>
        </IconButton>}
    </>
}

export function ViewImagePopUp({ images, title, carousel, onClose }: { images: string[], title: string, carousel: CarouselIndex, onClose: () => void }): ReactElement {
    const containerRef = useRef<HTMLDivElement>(null)
    useDialog(true, onClose, containerRef)

    function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === "ArrowLeft") carousel.prev()
        else if (event.key === "ArrowRight") carousel.next()
    }

    return <div className="image-pop-up-container" ref={containerRef} role="dialog" aria-modal="true" aria-label="Image viewer" tabIndex={-1} onKeyDown={onKeyDown}>
        <TransformWrapper minScale={0.05} maxScale={3} limitToBounds={false} doubleClick={{ disabled: true }}>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                <img src={images[carousel.index]} alt={imageAlt(title, carousel.index)} className="image-pop-up" />
            </TransformComponent>
        </TransformWrapper>
        <IconButton className="image-pop-up-close" label="Close image viewer" onClick={onClose}>
            <CloseIcon/>
        </IconButton>
        <CarouselArrows carousel={carousel} className="image-pop-up-arrow"/>
    </div>
}

export default function PostCarousel({ images, title }: { images: string[], title: string }): ReactElement {
    const carousel = useCarouselIndex(images.length)
    const [isViewing, setIsViewing] = useState(false)

    return <div className="post-carousel-container" aria-roledescription="carousel" aria-label={`${title} images`}>
        <CarouselArrows carousel={carousel} className="post-carousel-arrow"/>
        {images.map((image, i) =>
            <button key={`${i}-${image.slice(-24)}`} type="button" className={`icon-button post-img-button ${i !== carousel.index ? "hidden" : ""}`}
                aria-label={`Open image ${i + 1} of ${images.length}`} onClick={() => setIsViewing(true)}>
                <Image className="post-img" src={image} alt={imageAlt(title, i)} fill sizes="(max-width: 1200px) 100vw, 1200px" quality={90} preload={i === 0} style={{ objectFit: "contain" }}/>
            </button>
        )}
        {isViewing && <ViewImagePopUp images={images} title={title} carousel={carousel} onClose={() => setIsViewing(false)}/>}
    </div>
}
