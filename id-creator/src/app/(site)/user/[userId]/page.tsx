import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUser } from "features/user/api/server/users";
import UserPage from "features/user/userPage/UserPage";
import { userMetadata } from "features/user/utils/userMetadata";

export const revalidate = 60

export function generateStaticParams() {
    return []
}

export async function generateMetadata({ params }: PageProps<"/user/[userId]">): Promise<Metadata> {
    const { userId } = await params
    const user = await getUser(userId)
    if (!user) return { title: "User not found" }
    return userMetadata(user)
}

export default async function Page({ params }: PageProps<"/user/[userId]">) {
    const { userId } = await params
    const user = await getUser(userId)
    if (!user) notFound()
    return <UserPage initialUser={{ ...user, owned: false }} />
}
