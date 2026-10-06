import React from "react";
import type { Metadata } from "next";
import BlogPage from "features/static/blogPage/BlogPage";
import { pageMetadata } from "config/siteMetadata";

export const metadata: Metadata = pageMetadata({
    title: "Blog",
    description: "News and updates about Limbus ID Creator, the fan-made Limbus Company card maker.",
    path: "/blog",
})

export default function Page() {
    return <BlogPage />
}
