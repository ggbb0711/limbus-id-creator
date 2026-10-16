import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUser } from "features/user/api/server/users";
import UserPage from "features/user/userPage/UserPage";
import { userMetadata } from "features/user/utils/userMetadata";
import { isUnavailable } from "api/server/serverFetch";
import UnavailablePage from "components/unavailablePage/UnavailablePage";
import { getUnavailableContent } from "components/unavailablePage/unavailableContent";

export const revalidate = 3600

export function generateStaticParams() {
    return []
}

export async function generateMetadata({ params }: PageProps<"/user/[userId]">): Promise<Metadata> {
    const { userId } = await params
    const user = await getUser(userId)
    if (!user) return { title: "User not found" }
    if (isUnavailable(user)) return { title: getUnavailableContent(user.code).title, robots: { index: false } }
    return userMetadata(user)
}

export default async function Page({ params }: PageProps<"/user/[userId]">) {
    const { userId } = await params
    const user = await getUser(userId)
    if (!user) notFound()
    if (isUnavailable(user)) return <UnavailablePage code={user.code}/>
    return <UserPage initialUser={{ ...user, owned: false }} />
}
