import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLatestPostsExcluding, getPost, getPostsByUser } from "api/server/posts";
import { getFirstComments } from "api/server/comments";
import PostPage from "features/post/postPage/PostPage";
import PostSidebar from "features/post/components/postSidebar/PostSidebar";
import "features/post/postPage/PostPage.css";
import stripHtml from "utils/stripHtml";

const postsPerSection = 4

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

    const [initialComments, byAuthor] = await Promise.all([
        getFirstComments(postId, 10),
        getPostsByUser(post.userId, postsPerSection, [post.id]),
    ])
    const authorPosts = byAuthor?.list ?? []
    const latest = (await getLatestPostsExcluding(postsPerSection, [post.id, ...authorPosts.map((p) => p.id)]))?.list ?? []

    return <div className="post-page-layout">
        <div className="post-page-main">
            <PostPage initialPost={post} initialComments={initialComments} />
        </div>
        <PostSidebar post={post} authorPosts={authorPosts} latestPosts={latest} />
    </div>
}
