import React from "react";
import type { Metadata } from "next";
import HomePage from "features/home/homePage/HomePage";
import { getLatestPosts } from "features/post/api/server/posts";
import { serverConfig } from "config/env.server";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
}

export const revalidate = 60

export default async function Page() {
    const result = await getLatestPosts(serverConfig.homeLatestPosts)
    return <HomePage latestPosts={result.ok ? result.data.list : null} />
}
