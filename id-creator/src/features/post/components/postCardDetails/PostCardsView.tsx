'use client'
import React, { ReactElement, ReactNode } from "react";
import ArrowDownIcon from "assets/icons/ArrowDownIcon";
import ArrowUpIcon from "assets/icons/ArrowUpIcon";
import IconButton from "components/ui/iconButton/IconButton";
import { useCarouselIndex } from "features/post/hooks/useCarouselIndex";
import PostCarousel from "features/post/components/post/PostCarousel";
import "./PostCardDetails.css";

export default function PostCardsView({ images, title, summaries }: { images: string[], title: string, summaries: ReactNode[] }): ReactElement {
    const carousel = useCarouselIndex(images.length)
    const hasSummaries = summaries.some(Boolean)

    return <>
        <PostCarousel images={images} title={title} carousel={carousel}/>
        {hasSummaries && <div className="post-card-details">
            {images.length > 1 && <div className="post-card-details-nav">
                <IconButton className="post-card-details-arrow left" label="Previous ID/EGO" onClick={carousel.prev} disabled={!carousel.hasPrev}>
                    <ArrowDownIcon/>
                </IconButton>
                <p aria-live="polite">{carousel.index + 1} / {images.length}</p>
                <IconButton className="post-card-details-arrow right" label="Next ID/EGO" onClick={carousel.next} disabled={!carousel.hasNext}>
                    <ArrowUpIcon/>
                </IconButton>
            </div>}
            {summaries.map((summary, i) => <div key={i} className="post-card-details-slide" hidden={i !== carousel.index}>
                {summary}
            </div>)}
        </div>}
    </>
}
