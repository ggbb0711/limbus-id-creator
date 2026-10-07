'use client'
import React from "react";
import { useSearchParams } from "next/navigation";
import type { IBlogPostMeta } from "./posts";
import BlogPage from "./BlogPage";
import { BlogTag, isBlogTag } from "./blogTags";

export default function FilteredBlogPage({ posts, tags }: { posts: IBlogPostMeta[], tags: BlogTag[] }) {
    const tag = useSearchParams().get("tag")
    return <BlogPage posts={posts} tags={tags} activeTag={isBlogTag(tag) ? tag : undefined} />
}
