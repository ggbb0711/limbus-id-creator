import React, { ReactElement, ReactNode } from "react";
import Post from "features/post/components/post/Post";
import { IPost } from "features/post/types/IPost";
import { IComment } from "features/post/types/IComment";
import PostComments from "./PostComments";
import SectionErrorBoundary from "components/errorBoundary/SectionErrorBoundary";
import "./PostPage.css";

interface PostPageProps {
    initialPost: IPost
    initialComments?: IComment[]
    sidebar?: ReactNode
}

export default function PostPage({ initialPost, initialComments, sidebar }: PostPageProps): ReactElement {
    return <div className="post-page-layout">
        <div className="page-content post-page-post">
            <Post post={initialPost}/>
        </div>
        {sidebar && <div className="post-page-sidebar">{sidebar}</div>}
        <div className="post-page-comments">
            <SectionErrorBoundary context="comments" label="comments">
                <PostComments postId={initialPost.id} initialComments={initialComments}/>
            </SectionErrorBoundary>
        </div>
    </div>
}
