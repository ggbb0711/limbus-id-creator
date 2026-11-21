'use client'
import React, { ReactElement, useState } from "react";
import Image from "next/image";
import ImageViewer, { imageAlt } from "components/ui/imageViewer/ImageViewer";
import { CarouselIndex } from "hooks/useCarouselIndex";
import "./Post.css";

export default function PostCarousel({ images, title, alts, carousel }: { images: string[], title: string, alts?: string[], carousel: CarouselIndex }): ReactElement {
    const [isViewing, setIsViewing] = useState(false)

    return <div className="post-carousel-container" aria-roledescription="carousel" aria-label={`${title} images`}>
        {images.map((image, i) =>
            <button key={`${i}-${image.slice(-24)}`} type="button" className={`icon-button post-img-button ${i !== carousel.index ? "hidden" : ""}`}
                aria-label={`Open image ${i + 1} of ${images.length}`} onClick={() => setIsViewing(true)}>
                <Image className="post-img" src={image} alt={alts?.[i] ?? imageAlt(title, i)} fill sizes="(max-width: 1200px) 100vw, 1200px" quality={90} preload={i === 0} style={{ objectFit: "contain" }}/>
            </button>
        )}
        {isViewing && <ImageViewer images={images} title={title} alts={alts} carousel={carousel} onClose={() => setIsViewing(false)}/>}
    </div>
}
