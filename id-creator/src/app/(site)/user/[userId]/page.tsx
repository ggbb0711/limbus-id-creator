import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUser } from "api/server/users";
import UserPage from "features/user/userPage/UserPage";

export async function generateMetadata({ params }: PageProps<"/user/[userId]">): Promise<Metadata> {
    const { userId } = await params
    const user = await getUser(userId)
    if (!user) return { title: "User not found" }
    return {
        title: user.userName,
        description: `Custom Limbus Company Identities and E.G.Os by ${user.userName}`,
        alternates: { canonical: `/user/${userId}` },
        openGraph: { images: [user.userIcon] },
    }
}

export default async function Page({ params }: PageProps<"/user/[userId]">) {
    const { userId } = await params
    const user = await getUser(userId)
    if (!user) notFound()
    // Don't serialize the email into the server-rendered HTML; the UI never shows it
    return <UserPage initialUser={{ ...user, userEmail: "", owned: false }} />
}
