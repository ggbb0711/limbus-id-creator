import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "features/blog/BlogPostPage";
import { getAllPosts, getHeadings, getPost } from "features/blog/posts";

export const dynamicParams = false

export function generateStaticParams() {
    return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
    const { slug } = await params
    const post = getPost(slug)
    if (!post) return { title: "Post not found" }
    return {
        title: post.title,
        description: post.description,
        alternates: { canonical: `/blog/${slug}` },
        openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.published, tags: post.tags },
    }
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
    const { slug } = await params
    const post = getPost(slug)
    if (!post) notFound()
    const otherPosts = getAllPosts().filter((p) => p.slug !== slug)
    return <BlogPostPage post={post} headings={getHeadings(post.content)} otherPosts={otherPosts} />
}
