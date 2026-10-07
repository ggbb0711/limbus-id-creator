import React, { ReactElement, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { IPostDisplayCard } from "features/post/types/IPostDisplayCard";
import "./PostSidebar.css";

interface PostSidebarSectionProps {
    title: string
    viewAllHref: string
    posts: IPostDisplayCard[]
}

function SidebarPost({ post }: { post: IPostDisplayCard }): ReactElement {
    return <li>
        <Link href={"/post/" + post.id} className="post-sidebar-item">
            {post.cardImg && <Image className="post-sidebar-thumb" src={post.cardImg} alt={post.title} width={96} height={67} sizes="96px" />}
            <div className="post-sidebar-item-txt">
                <p className="post-sidebar-item-title">{post.title}</p>
                <p className="post-sidebar-item-meta">by {post.userName}</p>
            </div>
        </Link>
    </li>
}

function PostSidebarSection({ title, viewAllHref, posts }: PostSidebarSectionProps): ReactElement {
    const titleId = useId()
    return <section className="post-sidebar-section" aria-labelledby={titleId}>
        <div className="post-sidebar-header">
            <h2 id={titleId} className="post-sidebar-title">{title}</h2>
            <Link href={viewAllHref} className="post-sidebar-view-all">View all</Link>
        </div>
        <ul className="post-sidebar-list">
            {posts.map((post) => <SidebarPost key={post.id} post={post} />)}
        </ul>
    </section>
}

interface PostSidebarProps {
    author: { userId: string, userName: string }
    authorPosts: IPostDisplayCard[]
    latestPosts: IPostDisplayCard[]
}

export default function PostSidebar({ author, authorPosts, latestPosts }: PostSidebarProps): ReactElement {
    const sections: PostSidebarSectionProps[] = [
        { title: `More from ${author.userName}`, viewAllHref: "/user/" + author.userId, posts: authorPosts },
        { title: "Latest IDs & E.G.Os", viewAllHref: "/forum", posts: latestPosts },
    ]

    return <aside className="post-sidebar">
        {sections.filter((section) => section.posts.length > 0).map((section) => <PostSidebarSection key={section.title} {...section} />)}
    </aside>
}
