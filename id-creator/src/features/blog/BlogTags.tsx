import React from "react";
import Link from "next/link";
import { BlogTag } from "./blogTags";

export default function BlogTags({ tags, activeTag }: { tags: BlogTag[], activeTag?: BlogTag }) {
    return <ul className="blog-tags">
        {tags.map((tag) => (
            <li key={tag}>
                <Link href={`/blog?tag=${encodeURIComponent(tag)}`} className={`blog-tag ${tag === activeTag ? "active" : ""}`}>{tag}</Link>
            </li>
        ))}
    </ul>
}
