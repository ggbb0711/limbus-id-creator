import React from "react";
import { PostDisplayCardLoading } from "features/post/components/paginatedPost/PostDisplayCard";
import "features/post/components/paginatedPost/PaginatedPost.css";

export default function Loading() {
    return <div className="page-container">
        <div className="page-content post-display-list">
            {Array.from({ length: 4 }, (_, i) => <PostDisplayCardLoading key={i} />)}
        </div>
    </div>
}
