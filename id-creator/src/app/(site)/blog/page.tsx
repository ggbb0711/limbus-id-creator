import React, { Suspense } from "react";
import type { Metadata } from "next";
import BlogPage from "features/blog/BlogPage";
import FilteredBlogPage from "features/blog/FilteredBlogPage";
import { getAllPosts, getAllTags } from "features/blog/posts";
import { pageMetadata } from "config/siteMetadata";

export const metadata: Metadata = pageMetadata({
    title: "Blog",
    description: "Guides and news for the Limbus Company ID Creator: how to use the Identity and E.G.O editors and how to share your creations.",
    path: "/blog",
})

export default function Page() {
    const posts = getAllPosts()
    const tags = getAllTags()
    return <Suspense fallback={<BlogPage posts={posts} tags={tags} />}>
        <FilteredBlogPage posts={posts} tags={tags} />
    </Suspense>
}
