import React, { ReactElement } from "react";
import { IPostDisplayCard, PostDisplayCard } from "features/post";

export default function ForumPostsFallback({ posts }: { posts: IPostDisplayCard[] }): ReactElement {
    return <div className="page-container">
        <div className="page-content post-display-list">
            {posts.map(post => <PostDisplayCard key={post.id} {...post}/>)}
        </div>
    </div>
}
