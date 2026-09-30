import React, { Suspense } from "react";
import type { Metadata } from "next";
import ForumPage from "features/forum/forumPage/ForumPage";
import ForumIntro from "features/forum/forumIntro/ForumIntro";
import { getLatestPosts } from "api/server/posts";
import ForumLoading from "./loading";

export const metadata: Metadata = {
    title: "Forum",
    description: "Browse custom Limbus Company Identities and E.G.Os made by the community.",
    alternates: { canonical: "/forum" },
}

export default async function Page({ searchParams }: PageProps<"/forum">) {
    const params = await searchParams
    const isDefaultQuery = Object.keys(params).length === 0
    const initialPosts = isDefaultQuery ? await getLatestPosts(10) : null

    return <>
        <ForumIntro />
        <Suspense fallback={<ForumLoading />}><ForumPage initialPosts={initialPosts} /></Suspense>
    </>
}
