import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "api/server/posts";
import PostPage from "features/post/postPage/PostPage";
import stripHtml from "utils/stripHtml";

export async function generateMetadata({ params }: PageProps<"/post/[postId]">): Promise<Metadata> {
    const { postId } = await params
    const post = await getPost(postId)
    if (!post) return { title: "Post not found" }

    const description = stripHtml(post.description).slice(0, 160) || `A custom Limbus Company creation by ${post.userName}`
    const images = post.imagesAttach.slice(0, 1)
    return {
        title: post.title,
        description,
        alternates: { canonical: `/post/${postId}` },
        openGraph: { type: "article", title: post.title, description, images },
        twitter: { card: "summary_large_image", title: post.title, description, images },
    }
}

export default async function Page({ params }: PageProps<"/post/[postId]">) {
    const { postId } = await params
    const post = await getPost(postId)
    if (!post) notFound()
    return <PostPage initialPost={post} />
}
