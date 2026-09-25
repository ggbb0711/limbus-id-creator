import React from "react";
import type { Metadata } from "next";
import BlogPage from "features/static/blogPage/BlogPage";

export const metadata: Metadata = {
    title: "Blog",
    alternates: { canonical: "/blog" },
}

export default function Page() {
    return <BlogPage />
}
