import React from "react";
import { PostDisplayCardLoading } from "components/paginatedPost/PostDisplayCard";
import "components/paginatedPost/PaginatedPost.css";

export default function Loading() {
    return <div className="page-container">
        <div className="page-content post-display-list">
            {Array.from({ length: 4 }, (_, i) => <PostDisplayCardLoading key={i} />)}
        </div>
    </div>
}
