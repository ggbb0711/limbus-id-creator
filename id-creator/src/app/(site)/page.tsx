import React from "react";
import type { Metadata } from "next";
import HomePage from "features/home/homePage/HomePage";
import { getLatestPosts } from "api/server/posts";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
}

export const revalidate = 60

export default async function Page() {
    const data = await getLatestPosts(4)
    return <HomePage latestPosts={data?.list ?? []} />
}
