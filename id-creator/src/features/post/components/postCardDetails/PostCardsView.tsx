'use client'
import React, { ReactElement, ReactNode } from "react";
import ArrowDownIcon from "assets/icons/ArrowDownIcon";
import ArrowUpIcon from "assets/icons/ArrowUpIcon";
import IconButton from "components/ui/iconButton/IconButton";
import { useCarouselIndex } from "hooks/useCarouselIndex";
import PostCarousel from "features/post/components/post/PostCarousel";
import "./PostCardDetails.css";

export default function PostCardsView({ images, title, alts, summaries }: { images: string[], title: string, alts?: (string | undefined)[], summaries: ReactNode[] }): ReactElement {
    const carousel = useCarouselIndex(images.length)
    const canNavigate = images.length > 1
    const counter = (live: boolean) => <p className="post-card-details-counter" aria-live={live ? "polite" : undefined}>{carousel.index + 1} / {images.length}</p>

    return <div className="post-card-details">
        {canNavigate && counter(true)}
        <div className="post-card-details-body">
            {canNavigate && <IconButton className="post-card-details-side left" label="Previous ID/EGO" onClick={carousel.prev} disabled={!carousel.hasPrev}>
                <span className="post-card-details-side-icon"><ArrowDownIcon/></span>
            </IconButton>}
            <div className="post-card-details-content">
                <PostCarousel images={images} title={title} alts={alts} carousel={carousel}/>
                {summaries.map((summary, i) => <div key={i} className="post-card-details-slide" hidden={i !== carousel.index}>
                    {summary}
                </div>)}
            </div>
            {canNavigate && <IconButton className="post-card-details-side right" label="Next ID/EGO" onClick={carousel.next} disabled={!carousel.hasNext}>
                <span className="post-card-details-side-icon"><ArrowUpIcon/></span>
            </IconButton>}
        </div>
        {canNavigate && counter(false)}
    </div>
}
