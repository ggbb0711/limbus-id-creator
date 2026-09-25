import React from "react";
import "./BlogPage.css";

export default function BlogPage() {
    return (
        <div className="page-container">
            <div className="page-content blog-page-content">
                <h1 className="page-title">Blog</h1>
                <p className="blog-empty-state">No blog posts yet. Stay tuned for updates!</p>
            </div>
        </div>
    );
}
