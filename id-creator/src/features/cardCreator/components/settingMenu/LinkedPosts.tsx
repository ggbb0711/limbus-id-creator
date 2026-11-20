import React, { ReactElement } from "react";
import Link from "next/link";
import AccordionSection from "components/ui/accordionSection/AccordionSection";
import { ILinkedPost } from "features/cardCreator/types/ISaveFile";

export const linkedPostsTitle = (count: number) => `Posted in ${count} post${count === 1 ? "" : "s"}`

export default function LinkedPosts({ posts, saveName }: { posts: ILinkedPost[], saveName: string }): ReactElement | null {
    if (posts.length === 0) return null

    return <div className="save-cloud-posted-in">
        <AccordionSection title={linkedPostsTitle(posts.length)} defaultOpen={false}>
            <ul className="save-cloud-posted-in-list" tabIndex={0} aria-label={`Posts using ${saveName}`}>
                {posts.map(post => <li key={post.id}>
                    <Link href={`/post/${encodeURIComponent(post.id)}`}>{post.title}</Link>
                </li>)}
            </ul>
        </AccordionSection>
    </div>
}
