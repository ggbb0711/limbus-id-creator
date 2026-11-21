import React, { ReactElement } from "react";
import { IPost, IPostCardSnapshot } from "features/post/types/IPost";
import { getTag } from "features/post/utils/TagList";
import TagChip from "features/post/components/tagChip/TagChip";
import AuthorBadge from "features/post/components/authorBadge/AuthorBadge";
import formatDisplayDate from "utils/formatDisplayDate";
import PostCardsView from "features/post/components/postCardDetails/PostCardsView";
import { CardSummary, SummaryCard, migrateEgoInfo, migrateIdInfo, summaryCardAlt } from "features/cardCreator";
import { imageAlt } from "components/ui/imageViewer/ImageViewer";
import LivePostStats from "./LivePostStats";
import ShareMenu from "features/post/components/shareMenu/ShareMenu";
import PostOwnerActions from "features/post/components/postOwnerActions/PostOwnerActions";
import "./Post.css";
import "../shared/Style.css"
import SectionErrorBoundary from "components/errorBoundary/SectionErrorBoundary";
import { sanitizePostHtml } from "utils/htmlUtils";

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value)

function toSummaryCard(card: IPostCardSnapshot | null | undefined): SummaryCard | null {
    if (!card || !isRecord(card.saveInfo)) return null
    if (card.kind === "Identity") return { kind: "Identity", info: migrateIdInfo(card.saveInfo) }
    if (card.kind === "Ego") return { kind: "Ego", info: migrateEgoInfo(card.saveInfo) }
    return null
}

export default function Post({ post }: { post: IPost }): ReactElement {
    const slides = post.slides ?? []
    const cards = slides.map(slide => toSummaryCard(slide.card))
    const summaries = cards.map((card, i) => card && <CardSummary key={i} card={card}/>)
    const alts = cards.map((card, i) => card ? summaryCardAlt(card, post.userName) : imageAlt(post.title, i))
    return <article className="post-container post-page-element-container">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-date">Posted: {formatDisplayDate(post.created)}{post.updated && <> · Edited: {formatDisplayDate(post.updated)}</>}</p>
        <div className="post-author-container">
            <div className="center-element">
                <AuthorBadge userId={post.userId} userName={post.userName} userIcon={post.userIcon} size={80} iconClassName="post-author-icon"/>
            </div>
        </div>
        <div className="center-element post-tag-list">
            {post.tags.map(tag => {
                const known = getTag(tag)
                return <TagChip key={tag} tag={known} href={known ? `/forum?tag=${encodeURIComponent(tag)}` : undefined}
                    className={`card-tag center-element ${known ? "card-tag-link" : ""}`} iconClassName="card-tag-img" iconSize={10}/>
            })}
        </div>
        <SectionErrorBoundary context="postCarousel" label="post images">
            <PostCardsView images={slides.map(slide => slide.imageUrl)} title={post.title} alts={alts} summaries={summaries}/>
        </SectionErrorBoundary>
        <div className="description-txt" dangerouslySetInnerHTML={{ __html: sanitizePostHtml(post.description) }}></div>
        <div className="center-element">
            <LivePostStats postId={post.id} viewCount={post.viewCount} commentCount={post.commentCount}/>
            <ShareMenu postId={post.id} title={post.title} triggerClassName="card-tag center-element" iconSize={16}/>
            <PostOwnerActions postId={post.id} userId={post.userId} title={post.title} className="card-tag center-element"/>
        </div>
    </article>
}
