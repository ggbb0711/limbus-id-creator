import React from "react";
import Link from "next/link";
import "./Blog.css";
import { IBlogPostMeta } from "./posts";
import BlogTags from "./BlogTags";
import { BlogTag } from "./blogTags";
import formatDisplayDate from "utils/formatDisplayDate";

export default function BlogPage({ posts, tags, activeTag }: { posts: IBlogPostMeta[], tags: BlogTag[], activeTag?: BlogTag }) {
    const shownPosts = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts

    return (
        <div className="page-container">
            <div className="page-content">
                <h1 className="page-title">Blog</h1>
                <p className="blog-intro">
                    Guides and news for the Limbus Company ID Creator.
                </p>
                <nav className="blog-tag-filter" aria-label="Filter posts by tag">
                    <Link href="/blog" className={`blog-tag ${!activeTag ? "active" : ""}`}>All</Link>
                    <BlogTags tags={tags} activeTag={activeTag} />
                </nav>
                <div className="blog-post-list">
                    {shownPosts.length === 0 && <p className="blog-intro">No posts with this tag yet.</p>}
                    {shownPosts.map((post) => (
                        <article key={post.slug} className="blog-post-card">
                            <BlogTags tags={post.tags} activeTag={activeTag} />
                            <h2 className="blog-post-card-title">
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h2>
                            <p className="blog-post-date">{formatDisplayDate(post.published)}</p>
                            <p className="blog-post-card-description">{post.description}</p>
                            <Link href={`/blog/${post.slug}`} className="blog-read-more">Read post</Link>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}
