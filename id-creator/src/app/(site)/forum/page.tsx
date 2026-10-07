import React, { Suspense } from "react";
import type { Metadata } from "next";
import ForumPage from "features/forum/forumPage/ForumPage";
import ForumIntro from "features/forum/forumIntro/ForumIntro";
import { parseForumParams, toSearchParams } from "features/forum/utils/forumQuery";
import { GetPostsParams, TagList, buildPostsQuery } from "features/post";
import { getPosts } from "features/post/api/server/posts";
import { appConfig } from "config/env.client";
import ForumLoading from "./loading";

export const metadata: Metadata = {
    title: "Forum",
    description: "Browse custom Limbus Company Identities and E.G.Os made by the community.",
    alternates: { canonical: "/forum" },
}

export default async function Page({ searchParams }: PageProps<"/forum">) {
    const { q, tagKeys, sort, page } = parseForumParams(toSearchParams(await searchParams))
    const params: GetPostsParams = {
        title: q,
        tag: tagKeys.map(key => TagList[key].tagName),
        sortedBy: sort,
        page,
        limit: appConfig.paging.postsPerPage,
    }
    const result = await getPosts(params)
    const initialPosts = result.ok ? { query: buildPostsQuery(params), data: result.data } : undefined

    return <>
        <ForumIntro />
        <Suspense fallback={<ForumLoading />}><ForumPage initialPosts={initialPosts} /></Suspense>
    </>
}
