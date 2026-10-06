import React from "react";
import { appConfig } from "config/env.client";
import { PostListSkeleton } from "features/post/components/paginatedPost/PostDisplayCard";
import "features/post/components/paginatedPost/PaginatedPost.css";

export default function Loading() {
    return <div className="page-container">
        <div className="page-content post-display-list" aria-busy="true">
            <PostListSkeleton count={appConfig.paging.postsPerPage} />
        </div>
    </div>
}
