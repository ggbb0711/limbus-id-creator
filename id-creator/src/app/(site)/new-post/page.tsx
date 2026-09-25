import React from "react";
import type { Metadata } from "next";
import NewPostPage from "features/post/newPostPage/NewPostPage";

export const metadata: Metadata = {
    title: "Create a post",
    robots: { index: false },
}

export default function Page() {
    return <NewPostPage />
}
