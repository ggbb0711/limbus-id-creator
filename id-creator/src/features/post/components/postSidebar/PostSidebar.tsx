import React, { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { IPost } from "types/iPost/IPost";
import "./PostSidebar.css";

interface IPostSidebarSection {
    title: string
    viewAllHref: string
    posts: IPost[]
}

function SidebarPost({ post }: { post: IPost }): ReactElement {
    return <li>
        <Link href={"/post/" + post.id} className="post-sidebar-item">
            {post.imagesAttach[0] && <Image className="post-sidebar-thumb" src={post.imagesAttach[0]} alt={post.title} width={96} height={67} sizes="96px" />}
            <div className="post-sidebar-item-txt">
                <p className="post-sidebar-item-title">{post.title}</p>
                <p className="post-sidebar-item-meta">by {post.userName}</p>
            </div>
        </Link>
    </li>
}

export default function PostSidebar({ post, authorPosts, latestPosts }: { post: IPost, authorPosts: IPost[], latestPosts: IPost[] }): ReactElement {
    const sections: IPostSidebarSection[] = [
        { title: `More from ${post.userName}`, viewAllHref: "/user/" + post.userId, posts: authorPosts },
        { title: "Latest IDs & E.G.Os", viewAllHref: "/forum", posts: latestPosts },
    ]

    return <aside className="post-sidebar">
        {sections.filter((s) => s.posts.length > 0).map((section) => (
            <section key={section.title} className="post-sidebar-section">
                <div className="post-sidebar-header">
                    <h2 className="post-sidebar-title">{section.title}</h2>
                    <Link href={section.viewAllHref} className="post-sidebar-view-all">View all</Link>
                </div>
                <ul className="post-sidebar-list">
                    {section.posts.map((p) => <SidebarPost key={p.id} post={p} />)}
                </ul>
            </section>
        ))}
    </aside>
}
