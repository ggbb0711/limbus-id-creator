import React from "react";
import type { Metadata } from "next";
import EditPostPage from "features/post/editPostPage/EditPostPage";

export const metadata: Metadata = {
    title: "Edit post",
    robots: { index: false },
}

export default async function Page({ params }: PageProps<"/post/[postId]/edit">) {
    const { postId } = await params
    return <EditPostPage postId={postId}/>
}
