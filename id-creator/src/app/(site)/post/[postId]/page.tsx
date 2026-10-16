import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLatestPostsExcluding, getPost, getPostsByUser } from "features/post/api/server/posts";
import { getFirstComments } from "features/post/api/server/comments";
import PostPage from "features/post/postPage/PostPage";
import PostSidebar from "features/post/components/postSidebar/PostSidebar";
import { postMetadata } from "features/post/utils/postMetadata";
import { appConfig } from "config/env.client";
import { serverConfig } from "config/env.server";
import { isUnavailable } from "api/server/serverFetch";
import UnavailablePage from "components/unavailablePage/UnavailablePage";
import { getUnavailableContent } from "components/unavailablePage/unavailableContent";

const POSTS_PER_SIDEBAR_SECTION = 4

export const revalidate = 3600

export function generateStaticParams() {
    return []
}

export async function generateMetadata({ params }: PageProps<"/post/[postId]">): Promise<Metadata> {
    const { postId } = await params
    const post = await getPost(postId)
    if (!post) return { title: "Post not found" }
    if (isUnavailable(post)) return { title: getUnavailableContent(post.code).title, robots: { index: false } }
    return postMetadata(post)
}

export default async function Page({ params }: PageProps<"/post/[postId]">) {
    const { postId } = await params
    const post = await getPost(postId)
    if (!post) notFound()
    if (isUnavailable(post)) return <UnavailablePage code={post.code}/>

    const [initialComments, byAuthor] = await Promise.all([
        getFirstComments(postId, appConfig.paging.commentsPerPage),
        getPostsByUser(post.userId, POSTS_PER_SIDEBAR_SECTION, [post.id], serverConfig.apiRevalidateSeconds),
    ])
    const authorPosts = byAuthor.ok ? byAuthor.data.list : []
    const latest = await getLatestPostsExcluding(POSTS_PER_SIDEBAR_SECTION, [post.id, ...authorPosts.map(p => p.id)], serverConfig.apiRevalidateSeconds)
    const latestPosts = latest.ok ? latest.data.list : []

    return <PostPage
        initialPost={post}
        initialComments={initialComments}
        sidebar={<PostSidebar author={post} authorPosts={authorPosts} latestPosts={latestPosts}/>}
    />
}
