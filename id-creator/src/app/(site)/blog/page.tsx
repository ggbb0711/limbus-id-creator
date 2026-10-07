import React from "react";
import type { Metadata } from "next";
import BlogPage from "features/blog/BlogPage";
import { getAllPosts, getAllTags } from "features/blog/posts";
import { isBlogTag } from "features/blog/blogTags";
import { pageMetadata } from "config/siteMetadata";

export const metadata: Metadata = pageMetadata({
    title: "Blog",
    description: "Guides and news for the Limbus Company ID Creator: how to use the Identity and E.G.O editors and how to share your creations.",
    path: "/blog",
})

export default async function Page({ searchParams }: PageProps<"/blog">) {
    const { tag } = await searchParams
    return <BlogPage posts={getAllPosts()} tags={getAllTags()} activeTag={isBlogTag(tag) ? tag : undefined} />
}
