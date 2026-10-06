import React, { ReactElement } from "react";
import Post from "features/post/components/post/Post";
import { IPost } from "features/post/types/IPost";
import PostComments from "./PostComments";

export default function PostPage({ initialPost }: { initialPost: IPost }): ReactElement {
    return <div className="page-container">
        <div className="page-content">
            <Post post={initialPost}/>
        </div>
        <PostComments postId={initialPost.id}/>
    </div>
}
