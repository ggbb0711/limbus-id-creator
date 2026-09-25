import React, { Suspense } from "react";
import type { Metadata } from "next";
import ForumPage from "features/forum/forumPage/ForumPage";
import ForumLoading from "./loading";

export const metadata: Metadata = {
    title: "Forum",
    description: "Browse custom Limbus Company Identities and E.G.Os made by the community.",
    alternates: { canonical: "/forum" },
}

export default function Page() {
    return <Suspense fallback={<ForumLoading />}><ForumPage /></Suspense>
}
