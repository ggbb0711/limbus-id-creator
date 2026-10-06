import React, { ReactElement } from "react";
import { IPost } from "features/post/types/IPost";
import { getTag } from "features/post/utils/TagList";
import TagChip from "features/post/components/tagChip/TagChip";
import AuthorBadge from "features/post/components/authorBadge/AuthorBadge";
import formatDisplayDate from "utils/formatDisplayDate";
import PostCarousel from "./PostCarousel";
import LivePostStats from "./LivePostStats";
import "./Post.css";
import "../shared/Style.css"

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
        <PostCarousel images={post.imagesAttach} title={post.title}/>
        <div className="description-txt" dangerouslySetInnerHTML={{ __html: post.description }}></div>
        <div className="center-element">
            <LivePostStats initialPost={post}/>
        </div>
    </article>
}
