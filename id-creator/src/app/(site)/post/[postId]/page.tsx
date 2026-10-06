import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "features/post/api/server/posts";
import PostPage from "features/post/postPage/PostPage";
import { postMetadata } from "features/post/utils/postMetadata";

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
    return <PostPage initialPost={post} />
}
