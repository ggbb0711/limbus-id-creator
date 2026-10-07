import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLatestPostsExcluding, getPost, getPostsByUser } from "features/post/api/server/posts";
import { getFirstComments } from "features/post/api/server/comments";
import PostPage from "features/post/postPage/PostPage";
import PostSidebar from "features/post/components/postSidebar/PostSidebar";
import { postMetadata } from "features/post/utils/postMetadata";
import { appConfig } from "config/env.client";

const POSTS_PER_SIDEBAR_SECTION = 4

export async function generateMetadata({ params }: PageProps<"/post/[postId]">): Promise<Metadata> {
    const { postId } = await params
    const post = await getPost(postId)
    if (!post) return { title: "Post not found" }
    return postMetadata(post)
}

export default async function Page({ params }: PageProps<"/post/[postId]">) {
    const { postId } = await params
    const post = await getPost(postId)
    if (!post) notFound()

    const [initialComments, byAuthor] = await Promise.all([
        getFirstComments(postId, appConfig.paging.commentsPerPage),
        getPostsByUser(post.userId, POSTS_PER_SIDEBAR_SECTION, [post.id]),
    ])
    const authorPosts = byAuthor.ok ? byAuthor.data.list : []
    const latest = await getLatestPostsExcluding(POSTS_PER_SIDEBAR_SECTION, [post.id, ...authorPosts.map(p => p.id)])
    const latestPosts = latest.ok ? latest.data.list : []

    return <PostPage
        initialPost={post}
        initialComments={initialComments}
        sidebar={<PostSidebar author={post} authorPosts={authorPosts} latestPosts={latestPosts}/>}
    />
}
