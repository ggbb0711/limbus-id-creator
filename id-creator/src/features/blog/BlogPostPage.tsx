import React from "react";
import Link from "next/link";
import "./Blog.css";
import { IBlogHeading, IBlogPost, IBlogPostMeta } from "./posts";
import BlogTags from "./BlogTags";
import BlogToc from "./BlogToc";
import Markdown from "./Markdown";
import formatDisplayDate from "utils/formatDisplayDate";

export default function BlogPostPage({ post, headings, otherPosts }: { post: IBlogPost, headings: IBlogHeading[], otherPosts: IBlogPostMeta[] }) {
    return (
        <div className="page-container">
            <div className="page-content blog-post-layout">
                <header className="blog-post-header">
                    <Link href="/blog" className="blog-back-link">&larr; Blog</Link>
                    <BlogTags tags={post.tags} />
                    <h1 className="page-title">{post.title}</h1>
                    <p className="blog-post-date">Published {formatDisplayDate(post.published)}</p>
                </header>
                {headings.length > 0 && <BlogToc headings={headings} />}
                <article className="blog-post-body">
                    <Markdown content={post.content} />
                    {otherPosts.length > 0 && <aside className="blog-more-posts">
                        <h2 className="blog-more-posts-title">More posts</h2>
                        <ul>
                            {otherPosts.map((p) => <li key={p.slug}><Link href={`/blog/${p.slug}`}>{p.title}</Link></li>)}
                        </ul>
                    </aside>}
                </article>
            </div>
        </div>
    );
}
