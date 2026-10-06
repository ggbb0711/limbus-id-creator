import React, { ReactElement } from "react";
import { IPost } from "features/post/types/IPost";
import { getTag } from "features/post/utils/TagList";
import TagChip from "features/post/components/tagChip/TagChip";
import AuthorBadge from "features/post/components/authorBadge/AuthorBadge";
import formatDisplayDate from "utils/formatDisplayDate";
import PostCarousel from "./PostCarousel";
import LivePostStats from "./LivePostStats";
import ShareMenu from "features/post/components/shareMenu/ShareMenu";
import "./Post.css";
import "../shared/Style.css"
import SectionErrorBoundary from "components/errorBoundary/SectionErrorBoundary";
import { sanitizePostHtml } from "utils/htmlUtils";

export default function Post({ post }: { post: IPost }): ReactElement {
    return <article className="post-container post-page-element-container">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-date">Posted: {formatDisplayDate(post.created)}</p>
        <div className="post-author-container">
            <div className="center-element">
                <AuthorBadge userId={post.userId} userName={post.userName} userIcon={post.userIcon} size={80} iconClassName="post-author-icon"/>
            </div>
        </div>
        <div className="center-element">
            {post.tags.map(tag => <TagChip key={tag} tag={getTag(tag)} className="card-tag center-element" iconClassName="card-tag-img" iconSize={10}/>)}
        </div>
        <SectionErrorBoundary context="postCarousel" label="post images">
            <PostCarousel images={post.imagesAttach} title={post.title}/>
        </SectionErrorBoundary>
        <div className="description-txt" dangerouslySetInnerHTML={{ __html: sanitizePostHtml(post.description) }}></div>
        <div className="center-element">
            <LivePostStats postId={post.id} viewCount={post.viewCount} commentCount={post.commentCount}/>
            <ShareMenu postId={post.id} title={post.title} triggerClassName="card-tag center-element" iconSize={16}/>
        </div>
    </article>
}
